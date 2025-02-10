import { useQuery } from '@tanstack/react-query';
import { StatisticsFilterFormValues } from '@/components/statistics-company-filter-form.tsx';
import { AggregatePassData, TimeseriesPassData } from '@/types/statistics.ts';
import { statisticsService } from '@/api/services/statistics.ts';

interface UseCompanyStatisticsReturn {
	timeseriesIncoming: TimeseriesPassData[] | undefined;
	timeseriesOutgoing: TimeseriesPassData[] | undefined;
	timeseriesIncomingLoading: boolean;
	timeseriesOutgoingLoading: boolean;
	timeseriesIncomingError: Error | null;
	timeseriesOutgoingError: Error | null;
	aggregateIncoming: AggregatePassData[] | undefined;
	aggregateOutgoing: AggregatePassData[] | undefined;
	aggregateIncomingLoading: boolean;
	aggregateOutgoingLoading: boolean;
	aggregateIncomingError: Error | null;
	aggregateOutgoingError: Error | null;
}

export const useCompanyStatistics = (
	filters: StatisticsFilterFormValues,
): UseCompanyStatisticsReturn => {
	const {
		data: timeseriesIncoming,
		isLoading: timeseriesIncomingLoading,
		error: timeseriesIncomingError,
	} = useQuery({
		queryKey: ['timeseriesIncoming', filters],
		queryFn: () => statisticsService.getTimeseriesIncoming(filters, undefined),
	});

	const {
		data: timeseriesOutgoing,
		isLoading: timeseriesOutgoingLoading,
		error: timeseriesOutgoingError,
	} = useQuery({
		queryKey: ['timeseriesOutgoing', filters],
		queryFn: () => statisticsService.getTimeseriesOutgoing(filters, undefined),
	});

	const {
		data: aggregateIncoming,
		isLoading: aggregateIncomingLoading,
		error: aggregateIncomingError,
	} = useQuery({
		queryKey: ['aggregateIncoming', filters],
		queryFn: () => statisticsService.getAggregateIncoming(filters, undefined),
	});

	const {
		data: aggregateOutgoing,
		isLoading: aggregateOutgoingLoading,
		error: aggregateOutgoingError,
	} = useQuery({
		queryKey: ['aggregateOutgoing', filters],
		queryFn: () => statisticsService.getAggregateOutgoing(filters, undefined),
	});

	

	return {
		timeseriesIncoming,
		timeseriesOutgoing,
		timeseriesIncomingLoading,
		timeseriesIncomingError,
		timeseriesOutgoingLoading,
		timeseriesOutgoingError,
		aggregateIncoming,
		aggregateOutgoing,
		aggregateIncomingLoading,
		aggregateIncomingError,
		aggregateOutgoingLoading,
		aggregateOutgoingError
	};
};
