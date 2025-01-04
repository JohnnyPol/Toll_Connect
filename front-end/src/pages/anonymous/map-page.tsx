import {
	APIProvider,
	Map,
	MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

export default function AnonymousMapPage() {
	return (
		<APIProvider
			apiKey={"AIzaSyDAMNPvIOhRWOsnVi-xRUMTHW3RD8uFJcw"}
			onLoad={() => console.log("Maps API has loaded.")}
		>
			<Map
				defaultZoom={13}
				defaultCenter={{ lat: 37.98, lng: 23.78 }}
				onCameraChanged={(ev: MapCameraChangedEvent) =>
					console.log(
						"camera changed:",
						ev.detail.center,
						"zoom:",
						ev.detail.zoom,
					)}
			>
			</Map>
		</APIProvider>
	);
}
