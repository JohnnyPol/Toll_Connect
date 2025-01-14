import { useState } from 'react';
import {
	APIProvider,
	ControlPosition,
	Map,
	MapCameraChangedEvent,
	MapControl,
} from '@vis.gl/react-google-maps';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FilterIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import DateRangeForm, {
	DateRangeFormData,
} from '@/components/date-range-form.tsx';

export default function AnonymousMapPage() {
	const [formData, setFormData] = useState<DateRangeFormData>({
		startDate: undefined,
		endDate: undefined,
	});

	const handleFormSubmit = (data: DateRangeFormData) => {
		console.log('Form submitted:', data);
		// Handle form submission
		// Optionally close the sheet here
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
					onCameraChanged={(
						ev: MapCameraChangedEvent,
					) =>
						console.log(
							'camera changed:',
							ev.detail.center,
							'zoom:',
							ev.detail.zoom,
						)}
					disableDefaultUI
					reuseMaps={true}
				>
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
