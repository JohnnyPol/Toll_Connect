import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType, check_admin } from '../../util.ts';
import Pass from '../../../models/pass.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use(check_admin);

	/**
	 * GET /pass
	 * Retrieves all pass documents
	 */
	router.get(
		'/', 
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve all pass documents',
			operationId: 'getAllPasses',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of pass documents',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/PassesSchema', 
								},
							},
						},
					},
				},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },
			},
		}),
		async (_req: Request, res: Response) => {
		try {
			const passes = await Pass.find();
			res.status(200).json(passes);
		} catch (error) {
			console.error('Error fetching passes:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /pass/:id
	 * Retrieves a specific pass document by its ID
	 */
	router.get(
		'/:id', 
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve pass document with specified id',
			operationId: 'getPassWithID',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ in: 'path', name: 'id', schema: { type: 'string' }, required: true, description: 'Pass Id' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of pass document',
					content: {
						'application/json': {
							schema: {
									$ref: '#/definitions/PassesSchema', 
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
			const pass = await Pass.findById(id);
			if (!pass) return die(res, ErrorType.BadRequest, 'Pass not found');

			res.status(200).json(pass);
		} catch (error) {
			console.error('Error fetching pass:', error);
			die(res, ErrorType.Internal, 'Error fetching pass');
		}
	});

	return router;
}
