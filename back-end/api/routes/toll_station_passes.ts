import { Middleware, Request, Response, Router } from 'express';
import { die, ErrorType, get_date, set_date } from '@/api/util.ts';

import Toll from '@/models/toll.ts';
import TollOperator, { UserLevel } from '@/models/toll_operator.ts';
import Pass from '@/models/pass.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:station_id/:date_from/:date_to',
		oapi.path({
			tags: ['Operations'], // Replace with the appropriate tag
			summary: 'Toll Station Passes',
			description:
				'Returns an object containing a list of pass details for the given toll station and period.',
			operationId: 'getTollStationPasses',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
				{
					in: 'path',
					name: 'station_id',
					schema: { type: 'string' },
					required: true,
					description: 'The unique ID of the toll station',
				},
				{
					in: 'path',
					name: 'date_from',
					schema: { type: 'string', format: 'date' },
					required: true,
					description: 'The start date of the period (YYYYMMDD)',
				},
				{
					in: 'path',
					name: 'date_to',
					schema: { type: 'string', format: 'date' },
					required: true,
					description: 'The end date of the period (YYYYMMDD)',
				},
			],
			responses: {
				200: {
					description: 'Successful retrieval of pass information',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/TollStationPassesResponse',
							},
						},
					},
				},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },					
			}
		}),
		async (req: Request, res: Response) => {
			const stationID: string = req.params.station_id;
			const date_from: Date = get_date(req.params.date_from);
			const date_to: Date = get_date(req.params.date_to, true);

			if (
				req.user.id !== stationID && req.user.level !== UserLevel.Admin
			) {
				die(res, ErrorType.BadRequest, 'permission denied');
			}

			try {
				const tollStation = await Toll.findById(stationID);
				if (!tollStation) {
					return die(
						res,
						ErrorType.BadRequest,
						'Invalid Toll Station ID',
					);
				}

				const operator = await TollOperator.findById(
					tollStation.tollOperator,
				);
				if (!operator) {
					return die(
						res,
						ErrorType.Internal,
						'Toll station operator not found',
					);
				}
				const stationOperator = operator.name;

				const passes = await Pass.find({
					'toll._id': stationID,
					time: { $gte: date_from, $lte: date_to },
				}).populate('tag').sort('time');

				// Construct response object
				res.status(200).json({
					stationID,
					stationOperator,
					requestTimestamp: set_date(new Date()),
					periodFrom: set_date(date_from),
					periodTo: set_date(date_to),
					nPasses: passes.length,
					passList: passes.map((
						pass,
						index: number,
					) => {
						return {
							passIndex: index + 1,
							passID: pass._id,
							timestamp: set_date(
								pass.time,
							),
							tagID: pass.tag._id,
							tagProvider: pass.tag.tollOperator,
							passType: pass.tag.tollOperator ===
									operator._id
								? 'home'
								: 'visitor',
							passCharge: pass.charge,
						};
					}),
				});
			} catch (error) {
				console.error('Error fetching toll station passes:', error);
				die(res, ErrorType.Internal, error);
			}
		},
	);

	return router;
}
