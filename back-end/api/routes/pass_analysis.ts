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
		oapi.path({
			tags: ['Operations'],
			summary: 'Pass Analysis between Operators',
			description: 'Returns an object containing a list of pass events made with tags from tagOpID at stations of stationOpID for the given period.',
			operationId: 'getPassAnalysis',
			parameters: [
				{ in: 'path', name: 'stationOpID', schema: { type: 'string' }, required: true, description: 'The ID of the station operator' },
				{ in: 'path', name: 'tagOpID', schema: { type: 'string' }, required: true, description: 'The ID of the tag operator/provider' },
				{ in: 'path', name: 'date_from', schema: { type: 'string', format: 'date' }, required: true, description: 'The start date of the period (YYYYMMDD)' },
				{ in: 'path', name: 'date_to', schema: { type: 'string', format: 'date' }, required: true, description: 'The end date of the period (YYYYMMDD)' }
			],
			responses: {
				200: {
					description: 'Successful retrieval of pass information',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/PassAnalysisResponse'
							}
						}
					}
				},
				400: {
					description: 'Bad Request - Invalid input',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/Error'
							}
						}
					}
				},
				401: {
					description: 'Unauthorized - Invalid JWT',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/AdminErrorResponse'
							}
						}
					}
				},
				500: {
					description: 'Internal Server Error',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/Error'
							}
						}
					}
				}
			}
		}),
		async (req: Request, res: Response) => {
			const stationOpID: string = req.params.operator_id;
			const tagOpID: string = req.params.tag_id;
			const date_from: Date = get_date(req.params.date_from);
			const date_to: Date = get_date(req.params.date_to);

			if (req.user.id !== tollOpID && req.user.level !== UserLevel.Admin)
				die(res, ErrorType.BadRequest, 'No permission for requested operator');

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
