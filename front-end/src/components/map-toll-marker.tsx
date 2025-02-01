import { AdvancedMarker, Marker, Pin } from '@vis.gl/react-google-maps';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { TollMarkerData } from '@/types/tolls.ts';
import { MapAnonymousTollPopup } from './map-anonymous-toll-popup.tsx';

interface MapTollMarkerProps {
	tollMarkerData: TollMarkerData;
	markerIcon?: string;
	children?: React.ReactNode;
}

export const MapTollMarker: React.FC<MapTollMarkerProps> = ({
	tollMarkerData,
	markerIcon,
	children,
}) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Marker
					position={{
						lat: tollMarkerData.latitude,
						lng: tollMarkerData.longitude,
					}}
					title={tollMarkerData.name}
					optimized
					icon={{
						url: markerIcon,
						scaledSize: new google.maps.Size(35, 35), // Set the size of the icon
					}}
				/>
			</DialogTrigger>
			<DialogContent className='w-full'>
				<DialogHeader>
					<DialogTitle>Toll Information</DialogTitle>
					<DialogDescription>
						Here you can see information about the selected toll.
					</DialogDescription>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
};
