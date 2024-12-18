import { model, Schema } from 'npm:mongoose';
import { setRequired, TrimmedString } from './util.ts';

const tollOperatorSchema = new Schema({
	name: TrimmedString,
	passwordHash: Number,
	email: TrimmedString,
	VAT: TrimmedString,
	address: TrimmedString,
});

setRequired(tollOperatorSchema, 'Toll Operator');
tollOperatorSchema.path('email').validate(val => {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
}, 'Toll Operator: email is invalid');

export default model('Toll Operator', tollOperatorSchema);
