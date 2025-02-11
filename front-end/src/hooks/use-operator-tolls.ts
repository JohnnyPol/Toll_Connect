import { useQuery } from '@tanstack/react-query';
import { tollService } from '@/api/services/tolls.ts';
import { Operator } from '@/types/operators.ts';
import { TollMarkerData } from '@/types/tolls.ts';

interface UseOperatorTollsReturn {
	operatorTolls: TollMarkerData[] | undefined;
	isLoading: boolean;
	error: Error | null;
}

export const useOperatorTolls = (
	operatorId: Operator['_id'],
): UseOperatorTollsReturn => {
	const {
		data,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['operatorTolls', operatorId],
		queryFn: () => tollService.getByOperator(operatorId),
	});

	return {
		operatorTolls: data,
		isLoading,
		error,
	};
};
