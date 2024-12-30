import { model, Schema } from 'npm:mongoose';
import { require, trim, unique, range, precision } from './util.ts'

const tollSchema = new Schema({
	tollRef: trim(unique(require(String))),
	latitude: { ...require(Number), validate: range('Latitude', -90, 90) },
	longitude: {
		...require(Number), validate: range('Longitude', -180, 180)
	},
	price1: { ...require(Number), validate: [ range('Price 1', 0), precision('Price 1', 2) ] },
	price2: { ...require(Number), validate: [ range('Price 2', 0), precision('Price 2', 2) ] },
	price3: { ...require(Number), validate: [ range('Price 3', 0), precision('Price 3', 2) ] },
	price4: { ...require(Number), validate: [ range('Price 4', 0), precision('Price 4', 2) ] },
	tollOperatorRef: require(Schema.Types.ObjectId, 'Toll Operator'),
	roadName: require(Schema.Types.ObjectId, 'Road')
});

export default model('Toll', tollSchema, 'toll');
