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

export interface AllPassData {
	tollOperator: Operator['_id'];
	tagOperator: Operator['_id'];
	passes: number;
}