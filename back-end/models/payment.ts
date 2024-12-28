import { model, Schema } from 'npm:mongoose';
import { TrimmedString, setRequired, checkNonNegative, foreignKey} from './util.ts';
import tollOperator from './toll_operator.ts'

const paymentSchema = new Schema({
  payerID: TrimmedString,
  payeeID: TrimmedString,
  dateofCharge: Date,
  amount: Number,
  dateofPayment: { 
    type: Date, 
    default: new Date(0) // Default to epoch time
  },
  dateofValidation: { 
    type: Date, 
    default: new Date(0) // Default to or epoch time
  }
});

setRequired(paymentSchema, 'Payment');
foreignKey(paymentSchema, 'Payment', 'payerID', tollOperator, 'Toll Operator', 'name');
foreignKey(paymentSchema, 'Payment', 'payeeID', tollOperator, 'Toll Operator', 'name');
checkNonNegative(paymentSchema, 'Payment', 'amount');

export default model('Payment', paymentSchema);
