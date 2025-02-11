import { axios } from '@/api/index.ts';
import { StatisticsFilterFormValues } from '@/components/statistics-company-filter-form.tsx';
import { dateToURLParam } from '@/lib/date-transformer.ts';
import { Operator } from '@/types/operators.ts';
import { AggregatePassData, TimeseriesPassData } from '@/types/statistics.ts';

export const statisticsService = {
	getTimeseriesIncoming: async (
		filters: StatisticsFilterFormValues,
		asOperator: Operator['_id'] | undefined,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const params = {
			as_operator: asOperator || 'OO',
		};

		const response = await axios.get<TimeseriesPassData[]>(
			`/statistics/timeseries/incomingPasses/${startDate}/${endDate}`, {
				params,
			},
		);
		return response.data;
	},
	getTimeseriesOutgoing: async (
		filters: StatisticsFilterFormValues,
		asOperator: Operator['_id'] | undefined,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const params = {
			as_operator: asOperator || 'OO',
		};

		const response = await axios.get<TimeseriesPassData[]>(
			`/statistics/timeseries/outgoingPasses/${startDate}/${endDate}`, {
				params,
			},
		);
		return response.data;
	},

	getAggregateIncoming: async (
		filters: StatisticsFilterFormValues,
		asOperator: Operator['_id'] | undefined,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const params = {
			as_operator: asOperator || 'OO',
		};

		const response = await axios.get<AggregatePassData[]>(
			`/statistics/aggregate/incomingPasses/${startDate}/${endDate}`, {
				params,
			},
		);
		return response.data;
	},
	getAggregateOutgoing: async (
		filters: StatisticsFilterFormValues,
		asOperator: Operator['_id'] | undefined,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const params = {
			as_operator: asOperator || 'OO',
		};

		const response = await axios.get<AggregatePassData[]>(
			`/statistics/aggregate/outgoingPasses/${startDate}/${endDate}`, {
				params,
			},
		);
		return response.data;
	},
};
