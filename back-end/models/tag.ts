import { model, Schema } from 'npm:mongoose';
import { setRequired, TrimmedString, foreignKey} from './util.ts';
import tollOperator from './toll_operator.ts'

const tagSchema = new Schema({
    tagReference: { type: String, trimmed: true, unique: true },
    tollOperatorID: TrimmedString
});

setRequired(tagSchema, 'Tag');
foreignKey(tagSchema, 'Tag', 'tollOpeartorID', tollOperator, 'Toll Operator', 'name');

export default model('Tag', tagSchema, 'tag');