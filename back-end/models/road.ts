import { model, Schema, Document, Types } from 'npm:mongoose';
import { require, trim, unique } from './util.ts';

export interface RoadDocument extends Document {
	_id: Types.ObjectId;
	name: string;
};

const roadSchema = new Schema<RoadDocument>({
	name: unique(trim(require(String))),
});

export default model<RoadDocument>('Road', roadSchema, 'road');
