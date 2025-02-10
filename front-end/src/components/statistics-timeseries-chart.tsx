import { useState, useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card.tsx';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart.tsx';
import { useOperators } from '@/hooks/use-operators.ts';

export const description = 'An interactive bar chart';

const outgoingChartData = [
	{
		date: '2023-01',
		OO: 1800,
		AM: 2400,
	},
	{
		date: '2023-02',
		OO: 2800,
		AM: 1398,
	},
	{
		date: '2023-03',
		OO: 2200,
		AM: 9800,
	},
	{
		date: '2023-04',
		OO: 2000,
		AM: 3908,
	},
	{
		date: '2023-05',
		OO: 2181,
		AM: 4800,
	},
	{
		date: '2023-06',
		OO: 2500,
		AM: 3800,
	},
];

const incomingChartData = [
	{
		date: '2023-01',
		OO: 4000,
		AM: 2400,
	},
	{
		date: '2023-02',
		OO: 3000,
		AM: 1398,
	},
	{
		date: '2023-03',
		OO: 2000,
		AM: 9800,
	},
	{
		date: '2023-04',
		OO: 2780,
		AM: 3908,
	},
	{
		date: '2023-05',
		OO: 1890,
		AM: 4800,
	},
	{
		date: '2023-06',
		OO: 2390,
		AM: 3800,
	},
];

type Direction = 'incoming' | 'outgoing';

export function StatisticsTimeseriesChart() {
	const [direction, setDirection] = useState<Direction>('incoming');

	const { operators } = useOperators();
	const chartConfig = useMemo<ChartConfig>(() => {
		const config: ChartConfig = {};
		operators.forEach((operator, _) => {
			config[operator._id] = {
				label: operator.name.toLocaleUpperCase(),
				color: operator?.chartColor || '#3b82f6',
			};
		});
		return config;
	}, [operators]);

	const activeData = direction === 'incoming'
		? incomingChartData
		: outgoingChartData;

	const total = useMemo(
		() => ({
			incoming: incomingChartData.reduce(
				(acc, curr) => acc + curr.OO + curr.AM,
				0,
			),
			outgoing: outgoingChartData.reduce(
				(acc, curr) => acc + curr.OO + curr.AM,
				0,
			),
		}),
		[],
	);

	return (
		<Card>
			<CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
				<div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
					<CardTitle>Pass Charges Timeseries</CardTitle>
					<CardDescription>
						Showing the total charge amounts over time for incoming foreign
						operator tags on tolls of our network or outgoing tags of ours on
						other operators' networks.
					</CardDescription>
				</div>
				<div className='flex'>
					<button
						key='incoming'
						data-active={direction === 'incoming'}
						className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
						onClick={() => setDirection('incoming')}
					>
						<span className='text-xs text-muted-foreground'>
							Incoming
						</span>
						<span className='text-lg font-bold leading-none sm:text-3xl'>
							{total.incoming.toLocaleString()}
						</span>
					</button>
					<button
						key='incoming'
						data-active={direction === 'outgoing'}
						className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
						onClick={() => setDirection('outgoing')}
					>
						<span className='text-xs text-muted-foreground'>
							Outgoing
						</span>
						<span className='text-lg font-bold leading-none sm:text-3xl'>
							{total.outgoing.toLocaleString()}
						</span>
					</button>
				</div>
			</CardHeader>
			<CardContent className='px-2 sm:p-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'
				>
					<AreaChart
						accessibilityLayer
						data={activeData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								});
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className='w-[200px]'
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
										});
									}}
								/>
							}
						/>
						{Object.keys(chartConfig).map((key) => (
							<Area
								key={key}
								type='monotone'
								dataKey={key}
								stackId='1'
								stroke={chartConfig[key].color}
								fill={chartConfig[key].color}
							/>
						))}
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
