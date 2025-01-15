import { useState } from 'react';
import { tollService } from '@/api/services/tolls.ts';
import { Operator } from '@/types/operators.ts';
import { Toll } from '@/types/tolls.ts';
import { AxiosError } from 'axios';

interface TollState {
	[operatorId: string]: {
		data: Toll[];
		loading: boolean;
		error: string | null;
	};
}

export const useTolls = () => {
	const [tollState, setTollState] = useState<TollState>({});

	const fetchTollsForOperator = async (operatorId: Operator['id']) => {
		// Initialize state for this operator if it doesn't exist
		setTollState((prev) => ({
			...prev,
			[operatorId]: {
				data: prev[operatorId]?.data || [],
				loading: true,
				error: null,
			},
		}));

		try {
			const data = await tollService.getByOperator(operatorId);
			setTollState((prev) => ({
				...prev,
				[operatorId]: {
					data,
					loading: false,
					error: null,
				},
			}));
		} catch (err) {
			const errorMessage = err instanceof AxiosError
				? err.response?.data?.message || err.message
				: 'An unexpected error occurred';

			setTollState((prev) => ({
				...prev,
				[operatorId]: {
					data: [],
					loading: false,
					error: errorMessage,
				},
			}));
		}
	};

	const fetchTollsForAllOperators = async (operators: Operator['id'][]) => {
		await Promise.all(operators.map(fetchTollsForOperator));
	};

	return {
		tollState,
		fetchTollsForOperator,
		fetchTollsForAllOperators,
	};
};
