import { axios } from '@/api/index.ts';
import { StatisticsCompanyFilterFormValues } from '@/components/statistics-company-filter-form.tsx';
import { dateToURLParam } from '@/lib/date-transformer.ts';
import { Operator } from '@/types/operators.ts';
import { AggregatePassData, AllPassData, TimeseriesPassData } from '@/types/statistics.ts';
import { StatisticsAdminFilterFormValues } from '@/components/statistics-admin-filter-form.tsx';

export const statisticsService = {
	getTimeseriesIncoming: async (
		filters: StatisticsCompanyFilterFormValues | StatisticsAdminFilterFormValues,
		asOperator: Operator['_id'] | undefined,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const params = {
			as_operator: asOperator || undefined,
		};

		const response = await axios.get<TimeseriesPassData[]>(
			`/statistics/timeseries/incomingPasses/${startDate}/${endDate}`, {
				params,
			},
		);
		return response.data;
	},
	getTimeseriesOutgoing: async (
		filters: StatisticsCompanyFilterFormValues | StatisticsAdminFilterFormValues,
		asOperator: Operator['_id'] | undefined,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const params = {
			as_operator: asOperator || undefined,
		};

		const response = await axios.get<TimeseriesPassData[]>(
			`/statistics/timeseries/outgoingPasses/${startDate}/${endDate}`, {
				params,
			},
		);
		return response.data;
	},

	getAggregateIncoming: async (
		filters: StatisticsCompanyFilterFormValues | StatisticsAdminFilterFormValues,
		asOperator: Operator['_id'] | undefined,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const params = {
			as_operator: asOperator || undefined,
		};

		const response = await axios.get<AggregatePassData[]>(
			`/statistics/aggregate/incomingPasses/${startDate}/${endDate}`, {
				params,
			},
		);
		return response.data;
	},
	getAggregateOutgoing: async (
		filters: StatisticsCompanyFilterFormValues | StatisticsAdminFilterFormValues,
		asOperator: Operator['_id'] | undefined,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const params = {
			as_operator: asOperator || undefined,
		};

		const response = await axios.get<AggregatePassData[]>(
			`/statistics/aggregate/outgoingPasses/${startDate}/${endDate}`, {
				params,
			},
		);
		return response.data;
	},
	getAllPasses: async (
		filters: StatisticsAdminFilterFormValues,
	) => {
		const startDate = dateToURLParam(filters.startDate || new Date(0));
		const endDate = dateToURLParam(filters.endDate);

		const response = await axios.get<AllPassData[]>(
			`/admin/allpasses/${startDate}/${endDate}`,
		);
		return response.data;
	}
};
