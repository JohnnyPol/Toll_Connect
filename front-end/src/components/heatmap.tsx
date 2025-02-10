import { useEffect, useMemo } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useHeatmapData } from '@/hooks/use-heatmap-data.ts';
import { toast } from 'sonner';

type HeatmapProps = {
	radius: number;
	opacity: number;
};

const Heatmap: React.FC<HeatmapProps> = ({ radius, opacity }) => {
	const map = useMap();
	const visualization = useMapsLibrary('visualization');

	const heatmap = useMemo(() => {
		if (!visualization) return null;

		return new google.maps.visualization.HeatmapLayer({
			radius: radius,
			opacity: opacity,
		});
	}, [visualization, radius, opacity]);

	const { data, loading, error } = useHeatmapData();

	if (loading) {
		toast.loading('Loading heatmap data...', {
			id: 'heatmap-loading',
		});
	} else {
		setTimeout(() => {
			toast.dismiss('heatmap-loading');
		}, 10);
	}

	if (error) {
		toast.error('Error loading heatmap data: ' + error, {
			id: 'heatmap-error'
		});
	}

	useEffect(() => {
		if (!heatmap) return;
		if (loading || error) return;

		heatmap.setData(
			data.map((point) => {
				return {
					location: new google.maps.LatLng(point.latitude, point.longitude),
					weight: point.count,
				};
			}),
		);
	}, [heatmap, data, radius, opacity]);

	useEffect(() => {
		if (!heatmap) return;

		heatmap.setMap(map);

		return () => {
			heatmap.setMap(null);
		};
	}, [heatmap, map]);

	return null;
};

export default Heatmap;
