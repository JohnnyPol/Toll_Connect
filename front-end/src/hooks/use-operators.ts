import { useEffect, useState } from 'react';
import { operatorService } from '@/api/services/operators.ts';
import type { Operator } from '@/types/operators.ts';
import { AxiosError } from 'axios';

interface UseOperatorsReturn {
	operators: Operator[];
	loading: boolean;
	error: string | null;
}

export const useOperators = (): UseOperatorsReturn => {
	const [operators, setOperators] = useState<Operator[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchOperators = async (): Promise<void> => {
		try {
			setLoading(true);
			const data = await operatorService.getAll();
			setOperators(data);
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
		fetchOperators();
	}, []);

	return {
		operators,
		loading,
		error,
	};
};
