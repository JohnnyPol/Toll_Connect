import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAfter } from 'date-fns/isAfter';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import DateInput from '@/components/date-input.tsx';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select.tsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import { useOperators } from '@/hooks/use-operators.ts';
import { toast } from 'sonner';
import { CheckIcon } from 'lucide-react';

const formSchema = z.object({
	startDate: z.date().optional(),
	endDate: z.date(),
	targets: z.enum(['all', 'specific']),
	specificOperator: z.string().optional() 
}).superRefine((data, ctx) => {
	if (data.endDate > new Date()) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'End date cannot be in the future',
			path: ['endDate'],
		});
	}

	if (data.startDate && isAfter(data.startDate, data.endDate)) {
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

export type PaymentFilterFormValues = z.infer<typeof formSchema>;

interface PaymentFilterFormProps {
	defaultValues: PaymentFilterFormValues;
	onSubmit: (values: PaymentFilterFormValues) => void;
}

export const PaymentFilterForm: React.FC<PaymentFilterFormProps> = ({
	defaultValues,
	onSubmit,
}) => {
	const { operators, loading, error } = useOperators();

	if (loading) {
		toast.loading('Loading operators...', {
			id: 'loading-operators',
		});
	} else {
		setTimeout(() => {
			toast.dismiss('loading-operators');
		}, 10);
	}

	if (error) {
		toast.error(error, {
			id: 'error-operators',
		});
	}

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


	useEffect(() => {
		if (form.formState.errors.startDate) {
			toast.error(form.formState.errors.startDate.message, {
				id: 'start-date-error',
			});
		}
		if (form.formState.errors.endDate) {
			toast.error(form.formState.errors.endDate.message, {
				id: 'end-date-error',
			});
		}
	}, [form.formState.errors]);

	form.watch((value) => {
		if (value.startDate && value.endDate && value.startDate > value.endDate) {
			toast.error('Start date cannot be after end date', {
				id: 'date-range-error',
			});
		}
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex items-center space-x-4 p-4'
			>
				<FormField
					control={form.control}
					name='startDate'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<DateInput
									selectedDate={field.value}
									onDateChange={(date) => handleDateChange('startDate', date)}
									placeholder='Select start date'
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='endDate'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<DateInput
									selectedDate={field.value}
									onDateChange={(date) => handleDateChange('endDate', date)}
									placeholder='Select end date'
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='targets'
					render={({ field }) => (
						<FormItem className='space-y-3'>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className='flex flex-row space-x-4'
								>
									<FormItem className='flex items-center space-x-2 space-y-0'>
										<FormControl>
											<RadioGroupItem value='all' />
										</FormControl>
										<span className='text-sm font-medium'>All Targets</span>
									</FormItem>
									<FormItem className='flex items-center space-x-2 space-y-0'>
										<FormControl>
											<RadioGroupItem value='specific' />
										</FormControl>
										<span className='text-sm font-medium'>Specific Target</span>
									</FormItem>
								</RadioGroup>
							</FormControl>
						</FormItem>
					)}
				/>

					<FormField
						control={form.control}
						name='specificOperator'
						render={({ field }) => (
							<FormItem className='flex-grow'>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={form.watch('targets') === 'all'}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select an operator' />
										</SelectTrigger>
										<SelectContent>
											{!loading && !error &&
												operators.map((operator) => (
													<SelectItem key={operator._id} value={operator.name}>
														{operator.name.toUpperCase()}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</FormControl>
							</FormItem>
						)}
					/>

				<Button type='submit' className='flex-shrink-0'>
					<CheckIcon className='h-4 w-4' />
					<span className='sr-only'>Submit</span>
				</Button>
			</form>
		</Form>
	);
};
