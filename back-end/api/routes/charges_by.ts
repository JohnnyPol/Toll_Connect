import { Middleware, Request, Response, Router } from 'express';
import { die, ErrorType, get_date, set_date } from '@/api/util.ts';

import TollOperator, { UserLevel } from '@/models/toll_operator.ts';
import Pass from '@/models/pass.ts';
import Toll from '@/models/toll.ts';
import Tag from '@/models/tag.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:operator_id/:date_from/:date_to',
		oapi.path({
			tags: ['Operations'],
			summary: 'Passes and Charges of Other Operators',
			description:
				'Returns an object containing a list of pass events and their costs per visiting operator for the given period.',
			operationId: 'getChargesBy',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
				{
					in: 'path',
					name: 'tollOpID',
					schema: { type: 'string' },
					required: true,
					description: 'The ID of the operator',
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
								$ref: '#/definitions/ChargesByResponse',
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
			const tollOpID: string = req.params.operator_id;
			const date_from: Date = get_date(req.params.date_from);
			const date_to: Date = get_date(req.params.date_to);

			if (
				req.user.id !== tollOpID && req.user.level !== UserLevel.Admin
			) {
				die(res, ErrorType.BadRequest, 'permission denied');
			}

			try {
				const operator = await TollOperator.findById(tollOpID);
				if (!operator) {
					return die(res, ErrorType.BadRequest, 'Operator not found');
				}

				const tollIds = await Toll.find({
					tollOperator: tollOpID,
				}, '_id');

				const tagIds = await Tag.find({
					tollOperator: tollOpID,
				}, '_id');

				const passes = await Pass.find({
					$and: [
						{ 'toll._id': { $in: tollIds } },
						{ 'tag._id': { $nin: tagIds } },
					],
					time: { $gte: date_from, $lte: date_to },
				}).sort('time');

				// console.log(passes);

				// Group passes by visiting operators (tag.tollOperator)
				const operatorCharges = new Map<
					string,
					{ nPasses: number; passesCost: number }
				>();

				for (const pass of passes) {
					const tag = await Tag.findById(pass.tag);
					if (!tag) {
						console.warn(`Tag not found for pass ${pass._id}`);
						continue;
					}
					if (tag.tollOperator == null) {
						console.warn('Invalid operator reference');
						continue;
					}

					if (tag.tollOperator == null) {
						console.warn('invalid operator reference');
						continue;
					}

					const visitingOpID = tag.tollOperator;
					const passCharge = pass.charge;

					if (!operatorCharges.has(visitingOpID)) {
						operatorCharges.set(
							visitingOpID,
							{ nPasses: 0, passesCost: 0 },
						);
					}

					const data = operatorCharges.get(visitingOpID)!;
					data.nPasses += 1;
					data.passesCost += passCharge;
				}

				// Convert map to list format
				const processed = Array.from(operatorCharges.entries())
				.map(( [visitingOpID, { nPasses, passesCost }]) => ({
					visitingOpID,
					nPasses,
					passesCost: Number(
						passesCost.toFixed(2),
					),
				}))
				.sort((a, b) => a.visitingOpID.localeCompare(
					b.visitingOpID,
				));

				res.status(200).json({
					tollOpID,
					requestTimestamp: set_date(new Date()),
					periodFrom: set_date(date_from),
					periodTo: set_date(date_to),
					vOpList: processed,
				});
			} catch (err) {
				console.error('Error fetching passes cost:', err);
				die(res, ErrorType.Internal, 'Error fetching passes cost');
			}
		},
	);

	return router;
}

