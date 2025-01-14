import { useId, useState } from 'react';
import { format, isValid, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar.tsx';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';

interface DateInputProps {
	selectedDate: Date | undefined;
	onDateChange: (date: Date | undefined) => void;
	label: string;
	placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({
	selectedDate,
	onDateChange,
	label,
	placeholder = 'Pick a date',
}) => {
	const inputId = useId();
	const [month, setMonth] = useState<Date>(new Date());
	const [inputValue, setInputValue] = useState<string>(
		selectedDate ? format(selectedDate, 'MM/dd/yyyy') : '',
	);

	const handleDayPickerSelect = (date: Date | undefined) => {
		if (!date) {
			setInputValue('');
			onDateChange(undefined);
		} else {
			onDateChange(date);
			setMonth(date);
			setInputValue(format(date, 'MM/dd/yyyy'));
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		const parsedDate = parse(e.target.value, 'MM/dd/yyyy', new Date());
		if (isValid(parsedDate)) {
			onDateChange(parsedDate);
			setMonth(parsedDate);
		} else {
			onDateChange(undefined);
		}
	};

	return (
		<div className='space-y-2'>
			<Label htmlFor={inputId}>{label}</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className={cn(
							'w-full justify-start text-left font-normal',
							!selectedDate && 'text-muted-foreground',
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{selectedDate
							? format(selectedDate, 'PPP')
							: <span>{placeholder}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						month={month}
						onMonthChange={setMonth}
						mode='single'
						selected={selectedDate}
						onSelect={handleDayPickerSelect}
					/>
					<Input
						id={inputId}
						type='text'
						value={inputValue}
						placeholder='MM/dd/yyyy'
						onChange={handleInputChange}
						className='text-center font-normal'
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default DateInput;
