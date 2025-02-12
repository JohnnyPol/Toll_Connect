import { useEffect, useState } from 'react';

import { PaymentColumn } from '@/components/payment-column.tsx';
import { PaymentColorsProvider } from '@/context/payment-colors-context.tsx';
import {
	PaymentFilterForm,
	PaymentFilterFormValues,
} from '@/components/payment-filter-form.tsx';
import { OperatorProvider } from '@/context/operator-context.tsx';
import { Toaster } from '@/components/ui/toast.tsx';
import { PaymentStatus } from '@/types/payments.ts';
import { color } from 'highcharts';

const columns = [
	{
		title: 'Owed to Company',
		color: 'orange',
		status: PaymentStatus.Created,
		isPayer: false,
		isPayee: true,
	},
	{
		title: 'Owed to Others',
		color: 'red',
		status: PaymentStatus.Created,
		isPayer: true,
		isPayee: false,
	},
	{
		title: 'To Validate',
		color: 'blue',
		status: PaymentStatus.Paid,
		isPayer: false,
		isPayee: true,
	},
	{
		title: 'To Be Validated',
		color: 'purple',
		status: PaymentStatus.Paid,
		isPayer: true,
		isPayee: false,
	},
	{
		title: 'Completed',
		color: 'green',
		status: PaymentStatus.Validated,
		isPayer: true,
		isPayee: true,
	}
];

export default function CompanyPaymentsPage() {
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
			<div className='grid grid-cols-5 gap-4 h-full p-4 pt-0'>
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
