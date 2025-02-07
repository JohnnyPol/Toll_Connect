import { Middleware, Request, Response, Router } from 'npm:express';

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
				status = 'to be paid';
			} else if (!validationDate) {
				status = 'to be validated';
			} else {
				status = 'completed';
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
	router.get('/', (req, res) => {
		const {
			page = 1,
			size = 10,
			sortBy = 'creationDate',
			sortOrder = 'desc',
			status,
			startDate,
			endDate,
		} = req.query;
		const pageNum = parseInt(page);
		const sizeNum = parseInt(size);

		// Filter first
		let filteredPayments = [...allPayments];
		if (status) {
			filteredPayments = filteredPayments.filter((payment) =>
				payment.status === status
			);
		}

		if (startDate) {
			const start = new Date(startDate);
			filteredPayments = filteredPayments.filter((payment) =>
				new Date(payment.creationDate) >= start
			);
		}

		if (endDate) {
			const end = new Date(endDate);
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
