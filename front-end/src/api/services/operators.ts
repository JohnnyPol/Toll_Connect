import { axios } from '@/api/index.ts';
import { HeatmapData, Operator } from '@/types/operators.ts';

export const operatorService = {
	getAll: async () => {
		const response = await axios.get<Operator[]>('/db/toll-operators');
		return response.data;
	},
	getHeatmapData: async () => {
		const response = await axios.get<HeatmapData[]>(
			`/statistics/heatmap`,
		);
		return response.data;
	},
};
