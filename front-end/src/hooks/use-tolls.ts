import { useState } from 'react';
import { tollService } from '@/api/services/tolls.ts';
import { Operator } from '@/types/operators.ts';
import { TollMap } from '@/types/tolls.ts';
import { AxiosError } from 'axios';

interface TollState {
	[operatorId: string]: {
		data: TollMap[];
		loading: boolean;
		error: string | null;
	};
}

interface UseTollsReturn {
	tollState: TollState;
	fetchTollsForOperator: (operatorId: Operator['_id']) => Promise<void>;
	fetchTollsForAllOperators: (operators: Operator['_id'][]) => Promise<void>;
}

export const useTolls = (): UseTollsReturn => {
	const [tollState, setTollState] = useState<TollState>({});

	const fetchTollsForOperator = async (operatorId: Operator['_id']): Promise<void> => {
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

	const fetchTollsForAllOperators = async (operators: Operator['_id'][]): Promise<void> => {
		await Promise.all(operators.map(fetchTollsForOperator));
	};

	return {
		tollState,
		fetchTollsForOperator,
		fetchTollsForAllOperators,
	};
};
