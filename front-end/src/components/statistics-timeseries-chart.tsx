import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart.tsx';
import { useOperators } from '@/hooks/use-operators.ts';
import { TimeseriesPassData } from '@/types/statistics.ts';

export const description = 'An interactive bar chart';

type Direction = 'incoming' | 'outgoing';

interface StatisticsTimeseriesChartProps {
	incomingData: TimeseriesPassData[];
	outgoingData: TimeseriesPassData[];
}

const DEFAULT_COLORS = [
	'#3b82f6',
	'#22c55e',
	'#0ea5e9',
	'#ec4899',
	'#a855f7',
	'#ef4444',
	'#eab308',
	'#f97316',
];

export const StatisticsTimeseriesChart: React.FC<
	StatisticsTimeseriesChartProps
> = ({
	incomingData,
	outgoingData,
}) => {
	const [direction, setDirection] = useState<Direction>('incoming');

	const { operators } = useOperators();

	const filteredOperators = operators.filter((operator) => {
		const incomingHasData = incomingData.some((item) =>
			item.operators.some((op) => op.operator === operator._id && op.cost > 0)
		);
		const outgoingHasData = outgoingData.some((item) =>
			item.operators.some((op) => op.operator === operator._id && op.cost > 0)
		);
		return incomingHasData || outgoingHasData;
	});

	const chartConfig = useMemo<ChartConfig>(() => {
		const config: ChartConfig = {};
		filteredOperators.forEach((operator, index) => {
			config[operator._id] = {
				label: operator.name.toLocaleUpperCase(),
				color: operator?.chartColor ||
					DEFAULT_COLORS[index % DEFAULT_COLORS.length],
			};
		});
		return config;
	}, [filteredOperators]);

	const incomingChartData = incomingData.map((item) => {
		const operatorData = item.operators.reduce(
			(acc, curr) => ({
				...acc,
				[curr.operator]: curr.cost,
			}),
			{} as { [key: string]: number },
		);

		filteredOperators.forEach((operator) => {
			if (!operatorData[operator._id]) {
				operatorData[operator._id] = 0;
			}
		});

		return {
			date: item.date,
			...operatorData,
		};
	});

	const outgoingChartData = outgoingData.map((item) => {
		const operatorData = item.operators.reduce(
			(acc, curr) => ({
				...acc,
				[curr.operator]: curr.cost,
			}),
			{} as { [key: string]: number },
		);

		filteredOperators.forEach((operator) => {
			if (!operatorData[operator._id]) {
				operatorData[operator._id] = 0;
			}
		});

		return {
			date: item.date,
			...operatorData,
		};
	});

	const activeData = direction === 'incoming'
		? incomingChartData
		: outgoingChartData;

	const total = {
		incoming: incomingData.reduce((acc, curr) => {
			return acc + curr.operators.reduce((acc, curr) => {
				return acc + curr.cost;
			}, 0);
		}, 0),
		outgoing: outgoingData.reduce((acc, curr) => {
			return acc + curr.operators.reduce((acc, curr) => {
				return acc + curr.cost;
			}, 0);
		}, 0),
	};

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
							{total.incoming.toLocaleString('el-GR', {
								style: 'currency',
								currency: 'EUR',
							})}
						</span>
					</button>
					<button
						key='outgoing'
						data-active={direction === 'outgoing'}
						className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
						onClick={() => setDirection('outgoing')}
					>
						<span className='text-xs text-muted-foreground'>
							Outgoing
						</span>
						<span className='text-lg font-bold leading-none sm:text-3xl'>
						{total.outgoing.toLocaleString('el-GR', {
								style: 'currency',
								currency: 'EUR',
							})}
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
									localeConfig={{
										style: 'currency',
										currency: 'EUR',
									}}
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
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
