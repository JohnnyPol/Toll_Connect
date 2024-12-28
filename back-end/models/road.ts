import { model, Schema } from 'npm:mongoose';
import { setRequired} from './util.ts';

const roadSchema = new Schema({
  roadName: { type: String, trimmed: true, unique: true }
});

setRequired(roadSchema, 'Road');

export default model('Road', roadSchema, 'road');