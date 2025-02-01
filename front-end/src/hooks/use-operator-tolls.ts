import { useEffect, useState } from 'react';
import { tollService } from '@/api/services/tolls.ts';
import { Operator } from '@/types/operators.ts';
import { TollMarkerData } from '@/types/tolls.ts';
import { AxiosError } from 'axios';

interface UseOperatorTollsReturn {
	operatorTolls: TollMarkerData[];
	loading: boolean;
	error: string | null;
}

export const useOperatorTolls = (
	operatorId: Operator['_id'],
): UseOperatorTollsReturn => {
	const [tollMarkers, setTollMarkers] = useState<TollMarkerData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTolls = async (): Promise<void> => {
			try {
				setLoading(true);
				const data = await tollService.getByOperator(operatorId);
				setTollMarkers(data);
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

		fetchTolls();
	}, []);

	return {
		operatorTolls: tollMarkers,
		loading,
		error,
	};
};
