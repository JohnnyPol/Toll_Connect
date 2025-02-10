import { useState } from 'react';
import { StatisticsTimeseriesChart } from '@/components/statistics-timeseries-chart.tsx';
import { Toaster } from '@/components/ui/toast.tsx';
import { OperatorProvider } from '@/context/operator-context.tsx';
import {
	StatisticsCompanyFilterForm,
	StatisticsCompanyFilterFormValues,
} from '@/components/statistics-company-filter-form.tsx';
import { Component, StatisticsPieChart } from '@/components/statistics-pie.tsx';

export default function StatisticsPage() {
	const [filterFormValues, setFilterFormValues] = useState<
		StatisticsCompanyFilterFormValues
	>({
		endDate: new Date(),
	});

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
					<StatisticsTimeseriesChart />
				</div>
				<div className='grid grid-cols-2 gap-4 p-4'>
					<StatisticsPieChart
						title='Aggregated Incoming Passes'
						description='to our stations by other operator tags'
						data={[
							{ operator: 'OO', passes: 100 },
							{ operator: 'AM', passes: 200 },
							{ operator: 'GE', passes: 300 },
							{ operator: 'EG', passes: 400 },
						]}
					/>
					<StatisticsPieChart
						title='Aggregated Outgoing Passes'
						description='by our tags to other operators stations'
						data={[
							{ operator: 'OO', passes: 100 },
							{ operator: 'AM', passes: 200 },
							{ operator: 'GE', passes: 300 },
							{ operator: 'EG', passes: 400 },
						]}
					/>
				</div>
			</div>
		</>
	);
}
