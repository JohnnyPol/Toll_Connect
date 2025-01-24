import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { isBefore } from 'date-fns/isBefore';
import DateInput from '@/components/date-input.tsx';
import { OperatorList } from '@/components/operator-list.tsx';
import { Operator } from '@/types/operators.ts';

export interface DateRangeFormData {
	startDate: Date | undefined;
	endDate: Date | undefined;
	selectedOperatorIds: Operator['_id'][];
}

interface DateRangeFormProps {
	formData: DateRangeFormData;
	onFormDataChange: (data: DateRangeFormData) => void;
	onSubmit: (data: DateRangeFormData) => void;
}

const DateRangeForm: React.FC<DateRangeFormProps> = ({
	formData,
	onFormDataChange,
	onSubmit,
}) => {
	const [error, setError] = useState<string>('');

	const handleStartDateChange = (date: Date | undefined) => {
		onFormDataChange({ ...formData, startDate: date });
	};

	const handleEndDateChange = (date: Date | undefined) => {
		onFormDataChange({ ...formData, endDate: date });
	};

	const handleOperatorSelectionChange = (selected: string[]) => {
		onFormDataChange({ ...formData, selectedOperatorIds: selected });
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');

		if (!formData.startDate || !formData.endDate) {
			setError('Please select both start and end dates');
			return;
		}

		if (isBefore(formData.endDate, formData.startDate)) {
			setError('End date must be after start date');
			return;
		}

		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6 w-full'>
			<div className='space-y-4'>
				<DateInput
					selectedDate={formData.startDate}
					onDateChange={handleStartDateChange}
					label='Start Date'
					placeholder='Select start date'
				/>

				<DateInput
					selectedDate={formData.endDate}
					onDateChange={handleEndDateChange}
					label='End Date'
					placeholder='Select end date'
				/>

				{error && <div className='text-red-500 text-sm'>{error}</div>}

				<div className='space-y-2'>
					<Label>Select Operators</Label>
					<OperatorList
						selected={formData.selectedOperatorIds}
						onSelectionChange={handleOperatorSelectionChange}
					/>
				</div>

				<Button type='submit' className='w-full'>
					Submit
				</Button>
			</div>
		</form>
	);
};

export default DateRangeForm;
