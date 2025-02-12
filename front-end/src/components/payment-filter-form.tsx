import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { jwtDecode } from 'jwt-decode';
import { Token } from '@/types/auth.ts';

const formSchema = z.object({
	startDate: z.date().optional(),
	endDate: z.date(),
	targets: z.enum(['all', 'specific']),
	specificOperator: z.string().optional(),
}).refine(
	(data) => {
		// Validate dates aren't in the future
		return data.endDate <= new Date();
	},
	{
		message: 'End date cannot be in the future',
		path: ['endDate'],
	},
).refine(
	(data) => {
		// Validate start date is before end date when start date exists
		if (!data.startDate) return true;
		return data.startDate <= data.endDate;
	},
	{
		message: 'Start date must be before or equal to end date',
		path: ['startDate'],
	},
).refine(
	(data) => {
		// When targets is 'all', specificOperator must be undefined/null
		if (data.targets === 'all') {
			return !data.specificOperator;
		}
		// When targets is 'specific', specificOperator must be defined
		return !!data.specificOperator;
	},
	{
		message: 'Bad Operator Selection',
		path: ['specificOperator'],
	},
);

export type PaymentFilterFormValues = z.infer<typeof formSchema>;

interface PaymentFilterFormProps {
	defaultValues: PaymentFilterFormValues;
	onSubmit: (values: PaymentFilterFormValues) => void;
}

export const PaymentFilterForm: React.FC<PaymentFilterFormProps> = ({
	defaultValues,
	onSubmit,
}) => {
	const { operators, isLoading, error } = useOperators();
	const token = localStorage.getItem('authToken');

	const decodedToken: Token | undefined = token ? jwtDecode(token) : undefined;

	if (isLoading) {
		toast.loading('Loading operators...', {
			id: 'loading-operators',
		});
	} else {
		setTimeout(() => {
			toast.dismiss('loading-operators');
		}, 10);
	}

	if (error) {
		toast.error(error.message, {
			id: 'error-operators',
		});
	}

	const filteredOperators = operators?.filter((operator) =>
		operator._id !== decodedToken?.id
	);

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
		const { errors } = form.formState;

		if (errors.startDate) {
			toast.error(errors.startDate.message, {
				id: 'start-date-error',
			});
		}
		if (errors.endDate) {
			toast.error(errors.endDate.message, {
				id: 'end-date-error',
			});
		}
		if (errors.specificOperator) {
			toast.error(errors.specificOperator.message, {
				id: 'operator-error',
			});
		}
	}, [form.formState.errors]);

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
									value={field.value}
									onValueChange={(value) => {
										field.onChange(value);
										if (value === 'all') {
											form.setValue('specificOperator', '');
										}
									}}
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
									value={field.value}
									disabled={form.watch('targets') === 'all'}
								>
									<SelectTrigger>
										<SelectValue placeholder='Select an operator' />
									</SelectTrigger>
									<SelectContent>
										{!isLoading && !error &&
											filteredOperators.map((operator) => (
												<SelectItem key={operator._id} value={operator._id}>
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
