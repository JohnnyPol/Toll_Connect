import { model, Schema } from 'npm:mongoose';

const passSchema = new Schema({
  tagRef: {type: Schema.Types.ObjectId, ref: 'Tag', required: true},
  tollRef: {type: Schema.Types.ObjectId, ref: 'Tag', required: true},
  time: {type: Date, required: true},
  charge: {type: Number, min: 0, required: true}
});

export default model('Pass', passSchema, 'pass');
