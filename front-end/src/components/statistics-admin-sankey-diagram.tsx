import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card.tsx';
import Highcharts from 'highcharts';
import {
	HighchartsChart,
	SankeySeries,
	Tooltip,
	withHighcharts,
	XAxis,
	YAxis,
} from 'react-jsx-highcharts';
import addSankeyModule from 'highcharts/modules/sankey';
import { useQuery } from '@tanstack/react-query';
import { StatisticsAdminFilterFormValues } from '@/components/statistics-admin-filter-form.tsx';
import { statisticsService } from '@/api/services/statistics.ts';
import { useOperators } from '@/hooks/use-operators.ts';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton.tsx';

if (addSankeyModule) {
	console.log('Sankey module added');
}

interface StatisticsAdminSankeyDiagramProps {
	filters: StatisticsAdminFilterFormValues;
}

const StatisticsAdminSankeyDiagram: React.FC<
	StatisticsAdminSankeyDiagramProps
> = ({
	filters,
}) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['admin-statistics', filters],
		queryFn: () => statisticsService.getAllPasses(filters),
	});

	const { operators } = useOperators();

	if (!operators) {
		return null;
	}

	if (error) {
		toast.error(error.message, {
			id: `error-aggregate`,
		});
	}

	const formattedData = data?.map((d, i) => ({
		from: 'Tags: ' +
			operators.find((o) => o._id === d.tagOperator)?.name.toLocaleUpperCase(),
		to: 'Tolls: ' +
			operators.find((o) => o._id === d.tollOperator)?.name.toLocaleUpperCase(),
		weight: d.passes,
		color: operators.find((o) => o._id === d.tagOperator)?.chartColor,
	}));

	const nodes = [
		...operators.map((o) => ({
			id: 'Tags: ' + o.name.toLocaleUpperCase(),
			color: o.chartColor,
		})),
		...operators.map((o) => ({
			id: 'Tolls: ' + o.name.toLocaleUpperCase(),
			color: o.chartColor,
		})),
	];

	return (
		<Card className='flex flex-col'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>All Passes</CardTitle>
				<CardDescription>
					Passes from Tags of all Operators to Tolls of all Operators
				</CardDescription>
			</CardHeader>
			<CardContent className='flex-1'>
				{isLoading ? <Skeleton className='h-72' /> : (
					<HighchartsChart>
						<XAxis type='category' />

						<YAxis>
							<SankeySeries
								name='Total Passes'
								data={formattedData}
								nodes={nodes}
								nodeWidth={20}
								nodePadding={15}
								keys={['from', 'to', 'weight']}
							/>
						</YAxis>

						<Tooltip />
					</HighchartsChart>
				)}
			</CardContent>
		</Card>
	);
};

export default withHighcharts(StatisticsAdminSankeyDiagram, Highcharts);
