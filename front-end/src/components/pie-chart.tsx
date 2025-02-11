import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

interface PieChartProps {
	title: string;
	names: string[];
	values: number[];
	colors?: string[];
	tooltipFormat?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
	title,
	names,
	values,
	colors,
	tooltipFormat,
}) => {
	const options: Highcharts.Options = {
		chart: {
			type: 'pie',
		},
		title: {
			text: title,
		},
		tooltip: {
			pointFormat: tooltipFormat,
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
			},
		},
		colors: colors,
		series: [
			{
				type: 'pie',
				data: names.map((name, index) => ({
					name: name.toUpperCase(),
					y: values[index],
				})),
			},
		],
	};

	return <HighchartsReact highcharts={Highcharts} options={options} />;
};
