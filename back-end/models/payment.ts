import { model, Schema, Document, Types } from 'npm:mongoose';
import { idtype, precision, range, require } from './util.ts';

import TollOperator, { TollOperatorDocument } from './toll_operator.ts';

export enum PaymentStatus {
	Created   = 0,
	Paid      = 1,
	Validated = 2,
};

export interface PaymentDocument extends Document {
	_id: Types.ObjectId;
	payer?: TollOperatorDocument['_id'];
	payee?: TollOperatorDocument['_id'];
	amount: number;
	dateofCharge: Date;
	dateofPayment: Date;
	dateofValidation: Date;
	status: PaymentStatus;
}

const paymentSchema = new Schema<PaymentDocument>({
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

paymentSchema.virtual('status').get(function () : PaymentStatus {
	const init = new Date(0);
	if (this.dateofPayment === init)
		return PaymentStatus.Created;
	else if (this.dateofValidation === init)
		return PaymentStatus.Paid;
	else
		return PaymentStatus.Validated;
});

export default model<PaymentDocument>('Payment', paymentSchema, 'payment');
