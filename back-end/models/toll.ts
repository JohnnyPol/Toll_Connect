import { model, Schema } from 'npm:mongoose';

const tollSchema = new Schema({
  tollRef: { type: String, trimmed: true, unique: true, required: true},
  latitude: {type: Number, min: -90, max: 90, required: true},
  longtitude: {type: Number, min: -180, max: 180, required: true},
  price1: {type: Number, min: 0, required: true},
  price2: {type: Number, min: 0, required: true},
  price3: {type: Number, min: 0, required: true},
  price4: {type: Number, min: 0, required: true},
  tollOperatorRef: {type: Schema.Types.ObjectId, ref: 'Toll Operator', required: true},
  roadName: {type: Schema.Types.ObjectId, ref: 'Road', required: true},
});

export default model('Toll', tollSchema, 'toll');