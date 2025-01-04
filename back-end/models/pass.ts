import { model, Schema } from 'npm:mongoose';
import { require, range, precision, idtype } from './util.ts';

import Tag  from './tag.ts';
import Toll from './toll.ts';

const passSchema = new Schema({
	tag: require(idtype(Tag), 'Tag'),
	toll: require(idtype(Toll), 'Toll'),
	time: require(Date),
	charge: {
		...require(Number),
		validate: [ range('Charge', 0), precision('Charge', 2) ]
	},
});

export default model('Pass', passSchema, 'pass');
