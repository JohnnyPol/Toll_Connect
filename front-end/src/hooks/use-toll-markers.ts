import { useState } from 'react';
import { tollService } from '@/api/services/tolls.ts';
import { Operator } from '@/types/operators.ts';
import { TollMarkerData } from '@/types/tolls.ts';
import { AxiosError } from 'axios';

interface TollMarkerState {
	[operatorId: Operator['_id']]: {
		data: TollMarkerData[];
		loading: boolean;
		error: string | null;
		markerIcon: string;
	};
}

interface UseTollMarkersReturn {
	tollMarkerState: TollMarkerState;
	fetchTollMarkersForOperator: (operatorId: Operator['_id']) => Promise<void>;
	fetchTollMarkersForAllOperators: (
		operators: Operator['_id'][],
	) => Promise<void>;
}

export const useTollMarkers = (): UseTollMarkersReturn => {
	const [tollMarkerState, setTollMarkerState] = useState<TollMarkerState>({});

	const fetchTollMarkersForOperator = async (
		operatorId: Operator['_id'],
	): Promise<void> => {
		try {
			setTollMarkerState((prev: TollMarkerState) => ({
				...prev,
				[operatorId]: {
					data: [],
					loading: true,
					error: null,
					markerIcon: '',
				},
			}));
			const { data, markerIcon } = await tollService.getByOperator(operatorId);
			setTollMarkerState((prev: TollMarkerState) => ({
				...prev,
				[operatorId]: {
					data,
					loading: false,
					error: null,
					markerIcon,
				},
			}));
		} catch (err) {
			const errorMessage = err instanceof AxiosError
				? err.response?.data?.message || err.message
				: 'An unexpected error occurred';

			setTollMarkerState((prev: TollMarkerState) => ({
				...prev,
				[operatorId]: {
					data: [],
					loading: false,
					error: errorMessage,
					markerIcon: '',
				},
			}));
		}
	};

	const fetchTollMarkersForAllOperators = async (
		operators: Operator['_id'][],
	): Promise<void> => {
		if (operators.length === 0) {
			setTollMarkerState({});
		}
		await Promise.all(operators.map(fetchTollMarkersForOperator));
	};

	return {
		tollMarkerState,
		fetchTollMarkersForOperator,
		fetchTollMarkersForAllOperators,
	};
};
