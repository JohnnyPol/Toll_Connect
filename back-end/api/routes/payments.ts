import { format, parse } from 'jsr:@std/datetime';
import { Middleware, Request, Response, Router } from 'npm:express';

enum PaymentStatus {
	Created = 0,
	Paid = 1,
	Validated = 2,
}

export default function (oapi: Middleware): Router {
	const router = new Router();

	// Helper functions
	const randomDate = (start, end) =>
		new Date(
			start.getTime() +
				Math.random() *
					(end.getTime() - start.getTime()),
		);
	const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
	const uniquePair = (arr) => {
		let a = randomItem(arr);
		let b = randomItem(arr);
		while (a === b) b = randomItem(arr);
		return [a, b];
	};

	// Generate dummy data with status
	const generateDummyPayments = () => {
		const users = ['AM', 'EG', 'GE', 'KO', 'MO', 'NAO', 'NO', 'OO'];
		const payments = [];

		for (let i = 0; i < 1000; i++) {
			const [payer, payee] = uniquePair(users);
			const creationDate = randomDate(
				new Date(2023, 0, 1),
				new Date(),
			);
			const paymentDate = Math.random() > 0.3
				? randomDate(creationDate, new Date())
				: null;
			const validationDate =
				paymentDate && Math.random() > 0.5
					? randomDate(paymentDate, new Date())
					: null;

			// Determine status
			let status;
			if (!paymentDate) {
				status = PaymentStatus.Created;
			} else if (!validationDate) {
				status = PaymentStatus.Paid;
			} else {
				status = PaymentStatus.Validated;
			}

			payments.push({
				paymentId: `PAY-${1000 + i}`,
				payer,
				payee,
				creationDate: creationDate.toISOString(),
				paymentDate: paymentDate?.toISOString() || null,
				validationDate: validationDate?.toISOString() ||
					null,
				amount: Math.random() * 1000 + 10,
				status,
			});
		}

		return payments;
	};

	const allPayments = generateDummyPayments();

	// Updated endpoint with status filtering
	router.get('/:status/:startDate/:endDate', (req, res) => {
		const { status, startDate, endDate } = req.params;
		const {
			page_number = 1,
			page_size = 10,
			sortBy = 'creationDate',
			sortOrder = 'desc',
			is_payer,
			target_op_id,
		} = req.query;
		const pageNum = parseInt(page_number);
		const sizeNum = parseInt(page_size);
		const status_ = parseInt(status);

		// Filter first
		let filteredPayments = [...allPayments];
		filteredPayments = filteredPayments.filter((payment) =>
			payment.status === status_
		);

		if (target_op_id) {
			filteredPayments = filteredPayments.filter(
				(payment) => {
					if (is_payer === 'true') {
						return payment.payer ===
							target_op_id;
					} else if (is_payer === 'false') {
						return payment.payee ===
							target_op_id;
					} else {
						return (
							payment.payer === target_op_id ||
							payment.payee === target_op_id
						);
					}
				},
			);
		}

		if (startDate) {
			const start = parse(startDate, 'yyyyMMdd');
			filteredPayments = filteredPayments.filter((payment) =>
				new Date(payment.creationDate) >= start
			);
		}

		if (endDate) {
			const end = parse(endDate, 'yyyyMMdd');
			filteredPayments = filteredPayments.filter((payment) =>
				new Date(payment.creationDate) <= end
			);
		}

		// Sorting
		const sortedPayments = [...filteredPayments].sort((a, b) => {
			const valA = a[sortBy];
			const valB = b[sortBy];

			if (sortBy.includes('Date')) {
				return sortOrder === 'asc'
					? new Date(valA) - new Date(valB)
					: new Date(valB) - new Date(valA);
			}

			return sortOrder === 'asc'
				? valA?.localeCompare?.(valB) || valA - valB
				: valB?.localeCompare?.(valA) || valB - valA;
		});

		// Pagination
		const startIndex = (pageNum - 1) * sizeNum;
		const endIndex = startIndex + sizeNum;
		const paginatedPayments = sortedPayments.slice(
			startIndex,
			endIndex,
		);

		res.json({
			data: paginatedPayments.map((p) => ({
				...p,
				amount: Number(p.amount.toFixed(2)),
			})),
			pagination: {
				totalItems: filteredPayments.length,
				currentPage: pageNum,
				pageSize: sizeNum,
				totalPages: Math.ceil(
					filteredPayments.length / sizeNum,
				),
			},
		});
	});

	return router;
}
