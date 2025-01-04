import { model, Schema } from 'npm:mongoose';
import { idtype, precision, range, require } from './util.ts';

import TollOperator from './toll_operator.ts';

const paymentSchema = new Schema({
	payer: require(idtype(TollOperator), 'Toll Operator'),
	payee: require(idtype(TollOperator), 'Toll Operator'),
	dateofCharge: require(Date),
	amount: {
		...require(Number),
		validate: [range('Amount', 0), precision('Amount', 2)],
	},
	dateofPayment: {
		type: Date,
		default: new Date(0), // Default to epoch time
	},
	dateofValidation: {
		type: Date,
		default: new Date(0), // Default to or epoch time
	},
});

export default model('Payment', paymentSchema, 'payment');
