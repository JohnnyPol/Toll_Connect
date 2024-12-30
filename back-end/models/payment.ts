import { model, Schema } from 'npm:mongoose';
import { require, range, precision } from './util.ts';

const paymentSchema = new Schema({
	payerRef: require(Schema.Types.ObjectId, 'Toll Operator'),
	payeeRef: require(Schema.Types.ObjectId, 'Toll Operator'),
	dateofCharge: require(Date),
	amount: {
		...require(Number),
		validate: [ range('Amount', 0), precision('Amount', 2) ]
	},
	dateofPayment: { 
		type: Date, 
		default: new Date(0) // Default to epoch time
	},
	dateofValidation: { 
		type: Date, 
		default: new Date(0) // Default to or epoch time
	}
});

export default model('Payment', paymentSchema, 'payment');
