import { Operator } from '@/types/operators.ts';
import { MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import { useOperators } from '@/hooks/use-operators.ts';

interface MapOperatorLegendProps {
	operatorIds: Operator['_id'][];
}

export const MapOperatorLegend: React.FC<MapOperatorLegendProps> = (
	{ operatorIds },
) => {
	const { operators } = useOperators();

	return (
		<MapControl
			position={ControlPosition
				.LEFT_BOTTOM}
		>
			<div className='bg-white p-4 rounded-lg shadow-md m-4'>
				<h3 className='text-lg font-semibold mb-2 text-center'>Legend</h3>
				<div className='space-y-2'>
					{operatorIds.map((id) => {
						const operator = operators.find((operator) => operator._id === id);
						if (!operator) {
							return null;
						}
						return (
							<div
								key={id}
								className='flex items-center gap-2'
							>
								<img
									src={operator.markerIcon}
									alt='marker'
									className='w-6 h-6'
								/>
								<span>{operator.name.toUpperCase()}</span>
							</div>
						);
					})}
				</div>
			</div>
		</MapControl>
	);
};
