import { Middleware, Request, Response, Router } from 'npm:express';

import { die, ErrorType, get_date, set_date } from '../util.ts';

import TollOperator from '../../models/toll_operator.ts';
import Pass from '../../models/pass.ts';
import Tag from '../../models/tag.ts';
import Toll from '../../models/toll.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:operator_id/:tag_id/:date_from/:date_to',
		async (req: Request, res: Response) => {
			const stationOpID: string = req.params.operator_id;
			const tagOpID: string = req.params.tag_id;
			const date_from: Date = get_date(req.params.date_from);
			const date_to: Date = get_date(req.params.date_to);

			try {
				const operator = await TollOperator.findById(
					stationOpID,
				);
				const tag = await TollOperator.findById(
					tagOpID,
				);

				if (!operator) {
					return die(
						res,
						ErrorType.BadRequest,
						'Operator not found',
					);
				}
				if (!tag) {
					return die(
						res,
						ErrorType.BadRequest,
						'Tag not found',
					);
				}

				const tagIds = await Tag.find({
					tollOperator: tagOpID,
				}, '_id');
				const tollIds = await Toll.find({
					tollOperator: stationOpID,
				}, '_id');

				const passes = await Pass.find({
					$and: [
						{ "tag._id": { $in: tagIds } },
						{ "toll._id": { $in: tollIds } },
					],
					time: {
						$gte: date_from,
						$lte: date_to,
					},
				}).sort('time');

				res.status(200).json({
					stationOpID,
					tagOpID,
					requestTimestamp: set_date(new Date()),
					periodFrom: set_date(date_from),
					periodTo: set_date(date_to),
					nPasses: passes.length,
					passList: passes.map((pass, index) => ({
						passIndex: index + 1,
						passID: pass._id,
						stationID: pass.toll._id,
						timestamp: set_date(pass.time),
						tagID: pass.tag._id,
						passCharge: pass.charge,
					})),
				});
			} catch (err) {
				console.error(
					'Error fetching pass analysis:',
					err,
				);
				die(
					res,
					ErrorType.Internal,
					'Internal Server Error',
				);
			}
		},
	);

	return router;
}
