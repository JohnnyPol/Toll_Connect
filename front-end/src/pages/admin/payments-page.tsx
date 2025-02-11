import { useState } from 'react';

import { PaymentColumn } from '@/components/payment-column.tsx';
import { PaymentColorsProvider } from '@/context/payment-colors-context.tsx';
import {
	PaymentFilterForm,
	PaymentFilterFormValues,
} from '@/components/payment-filter-form.tsx';
import { Toaster } from '@/components/ui/toast.tsx';
import { PaymentStatus } from '@/types/payments.ts';

const columns = [
	{
		title: 'To Be Paid',
		color: 'red',
		status: PaymentStatus.Created,
		isPayer: false,
		isPayee: false,
	},
	{
		title: 'To Be Validated',
		color: 'blue',
		status: PaymentStatus.Paid,
		isPayer: false,
		isPayee: false,
	},
	{
		title: 'Completed',
		color: 'green',
		status: PaymentStatus.Validated,
		isPayer: false,
		isPayee: false,
	}
];

export default function AdminPaymentsPage() {
	const [filterFormValues, setFilterFormValues] = useState<
		PaymentFilterFormValues
	>(
		{
			endDate: new Date(),
			targets: 'all',
		},
	);

	return (
		<>
			<Toaster position='bottom-center' richColors closeButton />
			<div>
				<PaymentFilterForm
					defaultValues={filterFormValues}
					onSubmit={setFilterFormValues}
				/>
			</div>
			<div className='grid grid-cols-3 gap-4 h-full p-4 pt-0'>
				{columns.map((column, index) => (
					<PaymentColorsProvider color={column.color} key={index}>
						<PaymentColumn
							paymentFilterFormValues={filterFormValues}
							title={column.title}
							status={column.status}
							isPayer={column.isPayer}
							isPayee={column.isPayee}
						/>
					</PaymentColorsProvider>
				))}
			</div>
		</>
	);
}
