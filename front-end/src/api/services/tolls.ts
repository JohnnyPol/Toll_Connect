import { apiClient } from '@/api/index.ts';
import { Operator } from '@/types/operators.ts';
import { Toll } from '@/types/tolls.ts';

export const tollService = {
	getByOperator: async (operatorId: Operator['id']) => {
		const response = await apiClient.get<Toll[]>(
			`/operators/${operatorId}/tolls`,
		);
		return response.data;
	},
};
