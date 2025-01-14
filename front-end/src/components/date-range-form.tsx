import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { isBefore } from 'date-fns/isBefore';
import DateInput from '@/components/date-input.tsx';
import ItemSelector from '@/components/item-selector.tsx';

export interface DateRangeFormData {
	startDate: Date | undefined;
	endDate: Date | undefined;
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

	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const items = [
		{ id: '1', label: 'Item 1', description: 'Description for item 1' },
		{ id: '2', label: 'Item 2', description: 'Description for item 2' },
		{ id: '3', label: 'Item 3', description: 'Description for item 3' },
		{ id: '4', label: 'Item 3', description: 'Description for item 3' },
		{ id: '5', label: 'Item 3', description: 'Description for item 3' },
		{ id: '6', label: 'Item 3', description: 'Description for item 3' },
		{ id: '7', label: 'Item 3', description: 'Description for item 3' },
		{ id: '8', label: 'Item 3', description: 'Description for item 3' },
		{ id: '9', label: 'Item 3', description: 'Description for item 3' },
		{ id: '10', label: 'Item 3', description: 'Description for item 3' },
		{ id: '11', label: 'Item 3', description: 'Description for item 3' },
		{ id: '12', label: 'Item 3', description: 'Description for item 3' },
		{ id: '13', label: 'Item 3', description: 'Description for item 3' },
		{ id: '14', label: 'Item 3', description: 'Description for item 3' },
		{ id: '15', label: 'Item 3', description: 'Description for item 3' },
		// ... more items
	];

	const handleStartDateChange = (date: Date | undefined) => {
		onFormDataChange({ ...formData, startDate: date });
	};

	const handleEndDateChange = (date: Date | undefined) => {
		onFormDataChange({ ...formData, endDate: date });
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
					<ItemSelector
						items={items}
						category='operator'
						selectedItems={selectedIds}
						onSelectionChange={setSelectedIds}
						allowMultiple={true}
						searchPlaceholder='Search...'
						maxHeight='10'
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
