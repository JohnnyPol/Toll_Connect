import { useQuery } from '@tanstack/react-query';
import { operatorService } from '@/api/services/operators.ts';
import { HeatmapData } from '@/types/operators.ts';

interface UseHeatmapDataReturn {
	data: HeatmapData[] | undefined;
	isLoading: boolean;
	error: Error | null;
}

export const useHeatmapData = (): UseHeatmapDataReturn => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['heatmapData'],
		queryFn: () => operatorService.getHeatmapData(),
	});

	return {
		data,
		isLoading,
		error,
	};
};
