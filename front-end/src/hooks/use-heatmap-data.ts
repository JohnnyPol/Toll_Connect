import { useEffect, useState } from 'react';
import { operatorService } from '@/api/services/operators.ts';
import { HeatmapData, Operator } from '@/types/operators.ts';
import { AxiosError } from 'axios';

interface UseHeatmapDataReturn {
	data: HeatmapData[];
	loading: boolean;
	error: string | null;
}

export const useHeatmapData = (
	operatorId: Operator['_id'],
): UseHeatmapDataReturn => {
	const [data, setData] = useState<HeatmapData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async (): Promise<void> => {
		try {
			setLoading(true);
			const data = await operatorService.getHeatmapData(operatorId);
			setData(data);
			setError(null);
		} catch (err) {
			const errorMessage = err instanceof AxiosError
				? err.response?.data?.message || err.message
				: 'An unexpected error occurred';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return {
		data,
		loading,
		error,
	};
};
