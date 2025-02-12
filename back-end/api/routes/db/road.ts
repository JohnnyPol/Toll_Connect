import { Middleware, Request, Response, Router } from 'express';
import { die, ErrorType, check_admin } from '@/api/util.ts';
import Road from '@/models/road.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use(check_admin);

	/**
	 * GET /road
	 * Retrieves all road documents
	 */
	router.get(
		'/',
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve all road documents',
			operationId: 'getAllRoads',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of road documents',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/RoadsSchema', 
								},
							},
						},
					},
				},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },
			}
		}),
		async (_req: Request, res: Response) => {
		try {
			const roads = await Road.find();
			res.status(200).json(roads);
		} catch (error) {
			console.error('Error fetching roads:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /road/:id
	 * Retrieves a specific road document by its ID
	 */
	router.get(
		'/:id',
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve road document with specified id',
			operationId: 'getRoadWithID',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ in: 'path', name: 'id', schema: { type: 'string' }, required: true, description: 'Road Id' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of road document',
					content: {
						'application/json': {
							schema: {
									$ref: '#/definitions/RoadsSchema', 
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
		const { id } = req.params;

		try {
			const road = await Road.findById(id);
			if (!road) return die(res, ErrorType.BadRequest, 'Road not found');

			res.status(200).json(road);
		} catch (error) {
			console.error('Error fetching road:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	return router;
}
