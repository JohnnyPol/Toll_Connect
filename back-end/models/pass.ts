import { model, Schema } from 'npm:mongoose';
import { idtype, precision, range, require } from './util.ts';

import Tag from './tag.ts';
import Toll from './toll.ts';
import Payment from './payment.ts'

const passSchema = new Schema({
	tag: require(idtype(Tag), 'Tag'),
	toll: require(idtype(Toll), 'Toll'),
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
