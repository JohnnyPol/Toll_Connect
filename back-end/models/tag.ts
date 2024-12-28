import { model, Schema } from 'npm:mongoose';

const tagSchema = new Schema({
    tagRef: {type: String, trimmed: true, unique: true, required: true},
    tollOperatorRef: {type: Schema.Types.ObjectId, ref: 'Toll Operator', required: true},
});

export default model('Tag', tagSchema, 'tag');