export interface TollMarkerData {
	_id: string;
	name: string;
	latitude: number;
	longitude: number;
	icon?: string;
}

export interface Toll {
	_id: string;
	name: string;
	price: number;
	road: string;
	operator_name: string;
	avg_passes: number;
}
