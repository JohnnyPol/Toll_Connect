import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { subDays } from 'date-fns/subDays';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import DateInput from '@/components/date-input.tsx';
import { OperatorList } from '@/components/operator-list.tsx';
import { isAfter } from 'date-fns/isAfter';
import { FilterIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet.tsx';

const formSchema = z.object({
	startDate: z.date(),
	endDate: z.date(),
	operatorIds: z.string().array(),
}).superRefine((data, ctx) => {
	if (data.endDate > new Date()) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'End date cannot be in the future',
			path: ['endDate'],
		});
	}

	if (isAfter(data.startDate, data.endDate)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Start date must be before or equal to end date',
			path: ['startDate'],
		});
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'End date must be after or equal to start date',
			path: ['endDate'],
		});
	}
});

export type MapFilterFormValues = z.infer<typeof formSchema>;

interface MapFilterFormProps {
	defaultValues: MapFilterFormValues;
	onSubmit: (values: MapFilterFormValues) => void;
}

export const MapFilterForm: React.FC<MapFilterFormProps> = ({
	defaultValues,
	onSubmit,
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const handleDateChange = (
		field: 'startDate' | 'endDate',
		value: Date | undefined,
	) => {
		form.clearErrors(['startDate', 'endDate']);
		if (value === undefined) {
			form.setError(field, { message: 'Date Undefined' });
		} else {
			form.setValue(field, value);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='startDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Start Date</FormLabel>
							<FormControl>
								<DateInput
									selectedDate={field.value}
									onDateChange={(date) => handleDateChange('startDate', date)}
									placeholder='Select start date'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='endDate'
					render={({ field }) => (
						<FormItem>
							<FormLabel>End Date</FormLabel>
							<FormControl>
								<DateInput
									selectedDate={field.value}
									onDateChange={(date) => handleDateChange('endDate', date)}
									placeholder='Select end date'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='operatorIds'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Select Operators</FormLabel>
							<FormControl>
								<OperatorList
									selected={field.value}
									onSelectionChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex gap-2 w-full'>
					<Button type='submit' className='flex-1'>Submit</Button>
					<Button
						type='button'
						variant='outline'
						onClick={() => form.reset()}
						className='flex-1'
					>
						Reset
					</Button>
				</div>
			</form>
		</Form>
	);
};
