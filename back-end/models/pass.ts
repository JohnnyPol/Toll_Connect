import { model, Schema } from 'npm:mongoose';
import { idtype, precision, range, require } from './util.ts';

import Tag from './tag.ts';
import Toll from './toll.ts';

const passSchema = new Schema({
	tag: require(idtype(Tag), 'Tag'),
	toll: require(idtype(Toll), 'Toll'),
	time: require(Date),
	charge: {
		...require(Number),
		validate: [range('Charge', 0), precision('Charge', 2)],
	},
});

passSchema.statics.getAveragePasses = async function (tollId: string) {
	const passes = await this.find({ toll: tollId });
	return passes.length;
};

export default model('Pass', passSchema, 'pass');
