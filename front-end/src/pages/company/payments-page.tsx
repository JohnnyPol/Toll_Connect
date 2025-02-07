import { useEffect, useState } from 'react';
import DateInput from '@/components/date-input.tsx';

import { useSearchParams } from 'react-router-dom';
import { PaymentColumn } from '@/components/payment-column.tsx';
import { PaymentColorsProvider } from '@/context/payment-colors-context.tsx';

export default function CompanyPaymentsPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	const [endDate, setEndDate] = useState<Date | null>(() => {
		const endDateParam = searchParams.get('endDate');
		return endDateParam ? new Date(endDateParam) : null;
	});

	useEffect(() => {
		if (endDate) {
			setSearchParams((prev) => {
				prev.set('endDate', endDate.toISOString());
				return prev;
			});
		} else {
			searchParams.delete('endDate');
			setSearchParams(searchParams);
		}
	}, [endDate, setSearchParams]);

	return (
		<>
			<div className='flex gap-4 p-4'>
				<DateInput
					selectedDate={endDate}
					onDateChange={setEndDate}
					placeholder='Select end date'
				/>
			</div>
			<div className='grid grid-cols-5 gap-4 h-full p-4 pt-0'>
				<PaymentColorsProvider color='orange'>
					<PaymentColumn
						endDate={endDate}
						title='Owed to Company'
						urlParam='payPage'
					/>
				</PaymentColorsProvider>
				<PaymentColorsProvider color='red'>
					<PaymentColumn
						endDate={endDate}
						title='Owed to Others'
						urlParam='payOthersPage'
					/>
				</PaymentColorsProvider>
				<PaymentColorsProvider color='blue'>
					<PaymentColumn
						endDate={endDate}
						title='To Validate'
						urlParam='validatePage'
					/>
				</PaymentColorsProvider>
				<PaymentColorsProvider color='purple'>
					<PaymentColumn
						endDate={endDate}
						title="Pending Others' Validation"
						urlParam='othersValidationPage'
					/>
				</PaymentColorsProvider>
				<PaymentColorsProvider color='green'>
					<PaymentColumn
						endDate={endDate}
						title='Completed'
						urlParam='completedPage'
					/>
				</PaymentColorsProvider>
			</div>
		</>
	);
}
