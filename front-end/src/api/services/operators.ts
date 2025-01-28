import { axios } from '@/api/index.ts';
import { HeatmapData, Operator } from '@/types/operators.ts';

export const operatorService = {
	getAll: async () => {
		const response = await axios.get<Operator[]>('/operators');
		return response.data;
	},
	getHeatmapData: async (operatorId: Operator['_id']) => {
		const response = await axios.get<HeatmapData[]>(
			`/operators/${operatorId}/passes/heatmap`,
		);
		return response.data;
	},
};
