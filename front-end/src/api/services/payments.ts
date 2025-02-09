import { axios } from '@/api/index.ts';
import { Payment } from '@/types/payments.ts';
import { dateToURLParam } from '@/lib/date-transformer.ts';

export const paymentService = {
	getPayments: async (startDate: Date, endDate: Date, status: Payment['status'], page: number) => {
		const response = await axios.get<
			{ data: Payment[]; pagination: { totalPages: number } }
		>(
			`/payments?page=${page}&size=50&startDate=${dateToURLParam(startDate)}&endDate=${dateToURLParam(endDate)}&status=${status}`,
		);
		return response.data;
	},
};
