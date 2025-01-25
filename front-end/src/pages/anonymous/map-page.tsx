import { useEffect, useRef, useState } from 'react';
import {
	APIProvider,
	ControlPosition,
	Map,
	MapCameraChangedEvent,
	MapControl,
	Marker,
} from '@vis.gl/react-google-maps';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet.tsx';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button.tsx';
import { FilterIcon, Terminal, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import DateRangeForm, {
	DateRangeFormData,
} from '@/components/date-range-form.tsx';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Toast, Toaster } from '@/components/ui/toast.tsx';
import { useTollMarkers } from '../../hooks/use-toll-markers.ts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Toll, TollMarkerData } from '@/types/tolls.ts';

import { tollService } from '@/api/services/tolls.ts';
import {
	MapFilterForm,
	MapFilterFormValues,
} from '@/components/map-filter-form.tsx';
import { useOperators } from '@/hooks/use-operators.ts';
import { Operator } from '@/types/operators.ts';
import { toast } from 'sonner';
import { subDays } from 'date-fns/subDays';
import { MapFilterSheet } from '@/components/map-filter-sheet.tsx';

export default function AnonymousMapPage() {
	const { tollMarkerState, fetchTollMarkersForAllOperators } = useTollMarkers();
	const filterFormValues = useRef<MapFilterFormValues>({
		startDate: subDays(new Date(), 30),
		endDate: new Date(),
		operatorIds: [],
	});

	const [selectedToll, setSelectedToll] = useState<
		TollMarkerData['_id'] | null
	>(null);

	const [tollData, setTollData] = useState<Toll>([]);

	const fetchToll = async (id: TollMarkerData['_id']): Promise<void> => {
		const data = await tollService.getById(id);
		setTollData(data);
	};

	useEffect(() => {
		fetchToll(selectedToll);
	}, [selectedToll]);

	const handleSubmit = (values: MapFilterFormValues) => {
		console.log(values);
		filterFormValues.current = values;
		fetchTollMarkersForAllOperators(values.operatorIds);
	};

	return (
		<>
			<Toaster />
			<APIProvider
				apiKey={'AIzaSyDAMNPvIOhRWOsnVi-xRUMTHW3RD8uFJcw'}
				onLoad={() => console.log('Maps API has loaded.')}
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
							stylers: [{ visibility: 'off' }], // Disable places of interest (POI)
						}],
					}}
					disableDefaultUI
					reuseMaps={true}
				>
					{filterFormValues.current.operatorIds.map((id: Operator['_id']) => {
						const operatorTollState = tollMarkerState[id] || {
							data: [],
							loading: false,
							error: null,
						};

						return (
							<>
								{operatorTollState.loading && (
									<Alert>
										<Terminal className='h-4 w-4' />
										<AlertTitle>Heads up!</AlertTitle>
										<AlertDescription>
											You can add components and dependencies to your app using
											the cli.
										</AlertDescription>
									</Alert>
								)}

								{operatorTollState.error &&
									toast.error(operatorTollState.error, {
										position: 'bottom-center',
									})}

								<Dialog>
									<>
										{!operatorTollState.loading && !operatorTollState.error && (
											<>
												{operatorTollState.data.map((toll) => (
													<DialogTrigger asChild>
														<Marker
															position={{
																lat: toll.latitude,
																lng: toll.longitude,
															}}
															title={toll.name}
															optimized
															onClick={() => {
																setSelectedToll(toll._id);
															}}
														/>
													</DialogTrigger>
												))}
											</>
										)}
									</>
									<DialogContent className='w-full'>
										<DialogHeader>
											<DialogTitle>Toll Information</DialogTitle>
											<DialogDescription>
												Here you can see information about the selected toll.
											</DialogDescription>
										</DialogHeader>
										<div className='grid gap-4 py-4'>
											<Label htmlFor='name'>Name</Label>
											<Input id='name' value={tollData.name} disabled />
											<Label htmlFor='price'>Price</Label>
											<Input id='price' value={tollData.price} disabled />
											<Label htmlFor='road'>Road</Label>
											<Input id='road' value={tollData.road} disabled />
											<Label htmlFor='operator'>Operator</Label>
											<Input
												id='operator'
												value={tollData.operator_name}
												disabled
											/>
											<Label htmlFor='avg-passes'>Average Passes</Label>
											<Input
												id='avg-passes'
												use-tolls
												value={tollData.avg_passes}
												disabled
											/>
										</div>
									</DialogContent>
								</Dialog>
							</>
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
