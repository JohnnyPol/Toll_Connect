import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType, check_admin } from '../../util.ts';
import Payment from '../../../models/payment.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use(check_admin);

	/**
	 * GET /
	 * Retrieves all payment documents
	 */
	router.get(
		'/', 
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve all payment documents',
			operationId: 'getAllPayments',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of payment documents',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/Payment', 
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
			const payments = await Payment.find();				;
			res.status(200).json(payments);
		} catch (error) {
			console.error('Error fetching payments:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /payments/:id
	 * Retrieves a specific payment document by its ID
	 */
	router.get(
		'/:id',
		oapi.path({
			tags: ['DB'],
			summary: 'Retrieve payment document with specified id',
			operationId: 'getPaymentWithID',
			parameters: [
				{ $ref: '#/definitions/TokenHeader' },
				{ in: 'path', name: 'id', schema: { type: 'string' }, required: true, description: 'Payment Id' },
				{ $ref: '#/definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of payment document',
					content: {
						'application/json': {
							schema: {
									$ref: '#/definitions/Payment', 
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
			const payment = await Payment.findById(id);
			if (!payment) {
				return die(res, ErrorType.BadRequest, 'Payment not found');
			}

			res.status(200).json(payment);
		} catch (error) {
			console.error('Error fetching payment:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	return router;
}
