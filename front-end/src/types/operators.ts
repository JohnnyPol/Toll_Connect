export interface Operator {
	_id: string;
	name: string;
	markerIcon?: string;
}

export interface HeatmapData {
	lat: number;
	lng: number;
	mag: number;
}
