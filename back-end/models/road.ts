import { model, Schema } from 'npm:mongoose';

const roadSchema = new Schema({
  roadName: { type: String, trimmed: true, unique: true, required: true}
});

export default model('Road', roadSchema, 'road');