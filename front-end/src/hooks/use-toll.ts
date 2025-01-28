import { useEffect, useState } from 'react';
import { tollService } from '@/api/services/tolls.ts';
import { Toll } from '@/types/tolls.ts';
import { AxiosError } from 'axios';

interface UseTollReturn {
	toll: Toll;
	loading: boolean;
	error: string | null;
}

export const useToll = (tollId: Toll['_id']): UseTollReturn => {
	const [toll, setToll] = useState<Toll | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchToll = async (): Promise<void> => {
		try {
			setLoading(true);
			const data = await tollService.getById(tollId);
			setToll(data);
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
		fetchToll();
	}, []);

	return { toll, loading, error };
};
