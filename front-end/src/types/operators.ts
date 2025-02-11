export interface Operator {
	_id: string;
	name: string;
	markerIcon?: string;
	chartColor?: string;
}

export interface HeatmapData {
	latitude: number;
	longitude: number;
	count: number;
}
