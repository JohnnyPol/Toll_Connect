import { model, Schema } from 'npm:mongoose';
import { TrimmedString } from './util.ts';

const tollOperatorSchema = new Schema({
	name: { type: String, trimmed: true, unique: true },
	passwordHash: {type: Number, required: true},
	email: TrimmedString,
	VAT: TrimmedString,
	addressStreet: TrimmedString,
	addressNumber: {type: Number, min: 0, required: true},
	addressArea: TrimmedString,
	addressZIP: {type: Number, min: 10000, max: 99999, required: true} 
});

tollOperatorSchema.path('email').validate(val => {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
}, 'Toll Operator: email is invalid');
tollOperatorSchema.path('addressZIP').validate(val => {
	return Number.isInteger(val);
}, 'Toll Operator: ZIP code must be an integer');
  

export default model('Toll Operator', tollOperatorSchema, 'tollOperator');
