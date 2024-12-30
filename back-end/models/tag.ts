import { model, Schema } from 'npm:mongoose';
import { require, trim, unique } from './util.ts';

const tagSchema = new Schema({
	tagReg: unique(trim(require(String))),
	tollOperatorRef: require(Schema.Types.ObjectId, 'Toll Operator')
});

export default model('Tag', tagSchema, 'tag');
