import { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';

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
import { Operator } from '@/types/operators.ts';
import { useOperators } from '@/hooks/use-operators.ts';
import { AggregatePassData } from '@/types/statistics.ts';

interface StatisticsPieChartProps {
	title: string;
	description: string;
	data: AggregatePassData[];
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

export const StatisticsPieChart: React.FC<StatisticsPieChartProps> = ({
	data,
	description,
	title,
}) => {
	const { operators } = useOperators();

	if (!operators) {
		return null;
	}

	const chartConfig: ChartConfig = {};
	operators.forEach((operator, _) => {
		chartConfig[operator._id] = {
			label: operator.name.toLocaleUpperCase(),
		};
	});

	const chartData = data.map((item, index) => ({
		operator: item._id,
		visitors: item.passes,
		fill: operators.find((operator) => operator._id === item._id)
			?.chartColor || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
	}));

	const totalPasses = data.reduce((acc, item) => acc + item.passes, 0);

	return (
		<Card className='flex flex-col'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[300px]'
				>
					<PieChart>
						<Pie
							data={chartData}
							nameKey='operator'
							dataKey='visitors'
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground text-3xl font-bold'
												>
													{totalPasses}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'
												>
													Passes
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent className='w-[200px]' hideLabel />}
						/>
						<ChartLegend
							content={<ChartLegendContent nameKey='operator' />}
							className='-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center'
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
