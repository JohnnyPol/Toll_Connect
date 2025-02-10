import * as React from 'react';
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

export const description = 'An interactive bar chart';

const chartData = [
	{
		date: '2023-01',
		incoming1: 4000,
		incoming2: 2400,
		outgoing1: 1800,
		outgoing2: 2400,
	},
	{
		date: '2023-02',
		incoming1: 3000,
		incoming2: 1398,
		outgoing1: 2800,
		outgoing2: 1398,
	},
	{
		date: '2023-03',
		incoming1: 2000,
		incoming2: 9800,
		outgoing1: 2200,
		outgoing2: 9800,
	},
	{
		date: '2023-04',
		incoming1: 2780,
		incoming2: 3908,
		outgoing1: 2000,
		outgoing2: 3908,
	},
	{
		date: '2023-05',
		incoming1: 1890,
		incoming2: 4800,
		outgoing1: 2181,
		outgoing2: 4800,
	},
	{
		date: '2023-06',
		incoming1: 2390,
		incoming2: 3800,
		outgoing1: 2500,
		outgoing2: 3800,
	},
];

const chartConfig = {
	views: {
		label: 'Total Charges',
	},
	incoming1: {
		label: 'Incoming 1',
		color: 'hsl(var(--chart-1))',
	},
	incoming2: {
		label: 'Incoming 2',
		color: 'hsl(var(--chart-2))',
	},
	outgoing1: {
		label: 'Outgoing 1',
		color: 'hsl(var(--chart-3))',
	},
	outgoing2: {
		label: 'Outgoing 2',
		color: 'hsl(var(--chart-4))',
	},
} satisfies ChartConfig;

export function StatisticsTimeseriesChart() {
	const [activeChart, setActiveChart] = React.useState<
		keyof typeof chartConfig
	>('incoming1');

	const total = React.useMemo(
		() => ({
			incoming1: chartData.reduce(
				(acc, curr) => acc + curr.incoming1 + curr.incoming2,
				0,
			),
			outgoing1: chartData.reduce(
				(acc, curr) => acc + curr.outgoing1 + curr.outgoing2,
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
					{['incoming1', 'outgoing1'].map((key) => {
						const chart = key as keyof typeof chartConfig;
						return (
							<button
								key={chart}
								data-active={activeChart === chart}
								className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
								onClick={() => setActiveChart(chart)}
							>
								<span className='text-xs text-muted-foreground'>
									{chartConfig[chart].label}
								</span>
								<span className='text-lg font-bold leading-none sm:text-3xl'>
									{total[key as keyof typeof total].toLocaleString()}
								</span>
							</button>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className='px-2 sm:p-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'
				>
					<AreaChart
						accessibilityLayer
						data={chartData}
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
									className='w-[150px]'
									nameKey='views'
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
						<Area
							type='monotone'
							dataKey='incoming1'
							stackId='1'
							stroke='var(--color-type1)'
							fill='var(--color-type1)'
						/>
						<Area
							type='monotone'
							dataKey='incoming2'
							stackId='1'
							stroke='var(--color-type2)'
							fill='var(--color-type2)'
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
