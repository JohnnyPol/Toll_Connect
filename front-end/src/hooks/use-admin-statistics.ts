import { useQuery } from '@tanstack/react-query';
import { StatisticsAdminFilterFormValues } from '@/components/statistics-admin-filter-form.tsx';
import { AggregatePassData, TimeseriesPassData } from '@/types/statistics.ts';
import { statisticsService } from '@/api/services/statistics.ts';

interface UseAdminStatisticsReturn {
	timeseriesIncoming: TimeseriesPassData[] | undefined;
	timeseriesOutgoing: TimeseriesPassData[] | undefined;
	timeseriesLoading: boolean;
	timeseriesError: Error | null;
	aggregateIncoming: AggregatePassData[] | undefined;
	aggregateOutgoing: AggregatePassData[] | undefined;
	aggregateLoading: boolean;
	aggregateError: Error | null;
}

export const useAdminStatistics = (
	filters: StatisticsAdminFilterFormValues,
): UseAdminStatisticsReturn => {
	const {
		data: timeseriesIncoming,
		isLoading: timeseriesIncomingLoading,
		error: timeseriesIncomingError,
	} = useQuery({
		queryKey: ['timeseriesIncoming', filters],
		queryFn: () => statisticsService.getTimeseriesIncoming(filters, filters?.specificOperator),
	});

	const {
		data: timeseriesOutgoing,
		isLoading: timeseriesOutgoingLoading,
		error: timeseriesOutgoingError,
	} = useQuery({
		queryKey: ['timeseriesOutgoing', filters],
		queryFn: () => statisticsService.getTimeseriesOutgoing(filters, filters?.specificOperator),
	});

	const {
		data: aggregateIncoming,
		isLoading: aggregateIncomingLoading,
		error: aggregateIncomingError,
	} = useQuery({
		queryKey: ['aggregateIncoming', filters],
		queryFn: () => statisticsService.getAggregateIncoming(filters, filters?.specificOperator),
	});

	const {
		data: aggregateOutgoing,
		isLoading: aggregateOutgoingLoading,
		error: aggregateOutgoingError,
	} = useQuery({
		queryKey: ['aggregateOutgoing', filters],
		queryFn: () => statisticsService.getAggregateOutgoing(filters, filters?.specificOperator),
	});

	const timeseriesLoading = timeseriesIncomingLoading || timeseriesOutgoingLoading;
	const timeseriesError = timeseriesIncomingError || timeseriesOutgoingError;
	const aggregateLoading = aggregateIncomingLoading || aggregateOutgoingLoading;
	const aggregateError = aggregateIncomingError || aggregateOutgoingError;

	return {
		timeseriesIncoming,
		timeseriesOutgoing,
		timeseriesLoading,
		timeseriesError,
		aggregateIncoming,
		aggregateOutgoing,
		aggregateLoading,
		aggregateError,
	};
};
