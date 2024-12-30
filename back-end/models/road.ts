import { model, Schema } from 'npm:mongoose';
import { require, trim, unique } from './util.ts';

const roadSchema = new Schema({
	roadName: unique(trim(require(String)))
});

export default model('Road', roadSchema, 'road');
