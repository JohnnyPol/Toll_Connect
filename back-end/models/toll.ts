import { model, Schema } from 'npm:mongoose';
import { idtype, precision, range, require, trim, unique } from './util.ts';

import TollOperator from './toll_operator.ts';
import Road from './road.ts';

const tollSchema = new Schema({
	_id: trim(unique(require(String))),
	name: trim(unique(require(String))),
	latitude: { ...require(Number), validate: range('Latitude', -90, 90) },
	longitude: {
		...require(Number),
		validate: range('Longitude', -180, 180),
	},
	locality: trim(require(String)),
	price: {
		type: [{
			...require(Number),
			validate: [range('Price', 0), precision('Price', 2)],
		}],
		validate: {
			validator: (arr: number[]) => arr.length === 4,
			message: 'there must be exactly 4 prices',
		},
	},
	PM: {
		...require(String),
		enum: ['ΠΛ', 'ΜΤ'],
	},
	tollOperator: require(idtype(TollOperator), 'Toll Operator'),
	road: require(idtype(Road), 'Road'),
});

tollSchema.virtual('county').get(function (): string {
	if (this.locality === null || this.locality === undefined) {
		return ''; // necessary for type-checking
	}
	return this.locality.split('-')[0];
});

export default model('Toll', tollSchema, 'toll');
