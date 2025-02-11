import { useState } from 'react';
import {
	APIProvider,
	ControlPosition,
	Map,
	MapControl,
} from '@vis.gl/react-google-maps';
import { Toaster } from '@/components/ui/toast.tsx';

import { MapFilterFormValues } from '@/components/map-filter-form.tsx';
import { Operator } from '@/types/operators.ts';
import { subDays } from 'date-fns/subDays';
import { MapFilterSheet } from '@/components/map-filter-sheet.tsx';
import Heatmap from '@/components/heatmap.tsx';
import { OperatorProvider } from '@/context/operator-context.tsx';
import { MapOperatorMarkers } from '@/components/map-operator-markers.tsx';
import { MapOperatorLegend } from '@/components/map-operator-legend.tsx';

export default function AdminMapPage() {
	const [filterFormValues, setFilterFormValues] = useState<MapFilterFormValues>(
		{
			startDate: subDays(new Date(), 30),
			endDate: new Date(),
			operatorIds: [],
		},
	);

	return (
		<>
			<Toaster position='bottom-center' richColors closeButton />
			<APIProvider
				apiKey={'AIzaSyDAMNPvIOhRWOsnVi-xRUMTHW3RD8uFJcw'}
				onLoad={() => {
					console.log('Maps API has loaded.');
				}}
			>
				<Map
					defaultZoom={7}
					defaultCenter={{
						lat: 37.98,
						lng: 23.78,
					}}
					options={{
						styles: [{
							featureType: 'poi',
							stylers: [{ visibility: 'off' }],
						}],
					}}
					disableDefaultUI
					reuseMaps={true}
				>

					{filterFormValues.operatorIds.map((id: Operator['_id']) => (
						<MapOperatorMarkers
							key={id}
							id={id}
							startDate={filterFormValues.startDate}
							endDate={filterFormValues.endDate}
						/>
					))}

					<MapControl
						position={ControlPosition
							.TOP_CENTER}
					>
						<MapFilterSheet
							defaultValues={filterFormValues}
							onSubmit={setFilterFormValues}
						/>
					</MapControl>

					{filterFormValues.operatorIds.length !== 0 && (
						<MapOperatorLegend operatorIds={filterFormValues.operatorIds} />
					)}
				</Map>
			</APIProvider>
		</>
	);
}
