import { useState } from 'react';
import { Toaster } from '@/components/ui/toast.tsx';
import {
	StatisticsCompanyFilterForm,
	StatisticsCompanyFilterFormValues,
} from '@/components/statistics-company-filter-form.tsx';
import { StatisticsTimeseriesChart } from '@/components/statistics-timeseries-chart.tsx';
import { StatisticsPieChart } from '@/components/statistics-pie.tsx';

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
					<StatisticsTimeseriesChart 
						incomingData={[{"date":"2022-01-01","operators":[{"operator":"MO","passes":1,"cost":1.9},{"operator":"NAO","passes":2,"cost":4.699999999999999},{"operator":"OO","passes":7,"cost":16.9},{"operator":"EG","passes":1,"cost":2.5}]},{"date":"2022-01-02","operators":[{"operator":"OO","passes":2,"cost":4.3},{"operator":"NAO","passes":1,"cost":2.5},{"operator":"MO","passes":1,"cost":3.5},{"operator":"NO","passes":1,"cost":2.4},{"operator":"AM","passes":2,"cost":4.8}]},{"date":"2022-01-03","operators":[{"operator":"NO","passes":1,"cost":3.5},{"operator":"OO","passes":6,"cost":15.2},{"operator":"NAO","passes":3,"cost":8.3}]},{"date":"2022-01-04","operators":[{"operator":"NO","passes":1,"cost":3.5},{"operator":"OO","passes":4,"cost":10.3},{"operator":"EG","passes":1,"cost":2.3},{"operator":"AM","passes":1,"cost":2.4}]},{"date":"2022-01-05","operators":[{"operator":"OO","passes":6,"cost":13.5}]},{"date":"2022-01-06","operators":[{"operator":"NAO","passes":1,"cost":1.9},{"operator":"OO","passes":3,"cost":6.699999999999999},{"operator":"AM","passes":1,"cost":3.5},{"operator":"NO","passes":1,"cost":2.3}]},{"date":"2022-01-07","operators":[{"operator":"OO","passes":10,"cost":28},{"operator":"NO","passes":1,"cost":2.3},{"operator":"NAO","passes":3,"cost":6.699999999999999}]},{"date":"2022-01-08","operators":[{"operator":"EG","passes":4,"cost":10.8},{"operator":"OO","passes":7,"cost":17.4},{"operator":"KO","passes":1,"cost":2.4}]},{"date":"2022-01-09","operators":[{"operator":"OO","passes":5,"cost":13.1},{"operator":"NAO","passes":1,"cost":1.9},{"operator":"NO","passes":1,"cost":2.3}]},{"date":"2022-01-10","operators":[{"operator":"KO","passes":1,"cost":3.5},{"operator":"OO","passes":7,"cost":17.6}]},{"date":"2022-01-11","operators":[{"operator":"OO","passes":3,"cost":7.699999999999999},{"operator":"KO","passes":1,"cost":3.5},{"operator":"NAO","passes":1,"cost":2.3},{"operator":"AM","passes":2,"cost":4.4}]},{"date":"2022-01-12","operators":[{"operator":"OO","passes":5,"cost":11.7},{"operator":"KO","passes":1,"cost":2.5},{"operator":"NAO","passes":1,"cost":2.3},{"operator":"EG","passes":2,"cost":6}]},{"date":"2022-01-13","operators":[{"operator":"EG","passes":4,"cost":10.3},{"operator":"KO","passes":1,"cost":2.4},{"operator":"OO","passes":6,"cost":14.5}]},{"date":"2022-01-14","operators":[{"operator":"OO","passes":4,"cost":10.2}]}]}
						outgoingData={[]}
					/>
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
