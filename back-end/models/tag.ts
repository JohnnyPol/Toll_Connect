import { model, Schema } from 'npm:mongoose';
import { idtype, require, trim, unique } from './util.ts';

import TollOperator, {TollOperatorDocument} from './toll_operator.ts';
import { Document } from 'mongoose';

export interface TagDocument extends Document {
	_id: string;
	tollOperator?: TollOperatorDocument['_id'];
}

const tagSchema = new Schema<TagDocument>({
	_id: unique(trim(require(String))),
	tollOperator: require(idtype(TollOperator), 'Toll Operator'),
});

export default model<TagDocument>('Tag', tagSchema, 'tag');
