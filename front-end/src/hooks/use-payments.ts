import { useEffect, useState } from 'react';
import { paymentService } from '@/api/services/payments.ts';
import { Payment } from '@/types/payments.ts';

const usePayments = (endDate: Date | null, currentPage: number) => {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (endDate) {
			setLoading(true);
			paymentService.getPayments(
				new Date('2000-01-01'),
				endDate,
				'to be paid',
				currentPage,
			)
				.then((data) => {
					setTotalPages(data.pagination.totalPages);
					setPayments(data.data);
				})
				.catch((err) => {
					setError(err.message);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [endDate, currentPage]);

	return { payments, totalPages, loading, error };
};

export default usePayments;
