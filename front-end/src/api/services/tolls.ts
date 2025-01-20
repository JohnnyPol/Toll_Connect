import { apiClient } from '@/api/index.ts';
import { Operator } from '@/types/operators.ts';
import { TollMap, Toll } from '@/types/tolls.ts';

export const tollService = {
	getByOperator: async (operatorId: Operator['_id']) => {
		const response = await apiClient.get<TollMap[]>(
			`/operators/${operatorId}/tolls`,
		);
		return response.data;
	},
	getById: async (tollId: Toll['_id']) => {
		const response = await apiClient.get<Toll>(`/tolls/${tollId}`);
		return response.data;
	}
};
