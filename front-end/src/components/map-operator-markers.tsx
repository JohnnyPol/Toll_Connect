import { useOperatorTolls } from '@/hooks/use-operator-tolls.ts';
import { Operator } from '@/types/operators.ts';
import { toast } from 'sonner';
import { MapTollMarker } from '@/components/map-toll-marker.tsx';
import { MapTollPopup } from './map-toll-popup.tsx';
import { useOperators } from '@/hooks/use-operators.ts';

interface MapOperatorMarkersProps {
	id: Operator['_id'];
}

export const MapOperatorMarkers: React.FC<MapOperatorMarkersProps> = (
	{ id },
) => {
	const { operators } = useOperators();
	const { operatorTolls, loading, error } = useOperatorTolls(id);

	const markerIcon = operators.find((operator) => operator._id === id)?.markerIcon;

	if (loading) {
		toast.loading('Loading toll markers...', {
			id: `loading-${id}`,
		});
	} else {
		setTimeout(() => {
			toast.dismiss(`loading-${id}`);
		}, 10);
	}

	if (error) {
		toast.error(error, {
			id: `error-${id}`,
		});
	}

	return (
		<div key={id}>
			{!loading && !error && (
				<>
					{operatorTolls.map((toll) => (
						<MapTollMarker
							key={toll._id}
							tollMarkerData={toll}
							markerIcon={markerIcon}
						>
							<MapTollPopup
								tollId={toll._id}
							/>
						</MapTollMarker>
					))}
				</>
			)}
		</div>
	);
};
