import { Middleware, Request, Response, Router } from 'express';
import Payments, { PaymentDocument, PaymentStatus } from '@/models/payment.ts';
import { die, ErrorType, get_date } from '@/api/util.ts';
import TollOperator, { TollOperatorDocument } from '@/models/toll_operator.ts';

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
	const is_payer = ('is_payer' in query)
		? true : false;

	const is_payee = ('is_payee' in query)
		? true : false;

	return { page_size, page_number, target_op_id, is_payer, is_payee };
}

function operators_to_query (
	is_payer: boolean,
	is_payee: boolean,
	user: TollOperatorDocument['_id'],
	target: TollOperatorDocument['_id'] | undefined
) {
	if (is_payer && is_payee)
		return target ? { $or: [{payer: user, payee: target}, {payee: user, payer: target}] } : { $or: [{payer: user}, {payee: user}] };
	else if (is_payer)
		return target ? { payer: user, payee: target } : { payer: user };
	else if (is_payee)
		return target ? { payee: user, payer: target } : { payee: user };
	else //ADMIN
		return target ? { $or: [{payer: target}, {payee: target}] } : {};
}

function status_to_query (status: PaymentStatus) {
	const epoch = new Date(0);
	switch (status) {
		case PaymentStatus.Created: return {
			dateofPayment: epoch,
			dateofValidation: epoch,
		};
		case PaymentStatus.Paid: return {
			dateofPayment: { $gt: epoch },
			dateofValidation: epoch,
		};
		case PaymentStatus.Validated: return {
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
		async (req: Request, res: Response) => {
			const query = parse_query(req.query);
			if (typeof query === 'string') {
				return die(res, ErrorType.BadRequest, query);
			}

			const status: PaymentStatus = parseInt(req.params.status);
			const date_from: Date = get_date(req.params.date_from);
			const date_to: Date = get_date(req.params.date_to);
			const user: TollOperatorDocument['_id'] = /* TODO */ 'AM';
			const { page_size, page_number, target_op_id, is_payer, is_payee, } = query;

			if (PaymentStatus[req.params.status] === undefined) {
				return die(res, ErrorType.BadRequest, 'Invalid status');
			}
			if (is_payer === false && is_payee === false && status !== PaymentStatus.Validated) {
				return die(res, ErrorType.BadRequest, 'is_payer or is_payee should be defined');
			}

			const results = await Payments.aggregate([
				{
					$match: {
						...operators_to_query(is_payer, is_payee, user, target_op_id),
						...status_to_query(status),
						dateofCharge: { $gte: date_from, $lte: date_to },
					}
				}, {
					$facet: {
						total_pages: [{ $count: 'count' }],
						results: [
							{ $sort: { dateOfCharge: -1 } },
							{ $skip: page_size * (page_number - 1) },
							{ $limit: page_size },
						],
					}
				}, {
					$project: {
						total_pages: {
							$ceil: {
								$divide: [
									{ $arrayElemAt: ['$total_pages.count', 0] },
									page_size
								]
							}
						},
						results: '$results',
					}
				}
			]);

			res.status(200).json(results[0]);
		},
	);

	router.put(
		'/pay/:id',
		async (req: Request, res: Response) => {
			const id: PaymentDocument['_id'] = req.params.id;
			const user: TollOperatorDocument['_id'] = /* TODO */ 'OO';

			try {
				const payment = await Payments.findById(id);
				if (payment == null)
					return die(res, ErrorType.BadRequest, 'Invalid payment id');
				if (payment.payer !== user)
					return die(res, ErrorType.BadRequest, 'You cannot pay this payment');

				payment.dateofPayment = new Date();
				const resp = await payment.save();

				if (resp !== payment)
					die(res, ErrorType.Internal, 'Internal db error');
				else
					res.status(200).json({ status: 'ok', info: 'ok' });
			} catch (err) {
				console.error('Error at /pay:', err);
				die(res, ErrorType.Internal, 'Internal server error');
			}
		},
	);

	router.put(
		'/validate/:id',
		async (req: Request, res: Response) => {
			const id: PaymentDocument['_id'] = req.params.id;
			const user: TollOperatorDocument['_id'] = /* TODO */ 'AM';

			try {
				const payment = await Payments.findById(id);
				if (payment == null)
					return die(res, ErrorType.BadRequest, 'Invalid payment id');
				if (payment.payee !== user)
					return die(res, ErrorType.BadRequest, 'You cannot validate this payment');

				payment.dateofValidation = new Date();
				const resp = await payment.save();

				if (resp !== payment)
					die(res, ErrorType.Internal, 'Internal db error');
				else
					res.status(200).json({ status: 'ok', info: 'ok' });
			} catch (err) {
				console.error('Error at /pay:', err);
				die(res, ErrorType.Internal, 'Internal server error');
			}
		},
	);

	return router;
}
