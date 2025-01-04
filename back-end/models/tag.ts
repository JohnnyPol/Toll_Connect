import { model, Schema } from 'npm:mongoose';
import { require, trim, unique, idtype } from './util.ts';

import TollOperator from './toll_operator.ts';

const tagSchema = new Schema({
	_id: unique(trim(require(String))),
	tollOperator: require(idtype(TollOperator), 'Toll Operator')
});

export default model('Tag', tagSchema, 'tag');
