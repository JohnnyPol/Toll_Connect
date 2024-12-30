import { model, Schema } from 'npm:mongoose';
import { require, range, precision } from './util.ts';

const passSchema = new Schema({
	tagRef: require(Schema.Types.ObjectId, 'Tag'),
	tollRef: require(Schema.Types.ObjectId, 'Toll'),
	time: require(Date),
	charge: {
		...require(Number),
		validate: [ range('Charge', 0), precision('Charge', 2) ]
	},
});

export default model('Pass', passSchema, 'pass');
