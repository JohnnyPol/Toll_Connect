import { model, Schema, Document, Types } from 'npm:mongoose';
import { idtype, precision, range, require } from './util.ts';

import Tag, { TagDocument } from './tag.ts';
import Toll, { TollDocument } from './toll.ts';
import TollOperator, { TollOperatorDocument } from './toll_operator.ts'
import Payment, {PaymentDocument} from './payment.ts'

export interface PassDocument extends Document {
	_id: Types.ObjectId;
	tag: {
		_id?: TagDocument['_id'];
		tollOperator?: string;
	};
	toll: {
		_id?: TollDocument['_id'];
		tollOperator?: TollOperatorDocument['_id'];
	};
	time: Date;
	charge: number;
	payment?: PaymentDocument['_id']; 
};

const passSchema = new Schema<PassDocument>({
	tag: {
		_id: require(idtype(Tag), 'Tag'),
		tollOperator: require(idtype(TollOperator), 'Toll Operator'),
	},
	toll: {
		_id: require(idtype(Toll), 'Toll'),
		tollOperator: require(idtype(TollOperator), 'Toll Operator'),
	},
	time: require(Date),
	charge: {
		...require(Number),
		validate: [range('Charge', 0), precision('Charge', 2)],
	},
	payment: {
		type: idtype(Payment),
		ref:'Payment'
	},
});

passSchema.index({tag:1, toll:1, time: 1}, {unique: true});


export default model<PassDocument>('Pass', passSchema, 'pass');
