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
}).refine(
	(data) => {
		// Validate dates aren't in the future
		return data.endDate <= new Date();
	},
	{
		message: "End date cannot be in the future",
		path: ["endDate"]
	}
).refine(
	(data) => {
		// Validate start date is before end date when start date exists
		if (!data.startDate) return true;
		return data.startDate <= data.endDate;
	},
	{
		message: "Start date must be before or equal to end date",
		path: ["startDate"]
	}
);

export type StatisticsCompanyFilterFormValues = z.infer<typeof formSchema>;

interface StatisticsCompanyFilterFormProps {
	defaultValues: StatisticsCompanyFilterFormValues;
	onSubmit: (values: StatisticsCompanyFilterFormValues) => void;
}

export const StatisticsCompanyFilterForm: React.FC<StatisticsCompanyFilterFormProps> = ({
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
				className='flex items-center space-x-4'
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

				<Button type='submit' className='flex-shrink-0'>
					<CheckIcon className='h-4 w-4' />
					<span className='sr-only'>Submit</span>
				</Button>
			</form>
		</Form>
	);
};
