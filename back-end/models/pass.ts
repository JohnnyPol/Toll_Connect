import { model, Schema } from 'npm:mongoose';
import { idtype, precision, range, require } from './util.ts';

import Tag from './tag.ts';
import Toll from './toll.ts';
import Payment from './payment.ts'
import TollOperator from './toll_operator.ts';

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
	payment: {
		type: idtype(Payment),
		ref:'Payment'
	},
});

passSchema.index({tag:1, toll:1, time: 1}, {unique: true});


export default model('Pass', passSchema, 'pass');
