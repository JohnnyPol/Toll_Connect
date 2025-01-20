import { useEffect, useState } from 'react';
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
import { useTolls } from '@/hooks/use-tolls.ts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { TollMap, Toll } from '@/types/tolls.ts';

import { tollService } from '@/api/services/tolls.ts';

export default function AnonymousMapPage() {
	const [formData, setFormData] = useState<DateRangeFormData>({
		startDate: new Date().setDate(new Date().getDate() - 30),
		endDate: new Date(),
		selectedOperatorIds: [],
	});

	const { tollState, fetchTollsForAllOperators } = useTolls();

	const [selectedToll, setSelectedToll] = useState<TollMap['_id'] | null>(null);
	
	const [tollData, setTollData] = useState<Toll>([]);

	const fetchToll = async (id: TollMap['_id']): Promise<void> => {
		const data = await tollService.getById(id);
		setTollData(data);
	};

	useEffect(() => {
		fetchToll(selectedToll);
	}, [selectedToll]);

	const handleFormSubmit = (data: DateRangeFormData) => {
		console.log('Form submitted:', data);
		fetchTollsForAllOperators(formData.selectedOperatorIds);
	};

	return (
		<>
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
					{formData.selectedOperatorIds.map((id) => {
						const operatorTollState = tollState[id] || {
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

								{operatorTollState.error && (
									<Alert>
										<AlertTitle>Oops!</AlertTitle>
										<AlertDescription>
											<div className='text-red-500'>
												Error loading tolls: {operatorTollState.error}
											</div>
										</AlertDescription>
									</Alert>
								)}

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
											<Input id='operator' value={tollData.operator_name} disabled />
											<Label htmlFor='avg-passes'>Average Passes</Label>
											<Input id='avg-passes' value={tollData.avg_passes} disabled />
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
						<Sheet>
							<SheetTrigger asChild>
								<div className='pt-3'>
									<Button variant='outline'>
										<FilterIcon className='mr-2 h-4 w-4' />
										Filters
									</Button>
								</div>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>
										Filter Options
									</SheetTitle>
									<SheetDescription>
										Set your preferences for the statistics date range and the
										desired operators.
									</SheetDescription>
								</SheetHeader>
								<ScrollArea className='w-full h-[calc(100%-4rem)] p-4'>
									<DateRangeForm
										formData={formData}
										onFormDataChange={setFormData}
										onSubmit={handleFormSubmit}
									/>
								</ScrollArea>
							</SheetContent>
						</Sheet>
					</MapControl>
				</Map>
			</APIProvider>
		</>
	);
}
