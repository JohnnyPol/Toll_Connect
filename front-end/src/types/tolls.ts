export interface TollMap {
	_id: string;
	name: string;
	latitude: number;
	longitude: number;
}

export interface Toll {
	_id: string;
	name: string;
	price: number;
	road: string;
	operator_name: string;
	avg_passes: number;
}

