import { useQuery } from '@tanstack/react-query';
import { tollService } from '@/api/services/tolls.ts';
import { Toll, TollStatistics } from '@/types/tolls.ts';

interface UseTollReturn {
	toll: TollStatistics | undefined;
	isLoading: boolean;
	error: Error | null;
}

export const useToll = (
	tollId: Toll['_id'],
	startDate: Date,
	endDate: Date,
): UseTollReturn => {
	const { data: toll, isLoading, error } = useQuery({
		queryKey: ['toll', tollId, startDate, endDate],
		queryFn: () => tollService.getById(tollId, startDate, endDate),
	});

	return { toll, isLoading, error };
};
