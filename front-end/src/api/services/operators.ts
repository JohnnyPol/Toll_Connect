import { axios } from '@/api/index.ts';
import { Operator } from '@/types/operators.ts';

export const operatorService = {
	getAll: async () => {
		const response = await axios.get<Operator[]>('/operators');
		return response.data;
	},
};
