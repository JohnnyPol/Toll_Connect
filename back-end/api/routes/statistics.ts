import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType, get_date, set_date } from '../util.ts';

import { difference } from 'jsr:@std/datetime';
import Toll from '@/models/toll.ts';
import TollOperators, { TollOperatorDocument, UserLevel } from '@/models/toll_operator.ts';
import Pass from '@/models/pass.ts';
import Tag from '@/models/tag.ts';
import moment from 'npm:moment';

const groupByOperator = (field: string) => ({
	$group: {
		_id: '$' + field + '.tollOperator',
		passes: { $sum: 1 },
		cost: { $sum: '$charge' },
	},
});

const groupByDateOperator = (field: string) => ({
	$group: {
		_id: {
			date: {
				$dateToString: {
					date: '$time',
					format: '%Y-%m-%d',
				},
			},
			operator: '$' + field + '.tollOperator',
		},
		passes: { $sum: 1 },
		cost: { $sum: '$charge' },
	},
});

const makeDateArray = {
	$group: {
		_id: '$_id.date',
		operators: {
			$push: {
				operator: '$_id.operator',
				passes: '$passes',
				cost: '$cost',
			},
		},
	},
};

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/heatmap',
		async (req: Request, res: Response) => {
			try {
				const tolls = await Toll.find({}).sort('_id');
				const passes = await Pass.find({}).sort('toll');

				const resp: {
					latitude: number;
					longitude: number;
					count: number;
				}[] = [];

				let i = 0;
				tolls.forEach((toll) => {
					const { _id, latitude, longitude } = toll;
					let len = resp.push({ latitude, longitude, count: 0 });
					for (
						;
						i < passes.length && passes[i].toll._id == _id;
						++i
					) {
						resp[len - 1].count++;
					}
				});

				res.status(200).json(resp);
			} catch (err) {
				console.error('Error in heatmap:', err);
				die(res, ErrorType.Internal, 'Error in heatmap');
			}
		},
	);

	router.get(
		'/:toll_id/:start_date/:end_date',
		async (req: Request, res: Response) => {
			const tollID: string = req.params.toll_id;
			const startDate: Date = get_date(req.params.start_date);
			const endDate: Date = get_date(req.params.end_date);

			try {
				// Fetch the toll document
				const tollDocument = await Toll.findById(tollID);
				if (!tollDocument) {
					return die(
						res,
						ErrorType.BadRequest,
						'Toll station not found',
					);
				}

				// Populate the 'road' field in the tollDocument
				await tollDocument.populate('road');

				// Fetch passes and ensure 'tag' is fully populated
				const passes = await Pass.find({
					'toll._id': tollID,
					time: { $gte: startDate, $lte: endDate },
				})
					.populate({
						path: 'tag',
						model: Tag, // Ensure we populate using the correct model
						select: 'tollOperator',
					});

				// Ensure all passes have their tag.tollOperator populated
				if (
					!passes.every((pass) => pass.tag && pass.tag.tollOperator)
				) {
					console.warn(
						'Warning: Some passes are missing tag.tollOperator',
					);
				}

				// Calculate the number of days in the period
				//const daysInPeriod = moment(endDate).diff(moment(startDate), 'days') || 1;
				const { days } = difference(startDate, endDate);
				const totalPasses = passes.length;
				const avgPasses = totalPasses / <number> days;

				// Aggregate passes per operator
				const operatorData = new Map<string, number>();

				passes.forEach((pass) => {
					if (!pass.tag || !pass.tag.tollOperator) {
						console.warn(
							'Skipping pass with missing tag.tollOperator:',
							pass,
						);
						return;
					}

					const operatorID = String(pass.tag.tollOperator); // Convert ObjectId to string
					operatorData.set(
						operatorID,
						(operatorData.get(operatorID) || 0) + 1,
					);
				});

				// Convert Map to List
				const operatorsPassesList = Array.from(operatorData.entries())
					.map(([operator, passes]) => ({
						operator,
						passes,
					}));

				// Construct and send response
				res.status(200).json({
					toll: tollDocument,
					avg_passes: avgPasses,
					operators: operatorsPassesList,
				});
			} catch (err) {
				console.error('Error fetching toll data:', err);
				die(res, ErrorType.Internal, 'Error fetching toll data');
			}
		},
	);

	router.get(
		'/timeseries/incomingPasses/:date_from/:date_to',
		/**
		 * Returns incoming pass data (on tolls of identified operator)
		 * for all other visiting operators (tags) for each date in range.
		 *
		 * Query: as_operator? (OperatorID)
		 * Return: {
		 *     date: Date, operators: { operator: string, passes: number, cost: number }[]
		 * }[]
		 *
		 * Notes:
		 *  - If Admin perform the search with as_operator
		 * 	- If Operator perform the search with JWT inferred operator
		 */
		async (req: Request, res: Response) => {
			const date_from = get_date(req.params.date_from);
			const date_to = get_date(req.params.date_to);
			const op_id: TollOperatorDocument['_id'] | undefined =
				req.query.as_operator;

			if (req.user.level === UserLevel.Admin && op_id === undefined) {
				return die(res, ErrorType.BadRequest, 'as_operator required');
			}
			if (await TollOperators.findById(op_id) === null) {
				return die(res, ErrorType.BadRequest, 'Invalid as_operator');
			}

			try {
				const response = await Pass.aggregate([
					{
						$match: {
							'toll.tollOperator': op_id,
							'tag.tollOperator': { $ne: op_id },
							time: { $gte: date_from, $lte: date_to },
						},
					},
					groupByDateOperator('tag'),
					makeDateArray,
					{ $sort: { '_id': 1 } },
				]);

				res.status(200).json(response.map(
					({ _id, operators }) => ({ date: _id, operators }),
				));
			} catch (err) {
				console.error('error:', err);
				die(res, ErrorType.Internal, 'Internal server error');
			}
		},
	);

	router.get(
		'/timeseries/outgoingPasses/:date_from/:date_to',
		/**
		 * Returns outgoing pass data (on tolls of all other operators)
		 * from tags of identified operator for each date in range.
		 *
		 * Query: as_operator? (OperatorID)
		 * Return: {
		 *     date: Date, operators: { operator: string, passes: number, cost: number }[]
		 * }[]
		 *
		 * Notes:
		 *  - If Admin perform the search with as_operator
		 * 	- If Operator perform the search with JWT inferred operator
		 */
		async (req: Request, res: Response) => {
			const date_from = get_date(req.params.date_from);
			const date_to = get_date(req.params.date_to);
			const op_id: TollOperatorDocument['_id'] | undefined =
				req.query.as_operator;

			if (req.user.level === UserLevel.Admin && op_id === undefined) {
				return die(res, ErrorType.BadRequest, 'as_operator required');
			}
			if (await TollOperators.findById(op_id) === null) {
				return die(res, ErrorType.BadRequest, 'Invalid as_operator');
			}

			try {
				const response = await Pass.aggregate([
					{
						$match: {
							'tag.tollOperator': op_id,
							'toll.tollOperator': { $ne: op_id },
							time: { $gte: date_from, $lte: date_to },
						},
					},
					groupByDateOperator('toll'),
					makeDateArray,
					{ $sort: { '_id': 1 } },
				]);

				res.status(200).json(response.map(
					({ _id, operators }) => ({ date: _id, operators }),
				));
			} catch (err) {
				console.error('error:', err);
				die(res, ErrorType.Internal, 'Internal server error');
			}
		},
	);

	router.get(
		'/aggregate/incomingPasses/:date_from/:date_to',
		/**
		 * Returns aggregated incoming pass data (on tolls of identified operator)
		 * for all other visiting operators (tags) in range.
		 *
		 * Query: as_operator? (OperatorID)
		 * Return: { operator: string, passes: number, cost: number }[]
		 *
		 * Notes:
		 *  - If Admin perform the search with as_operator
		 * 	- If Operator perform the search with JWT inferred operator
		 */
		async (req: Request, res: Response) => {
			const date_from = get_date(req.params.date_from);
			const date_to = get_date(req.params.date_to);
			const op_id: TollOperatorDocument['_id'] | undefined =
				req.query.as_operator;

			if (/* TODO: logged in as admin && */ op_id === undefined) {
				return die(res, ErrorType.BadRequest, 'as_operator required');
			}
			if (await TollOperators.findById(op_id) === null) {
				return die(res, ErrorType.BadRequest, 'Invalid as_operator');
			}

			try {
				const response = await Pass.aggregate([
					{
						$match: {
							'toll.tollOperator': op_id,
							'tag.tollOperator': { $ne: op_id },
							time: { $gte: date_from, $lte: date_to },
						},
					},
					groupByOperator('tag'),
					{ $sort: { '_id': 1 } },
				]);

				res.status(200).json(response);
			} catch (err) {
				console.error('error:', err);
				die(res, ErrorType.Internal, 'Internal server error');
			}
		},
	);

	router.get(
		'/aggregate/outgoingPasses/:date_from/:date_to',
		/**
		 * Returns aggregated outgoing pass data (on tolls of all other operators)
		 * from tags of identified operator in range.
		 *
		 * Query: as_operator? (OperatorID)
		 * Return: { operator: string, passes: number, cost: number }[]
		 *
		 * Notes:
		 *  - If Admin perform the search with as_operator
		 * 	- If Operator perform the search with JWT inferred operator
		 */
		async (req: Request, res: Response) => {
			const date_from = get_date(req.params.date_from);
			const date_to = get_date(req.params.date_to);
			const op_id: TollOperatorDocument['_id'] | undefined =
				req.query.as_operator;

			if (req.user.level === UserLevel.Admin && op_id === undefined) {
				return die(res, ErrorType.BadRequest, 'as_operator required');
			}
			if (await TollOperators.findById(op_id) === null) {
				return die(res, ErrorType.BadRequest, 'Invalid as_operator');
			}

			try {
				const response = await Pass.aggregate([
					{
						$match: {
							'tag.tollOperator': op_id,
							'toll.tollOperator': { $ne: op_id },
							time: { $gte: date_from, $lte: date_to },
						},
					},
					groupByOperator('toll'),
					{ $sort: { '_id': 1 } },
				]);

				res.status(200).json(response);
			} catch (err) {
				console.error('error:', err);
				die(res, ErrorType.Internal, 'Internal server error');
			}
		},
	);

	return router;
}
