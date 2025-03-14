import { Middleware, Request, Response, Router } from 'express';
import Payments, { PaymentDocument, PaymentStatus } from '@/models/payment.ts';
import { die, ErrorType, get_date } from '@/api/util.ts';
import { TollOperatorDocument, UserLevel } from '@/models/toll_operator.ts';
import { Token } from '@/authentication/jwt.ts';

interface PaymentsQuery {
	page_size: number;
	page_number: number;
	target_op_id?: TollOperatorDocument['_id'];
	is_payer: boolean;
	is_payee: boolean;
}

function parse_query(query: object): PaymentsQuery | string {
	if (!('page_size' in query)) {
		return 'Did not provide page size';
	}
	if (!('page_number' in query)) {
		return 'Did not provide page number';
	}

	const page_size = parseInt(<string> query.page_size);
	const page_number = parseInt(<string> query.page_number);
	if (isNaN(page_size)) {
		return 'Page size is not a number';
	}
	if (isNaN(page_number)) {
		return 'Page number is not a number';
	}

	const target_op_id = ('target_op_id' in query)
		? <string> query.target_op_id
		: undefined;
	const is_payer = ('is_payer' in query) ? true : false;

	const is_payee = ('is_payee' in query) ? true : false;

	return { page_size, page_number, target_op_id, is_payer, is_payee };
}

function operators_to_query(
	is_payer: boolean,
	is_payee: boolean,
	user: TollOperatorDocument['_id'],
	target: TollOperatorDocument['_id'] | undefined,
) {
	if (is_payer && is_payee) {
		return target
			? {
				$or: [{ payer: user, payee: target }, {
					payee: user,
					payer: target,
				}],
			}
			: { $or: [{ payer: user }, { payee: user }] };
	} else if (is_payer) {
		return target ? { payer: user, payee: target } : { payer: user };
	} else if (is_payee) {
		return target ? { payee: user, payer: target } : { payee: user };
	} //ADMIN
	else {
		return target ? { $or: [{ payer: target }, { payee: target }] } : {};
	}
}

