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

const outgoingChartData = [
	{
		date: '2023-01',
		outgoing1: 1800,
		outgoing2: 2400,
	},
	{
		date: '2023-02',
		outgoing1: 2800,
		outgoing2: 1398,
	},
	{
		date: '2023-03',
		outgoing1: 2200,
		outgoing2: 9800,
	},
	{
		date: '2023-04',
		outgoing1: 2000,
		outgoing2: 3908,
	},
	{
		date: '2023-05',
		outgoing1: 2181,
		outgoing2: 4800,
	},
	{
		date: '2023-06',
		outgoing1: 2500,
		outgoing2: 3800,
	},
];

const incomingChartData = [
	{
		date: '2023-01',
		incoming1: 4000,
		incoming2: 2400,
	},
	{
		date: '2023-02',
		incoming1: 3000,
		incoming2: 1398,
	},
	{
		date: '2023-03',
		incoming1: 2000,
		incoming2: 9800,
	},
	{
		date: '2023-04',
		incoming1: 2780,
		incoming2: 3908,
	},
	{
		date: '2023-05',
		incoming1: 1890,
		incoming2: 4800,
	},
	{
		date: '2023-06',
		incoming1: 2390,
		incoming2: 3800,
	},
];

const incomingChartConfig = {
	incoming1: {
		label: 'Incoming 1',
		color: 'hsl(var(--chart-1))',
	},
	incoming2: {
		label: 'Incoming 2',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

const outgoingChartConfig = {
	outgoing1: {
		label: 'Outgoing 1',
		color: 'hsl(var(--chart-1))',
	},
	outgoing2: {
		label: 'Outgoing 2',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

type Direction = 'incoming' | 'outgoing';

export function StatisticsTimeseriesChart() {
	const [direction, setDirection] = React.useState<Direction>('incoming');

	const activeChart = direction === 'incoming' ? incomingChartConfig : outgoingChartConfig;
	const activeData = direction === 'incoming' ? incomingChartData : outgoingChartData;

	const total = React.useMemo(
		() => ({
			incoming: incomingChartData.reduce(
				(acc, curr) => acc + curr.incoming1 + curr.incoming2,
				0,
			),
			outgoing: outgoingChartData.reduce(
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
					config={activeChart}
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
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
						{Object.keys(activeChart).map((key) => (
							<Area
								key={key}	
								type='monotone'
								dataKey={key}
								stackId='1'
								stroke={activeChart[key].color}
								fill={activeChart[key].color}
							/>
						))}
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
