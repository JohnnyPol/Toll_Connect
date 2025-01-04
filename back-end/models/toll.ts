import { Schema, model } from 'npm:mongoose';
import { require, trim, unique, range, precision, idtype } from './util.ts'

import TollOperator from './toll_operator.ts';
import Road         from './road.ts';

const tollSchema = new Schema({
	_id: trim(unique(require(String))),
	name: trim(unique(require(String))),
	latitude: { ...require(Number), validate: range('Latitude', -90, 90) },
	longitude: {
		...require(Number), validate: range('Longitude', -180, 180)
	},
	locality: trim(require(String)),
	price1: { ...require(Number), validate: [ range('Price 1', 0), precision('Price 1', 2) ] },
	price2: { ...require(Number), validate: [ range('Price 2', 0), precision('Price 2', 2) ] },
	price3: { ...require(Number), validate: [ range('Price 3', 0), precision('Price 3', 2) ] },
	price4: { ...require(Number), validate: [ range('Price 4', 0), precision('Price 4', 2) ] },
	PM: {
		...require(String), enum: ['ΠΛ', 'ΜΤ'],
	},
	tollOperator: require(idtype(TollOperator), 'Toll Operator'),
	road: require(idtype(Road), 'Road'),  
});

tollSchema.virtual('county').get(function () : string {
	if (this.locality === null || this.locality === undefined)
		return ''; // necessary for type-checking
	return this.locality.split('-')[0];
});

export default model('Toll', tollSchema, 'toll');
