import { model, Schema } from 'npm:mongoose';
import { checkNonNegative, setRequired, TrimmedString } from './util.ts';

const tollOperatorSchema = new Schema({
	name: { type: String, trimmed: true, unique: true },
	passwordHash: Number,
	email: TrimmedString,
	VAT: TrimmedString,
	addressStreet: TrimmedString,
	addressNumber: Number,
	addressArea: TrimmedString,
	addressZIP: Number
});

setRequired(tollOperatorSchema, 'Toll Operator');
tollOperatorSchema.path('email').validate(val => {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
}, 'Toll Operator: email is invalid');
checkNonNegative(tollOperatorSchema, 'Toll Operator', 'addressNumber')
tollOperatorSchema.path('addressZIP').validate(val => {
	return Number.isInteger(val) && val >= 10000 && val <= 99999; // Ensure it's a 5-digit integer
}, 'Toll Operator: ZIP code must be a 5-digit integer');
  

export default model('Toll Operator', tollOperatorSchema, 'tollOperator');
