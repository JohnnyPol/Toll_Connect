import { apiClient } from '@/api/index.ts';
import { Operator } from '@/types/operators.ts';
import { Toll } from '@/types/tolls.ts';

export const operatorService = {
	getAll: async () => {
		const response = await apiClient.get<Operator[]>('/operators');
		return response.data;
	},
};
