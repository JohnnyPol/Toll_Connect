import { useEffect, useState } from 'react';

import { PaymentColumn } from '@/components/payment-column.tsx';
import { PaymentColorsProvider } from '@/context/payment-colors-context.tsx';
import {
	PaymentFilterForm,
	PaymentFilterFormValues,
} from '@/components/payment-filter-form.tsx';
import { OperatorProvider } from '@/context/operator-context.tsx';
import { Toaster } from '@/components/ui/toast.tsx';

export default function CompanyPaymentsPage() {
	const [filterFormValues, setFilterFormValues] = useState<
		PaymentFilterFormValues
	>(
		{
			endDate: new Date(),
			targets: 'all',
		},
	);

	useEffect(() => {
		console.log(filterFormValues);
	}, [filterFormValues]);

	return (
		<OperatorProvider>
			<Toaster position='bottom-center' richColors closeButton />
			<div>
				<PaymentFilterForm
					defaultValues={filterFormValues}
					onSubmit={setFilterFormValues}
				/>
			</div>
			<div className='grid grid-cols-5 gap-4 h-full p-4 pt-0'>
				<PaymentColorsProvider color='orange'>
					<PaymentColumn
						paymentFilterFormValues={filterFormValues}
						title='Owed to Company'
					/>
				</PaymentColorsProvider>
				<PaymentColorsProvider color='red'>
					<PaymentColumn
						paymentFilterFormValues={filterFormValues}
						title='Owed to Others'
					/>
				</PaymentColorsProvider>
				<PaymentColorsProvider color='blue'>
					<PaymentColumn
						paymentFilterFormValues={filterFormValues}
						title='To Validate'
					/>
				</PaymentColorsProvider>
				<PaymentColorsProvider color='purple'>
					<PaymentColumn
						paymentFilterFormValues={filterFormValues}
						title='To Be Validated'
					/>
				</PaymentColorsProvider>
				<PaymentColorsProvider color='green'>
					<PaymentColumn
						paymentFilterFormValues={filterFormValues}
						title='Completed'
					/>
				</PaymentColorsProvider>
			</div>
		</OperatorProvider>
	);
}
