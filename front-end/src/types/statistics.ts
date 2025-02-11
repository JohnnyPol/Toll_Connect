import { Operator } from '@/types/operators.ts';

export interface TimeseriesPassData {
	date: string;
	operators: {
		operator: Operator['_id'];
		passes: number;
		cost: number;
	}[];
}

export interface AggregatePassData {
	_id: Operator['_id'];
	passes: number;
}
