import { Operator } from '@/types/operators.ts';

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
	price: number[];
	road: {
		name: string;
	};
	tollOperator: Operator['_id'];
}

export interface TollStatistics {
	toll: Toll;
	avg_passes: number;
	my_passes?: number;
	operators?: {
		operator: Operator['_id'];	
		passes: number;
	}[];
}
