import { model, Schema, InferSchemaType } from 'npm:mongoose';
import { idtype, precision, range, require } from './util.ts';

import Tag from './tag.ts';
import Toll from './toll.ts';
import TollOperator from './toll_operator.ts'

const passSchema = new Schema({
	tag: {
		_id: require(idtype(Tag), 'Tag'),
		tollOperator: require(idtype(TollOperator), 'Toll Operator'),
	},
	toll: {
		_id: require(idtype(Toll), 'Toll'),
		tollOperator: require(idtype(TollOperator), 'Toll Operator'),
	},
	time: require(Date),
	charge: {
		...require(Number),
		validate: [range('Charge', 0), precision('Charge', 2)],
	},
});

export type passType = InferSchemaType<typeof passSchema>;

export default model('Pass', passSchema, 'pass');