function status_to_query(status: PaymentStatus) {
	const epoch = new Date(0);
	switch (status) {
		case PaymentStatus.Created:
			return {
				dateofPayment: epoch,
				dateofValidation: epoch,
			};
		case PaymentStatus.Paid:
			return {
				dateofPayment: { $gt: epoch },
				dateofValidation: epoch,
			};
		case PaymentStatus.Validated:
			return {
				dateofPayment: { $gt: epoch },
				dateofValidation: { $gt: epoch },
			};
	}
}

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:status/:date_from/:date_to',
		/*
		 * Query: page_size, page_number, target_op_id?, is_payer?
		 * Return: {
		 *     total_pages: number, results: Payment[]
		 * }, reverse time sorting
		 *
		 * Notes:
		 *   - If status == Validated, disregard is_payer
		 *   - If Admin, disregard is_payer and sent everything
		 */
		oapi.path({
			tags: ['Payments'],
			summary: 'Get payments',
			operationId: 'getPayments',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
				{
					in: 'path',
					name: 'status',
					schema: {
						type: 'string',
						enum: ['Created', 'Paid', 'Validated'],
					},
					required: true,
					description: 'Payment status',
				},
				{
					in: 'path',
					name: 'date_from',
					schema: { type: 'string', format: 'date' },
					required: true,
					description: 'Start date for filtering',
				},
				{
					in: 'path',
					name: 'date_to',
					schema: { type: 'string', format: 'date' },
					required: true,
					description: 'End date for filtering',
				},
				{
					in: 'query',
					name: 'page_size',
					schema: { type: 'integer' },
					description: 'Number of results per page',
				},
				{
					in: 'query',
					name: 'page_number',
					schema: { type: 'integer' },
					description: 'Page number',
				},
				{
					in: 'query',
					name: 'target_op_id',
					schema: { type: 'string' },
					description: 'Target operator ID (optional)',
				},
				{
					in: 'query',
					name: 'is_payer',
					schema: { type: 'boolean' },
					description: 'Filter by payer (optional)',
				},
				{
					in: 'query',
					name: 'is_payee',
					schema: { type: 'boolean' },
					description: 'Filter by payee (optional)',
				},
				{ $ref: '#definitions/Format' },
			],
			responses: {
				200: {
					description: 'Successful retrieval of payments',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/GetPaymentsResponse',
							},
						},
					},
				},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },
			},
		}),
		async (req: Request, res: Response) => {
			const query = parse_query(req.query);
			if (typeof query === 'string') {
				return die(res, ErrorType.BadRequest, query);
			}

			const status: PaymentStatus = parseInt(req.params.status);
			const date_from = get_date(req.params.date_from);
			const date_to = get_date(req.params.date_to, true);
			const user = (<Token> req.user).id;
			const isAdmin = (<Token> req.user).level === UserLevel.Admin;
			const { page_size, page_number, target_op_id, is_payer, is_payee } =
				query;

			if (PaymentStatus[req.params.status] === undefined) {
				return die(res, ErrorType.BadRequest, 'Invalid status');
			}
			if (is_payer === false && is_payee === false && isAdmin === false) {
				return die(
					res,
					ErrorType.BadRequest,
					'only admin allowed this request',
				);
			}

			const results = await Payments.aggregate([
				{
					$match: {
						...operators_to_query(
							is_payer,
							is_payee,
							user,
							target_op_id,
						),
						...status_to_query(status),
						dateofCharge: { $gte: date_from, $lte: date_to },
						$expr: { $ne: ['$payer', '$payee'] },
					},
				},
				{
					$facet: {
						total_pages: [{ $count: 'count' }],
						results: [
							{ $sort: { dateOfCharge: -1 } },
							{ $skip: page_size * (page_number - 1) },
							{ $limit: page_size },
						],
					},
				},
				{
					$project: {
						total_pages: {
							$ceil: {
								$divide: [
									{ $arrayElemAt: ['$total_pages.count', 0] },
									page_size,
								],
							},
						},
						results: '$results',
					},
				},
			]);

			if (results[0].total_pages == null) results[0].total_pages = 0;
			res.status(200).json(results[0]);
		},
	);

	router.put(
		'/pay/:id',
		oapi.path({
			tags: ['Payments'],
			summary: 'Pay a payment',
			operationId: 'payPayment',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
				{
					in: 'path',
					name: 'id',
					schema: { type: 'string' },
					required: true,
					description: 'ID of the payment to be paid',
				},
				{ $ref: '#definitions/Format' },
			],
			responses: {
				200: {
					description: 'Payment successfully paid',
					content: {
						'application/json': {
							schema: { $ref: '#/definitions/SuccessResponse' },
						},
					},
				},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },
			},
		}),
		async (req: Request, res: Response) => {
			const id: PaymentDocument['_id'] = req.params.id;
			const user = (<Token> req.user).id;
			const level = (<Token> req.user).level;

			try {
				const payment = await Payments.findById(id);
				if (payment == null) {
					return die(res, ErrorType.BadRequest, 'Invalid payment id');
				}
				if (payment.payer !== user && level !== UserLevel.Admin) {
					return die(
						res,
						ErrorType.BadRequest,
						'You cannot pay this payment',
					);
				}

				payment.dateofPayment = new Date();
				const resp = await payment.save();

				await new Promise((resolve) => setTimeout(resolve, 2000));
				if (resp !== payment) {
					die(res, ErrorType.Internal, 'Internal db error');
				} else {
					res.status(200).json({ status: 'OK', info: 'ok' });
				}
			} catch (err) {
				console.error('Error at /pay:', err);
				die(res, ErrorType.Internal, err);
			}
		},
	);

	router.put(
		'/validate/:id',
		oapi.path({
			tags: ['Payments'],
			summary: 'Validate a payment',
			operationId: 'validatePayment',
			parameters: [
				{ $ref: '#definitions/TokenHeader' },
				{
					in: 'path',
					name: 'id',
					schema: { type: 'string' },
					required: true,
					description: 'ID of the payment to be validated',
				},
				{ $ref: '#definitions/Format' },
			],
			responses: {
				200: {
					description: 'Payment successfully validated',
					content: {
						'application/json': {
							schema: { $ref: '#/definitions/SuccessResponse' },
						},
					},
				},
				400: { $ref: '#/definitions/BadRequestResponse' },
				401: { $ref: '#/definitions/UnauthorizedResponse' },
				500: { $ref: '#/definitions/InternalServerErrorResponse' },
			},
		}),
		async (req: Request, res: Response) => {
			const id: PaymentDocument['_id'] = req.params.id;
			const user: TollOperatorDocument['_id'] = (<Token> req.user).id;
			const level = (<Token> req.user).level;

			try {
				const payment = await Payments.findById(id);
				if (payment == null) {
					return die(res, ErrorType.BadRequest, 'Invalid payment id');
				}
				if (payment.payee !== user && level !== UserLevel.Admin) {
					return die(
						res,
						ErrorType.BadRequest,
						'You cannot validate this payment',
					);
				}

				payment.dateofValidation = new Date();
				const resp = await payment.save();

				if (resp !== payment) {
					die(res, ErrorType.Internal, 'Internal db error');
				} else {
					res.status(200).json({ status: 'OK', info: 'ok' });
				}
			} catch (err) {
				console.error('Error at /pay:', err);
				die(res, ErrorType.Internal, err);
			}
		},
	);

	return router;
}
