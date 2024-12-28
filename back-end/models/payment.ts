import { model, Schema } from 'npm:mongoose';

const paymentSchema = new Schema({
  payerRef: {type: Schema.Types.ObjectId, ref: 'Toll Operator', required: true},
  payeeRef: {type: Schema.Types.ObjectId, ref: 'Toll Operator', required: true},
  dateofCharge: {type: Date, required: true},
  amount: {type: Number, min: 0, required: true},
  dateofPayment: { 
    type: Date, 
    default: new Date(0) // Default to epoch time
  },
  dateofValidation: { 
    type: Date, 
    default: new Date(0) // Default to or epoch time
  }
});

export default model('Payment', paymentSchema);
