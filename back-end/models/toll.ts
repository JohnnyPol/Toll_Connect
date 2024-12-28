import { model, Schema } from 'npm:mongoose';
import { setRequired, checkNonNegative, TrimmedString, foreignKey } from './util.ts';
import tollOperator from './toll_operator.ts';
import road from './road.ts';

const tollSchema = new Schema({
  tollID: { type: String, trimmed: true, unique: true },
  latitude: Number,
  longtitude: Number,
  price1: Number,
  price2: Number,
  price3: Number,
  price4: Number,
  tollOperatorID: TrimmedString,
  roadName: TrimmedString
});

setRequired(tollSchema, 'Toll');
tollSchema.path('latitude').validate((val) => {
    return val >= -90 && val <= 90; // Latitude must be within -90 to 90
}, 'Toll: Latitude must be between -90 and 90');  
tollSchema.path('longtitude').validate((val) => {
    return val >= -180 && val <= 180; // Longitude must be within -180 to 180
}, 'Toll: Longitude must be between -180 and 180');
checkNonNegative(tollSchema, 'Toll', 'price1');
checkNonNegative(tollSchema, 'Toll', 'price2');
checkNonNegative(tollSchema, 'Toll', 'price3');
checkNonNegative(tollSchema, 'Toll', 'price4');
foreignKey(tollSchema, 'Toll', 'tollOperatorID', tollOperator, 'Toll Operator', 'name');
foreignKey(tollSchema, 'Toll', 'roadName', road, 'Road', 'roadName');

  

export default model('Toll', tollSchema, 'toll');