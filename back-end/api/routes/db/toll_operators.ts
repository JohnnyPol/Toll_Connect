import { Middleware, Request, Response, Router } from 'express';
import { check_admin, die, ErrorType } from '@/api/util.ts';
import TollOperator, { UserLevel } from '@/models/toll_operator.ts';

const return_fields = ['_id', 'name', 'userLevel', 'email', 'VAT', 'address'];

export default function (oapi: Middleware): Router {
	const router = new Router();

	/**
	 * GET /toll-operators
	 * Retrieves all toll operator documents
	 */
	router.get(
		'/', 
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve all operator documents',
			operationId: 'getAllOperators',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of operator documents',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/OperatorsSchema', 
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
			const tollOperators = await TollOperator.find({
				userLevel: UserLevel.Operator,
			}, return_fields);
			res.status(200).json(tollOperators);
		} catch (error) {
			console.error('Error fetching toll operators:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /toll-operators/:id
	 * Retrieves a specific toll operator document by its ID
	 */
	router.get(
		'/:id', 
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve operator document with specified id',
			operationId: 'getOperatorWithID',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ in: 'path', name: 'id', schema: { type: 'string' }, required: true, description: 'Operator Id' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of operator document',
					content: {
						'application/json': {
							schema: {
									$ref: '#/definitions/OperatorsSchema', 
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
			const tollOperator = await TollOperator.findById(
				id,
				return_fields,
			);
			if (!tollOperator) {
				return die(
					res,
					ErrorType.BadRequest,
					'Toll Operator not found',
				);
			}

			res.status(200).json(tollOperator);
		} catch (error) {
			console.error('Error fetching toll operator:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /toll-operators/all
	 * Retrieves all toll operators
	 */
	router.get(
		'/admin/all',
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve all operators id',
			operationId: 'getAllOperatorsID',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of operators ids',
					content: {
						'application/json': {
							schema: {
									type: 'array',
									items: {
										type: 'string',
									}
								},
							},
						},
					},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },
				}
		}),
		check_admin,
		async (_req: Request, res: Response) => {
			try {
				const tollOperators = await TollOperator.find();
				res.status(200).json(tollOperators.map((op) => op._id));
			} catch (error) {
				console.error('Error fetching toll operators:', error);
				die(res, ErrorType.Internal, error);
			}
		},
	);

	return router;
}
