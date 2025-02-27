import { axios } from '@/api/index.ts';
import { Operator } from '@/types/operators.ts';
import { Toll, TollMarkerData, TollStatistics } from '@/types/tolls.ts';
import { dateToURLParam } from '@/lib/date-transformer.ts';

export const tollService = {
	getByOperator: async (operatorId: Operator['_id']) => {
		const response = await axios.get<TollMarkerData[]>(
			`/db/tolls/by_operator/${operatorId}`,
		);
		return response.data;
	},
	getById: async (tollId: Toll['_id'], startDate: Date, endDate: Date) => {
		const response = await axios.get<TollStatistics>(
			`/statistics/${tollId}/${dateToURLParam(startDate)}/${
				dateToURLParam(endDate)
			}`,
		);
		return response.data;
	},
};
