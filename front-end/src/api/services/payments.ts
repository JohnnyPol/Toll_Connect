import { axios } from '@/api/index.ts';
import { Payment, PaymentStatus } from '@/types/payments.ts';
import { dateToURLParam } from '@/lib/date-transformer.ts';
import { PaymentFilterFormValues } from '@/components/payment-filter-form.tsx';

export const paymentService = {
	getPayments: async (
		filters: PaymentFilterFormValues,
		status: PaymentStatus,
		isPayer: boolean,
		isPayee: boolean,
		page: number,
	) => {
		const params = {
			page_number: page,
			page_size: 50,
			target_op_id: filters.targets === 'specific'
				? filters.specificOperator
				: undefined,
			[isPayer ? 'is_payer' : '']: '',
			[isPayee ? 'is_payee': '']: '',
		};

		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const response = await axios.get<
			{ results: Payment[]; total_pages: number }
		>(`/payments/${status}/${startDate}/${endDate}`, {
			params,
		});

		return response.data;
	},

	payPayment: async (paymentId: string) => {
		await axios.put(`/payments/pay/${paymentId}`);
	},

	validatePayment: async (paymentId: string) => {
		await axios.put(`/payments/validate/${paymentId}`);
	},
};
