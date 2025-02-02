import { axios } from '@/api/index.ts';
import { Operator } from '@/types/operators.ts';
import { TollMarkerData, Toll } from '@/types/tolls.ts';

export const tollService = {
	getByOperator: async (operatorId: Operator['_id']) => {
		const response = await axios.get<TollMarkerData[]>(`/operators/${operatorId}/tolls`);
		return response.data;
	},
	getById: async (tollId: Toll['_id']) => {
		const response = await axios.get<Toll>(`/tolls/${tollId}/detailed`);
		return response.data;
	},
};
