import { useOperatorTolls } from '@/hooks/use-operator-tolls.ts';
import { Operator } from '@/types/operators.ts';
import { toast } from 'sonner';
import { MapTollMarker } from '@/components/map-toll-marker.tsx';
import { MapTollPopup } from '@/components/map-toll-popup.tsx';
import { useOperators } from '@/hooks/use-operators.ts';

interface MapOperatorMarkersProps {
	id: Operator['_id'];
	startDate: Date;
	endDate: Date;
}

export const MapOperatorMarkers: React.FC<MapOperatorMarkersProps> = (
	{ id, startDate, endDate },
) => {
	const { operators } = useOperators();
	const { operatorTolls, isLoading, error } = useOperatorTolls(id);

	const markerIcon = operators.find((operator) => operator._id === id)
		?.markerIcon;

	if (isLoading) {
		toast.loading('Loading toll markers...', {
			id: `loading-${id}`,
		});
	} else {
		setTimeout(() => {
			toast.dismiss(`loading-${id}`);
		}, 10);
	}

	if (error) {
		toast.error(error.message, {
			id: `error-${id}`,
		});
	}

	return (
		<div key={id}>
			{!isLoading && !error && (
				<>
					{operatorTolls?.map((toll) => (
						<MapTollMarker
							key={toll._id}
							tollMarkerData={toll}
							markerIcon={markerIcon}
						>
							<MapTollPopup
								tollId={toll._id}
								startDate={startDate}
								endDate={endDate}
							/>
						</MapTollMarker>
					))}
				</>
			)}
		</div>
	);
};
