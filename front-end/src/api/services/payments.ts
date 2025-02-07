import { axios } from '@/api/index.ts';
import { Payment } from '@/types/payments.ts';

export const paymentService = {
	getPayments: async (startDate: Date, endDate: Date, status: Payment['status'], page: number) => {
		const response = await axios.get<
			{ data: Payment[]; pagination: { totalPages: number } }
		>(
			`/payments?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&page=${page}&size=50&status=${status}`,
		);
		return response.data;
	},
};
