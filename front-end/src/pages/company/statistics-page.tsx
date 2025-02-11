import { useState } from 'react';
import { Toaster } from '@/components/ui/toast.tsx';
import {
	StatisticsCompanyFilterForm,
	StatisticsFilterFormValues,
} from '@/components/statistics-company-filter-form.tsx';
import { StatisticsTimeseriesChart } from '@/components/statistics-timeseries-chart.tsx';
import { StatisticsPieChart } from '../../components/statistics-pie-chart.tsx';
import { useCompanyStatistics } from '@/hooks/use-company-statistics.ts';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function StatisticsPage() {
	const [filterFormValues, setFilterFormValues] = useState<
		StatisticsFilterFormValues
	>({
		endDate: new Date(),
	});

	const {
		timeseriesIncoming,
		timeseriesOutgoing,
		timeseriesLoading,
		timeseriesError,
		aggregateIncoming,
		aggregateOutgoing,
		aggregateLoading,
		aggregateError,
	} = useCompanyStatistics(filterFormValues);

	if (timeseriesError) {
		toast.error(timeseriesError.message, {
			id: `error-timeseries`,
		});
	}

	if (aggregateError) {
		toast.error(aggregateError.message, {
			id: `error-aggregate`,
		});
	}

	return (
		<>
			<Toaster position='bottom-center' richColors closeButton />
			<div className=''>
				<div className='p-4 pb-0'>
					<StatisticsCompanyFilterForm
						defaultValues={filterFormValues}
						onSubmit={setFilterFormValues}
					/>
				</div>
				<div className='p-4 pb-0'>
					{(timeseriesLoading || timeseriesError) && (
						<Skeleton className='h-72' />
					)}
					{(!timeseriesLoading && !timeseriesError) && (
						<StatisticsTimeseriesChart
							incomingData={timeseriesIncoming || []}
							outgoingData={timeseriesOutgoing || []}
						/>
					)}
				</div>
				<div className='h-half grid grid-cols-2 gap-4 p-4'>
					{(aggregateLoading ||
						aggregateError) && (
						<>
							<Skeleton className='h-72' />
							<Skeleton className='h-72' />
						</>
					)}
					{!aggregateLoading && !aggregateError && (
						<>
							<StatisticsPieChart
								title='Aggregated Incoming Passes'
								description='to our stations by other operator tags'
								data={aggregateIncoming || []}
							/>
							<StatisticsPieChart
								title='Aggregated Outgoing Passes'
								description='by our tags to other operators stations'
								data={aggregateOutgoing || []}
							/>
						</>
					)}
				</div>
			</div>
		</>
	);
}
