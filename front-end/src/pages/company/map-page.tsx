import { useRef } from 'react';
import {
	APIProvider,
	ControlPosition,
	Map,
	MapControl,
} from '@vis.gl/react-google-maps';
import { Toaster } from '@/components/ui/toast.tsx';
import { useTollMarkers } from '@/hooks/use-toll-markers.ts';

import { MapFilterFormValues } from '@/components/map-filter-form.tsx';
import { Operator } from '@/types/operators.ts';
import { toast } from 'sonner';
import { subDays } from 'date-fns/subDays';
import { MapFilterSheet } from '@/components/map-filter-sheet.tsx';
import { MapTollMarker } from '@/components/map-toll-marker.tsx';
import Heatmap from '@/components/heatmap.tsx';
import { MapCompanyTollPopup } from '@/components/map-company-toll-popup.tsx';

export default function CompanyMapPage() {
	const { tollMarkerState, fetchTollMarkersForAllOperators } = useTollMarkers();
	const filterFormValues = useRef<MapFilterFormValues>({
		startDate: subDays(new Date(), 30),
		endDate: new Date(),
		operatorIds: [],
	});

	const handleSubmit = (values: MapFilterFormValues) => {
		console.log(values);
		filterFormValues.current = values;
		fetchTollMarkersForAllOperators(values.operatorIds);
	};

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
					<Heatmap
						radius={30}
						opacity={1}
					/>
					{filterFormValues.current.operatorIds.map((id: Operator['_id']) => {
						const operatorTollState = tollMarkerState[id] || {
							data: [],
							loading: false,
							error: null,
						};

						if (operatorTollState.loading) {
							toast.loading('Loading toll markers...', {
								id: `loading-${id}`,
							});
						} else {
							setTimeout(() => {
								toast.dismiss(`loading-${id}`);
							}, 10);
						}

						if (operatorTollState.error) {
							toast.error(operatorTollState.error, {
								id: `error-${id}`,
							});
						}

						return (
							<div key={id}>
								{!operatorTollState.loading && !operatorTollState.error && (
									<>
										{operatorTollState.data.map((toll) => (
											<MapTollMarker
												key={toll._id}
												tollMarkerData={toll}
												markerIcon={operatorTollState.markerIcon}
											>
												<MapCompanyTollPopup
													tollId={toll._id}
												/>
											</MapTollMarker>
										))}
									</>
								)}
							</div>
						);
					})}

					<MapControl
						position={ControlPosition
							.TOP_CENTER}
					>
						<MapFilterSheet
							defaultValues={filterFormValues.current}
							onSubmit={handleSubmit}
						/>
					</MapControl>
				</Map>
			</APIProvider>
		</>
	);
}
