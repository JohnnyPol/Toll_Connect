import { model, Schema } from 'npm:mongoose';
import { setRequired, checkNonNegative, TrimmedString, foreignKey} from './util.ts';
import tag from './tag.ts';
import toll from './toll.ts';

const passSchema = new Schema({
  passID: {type: Number, unique: true},
  tagReference: TrimmedString,
  tollID: TrimmedString,
  time: Date,
  charge: Number
});

setRequired(passSchema, 'Pass');
checkNonNegative(passSchema, 'Pass', 'charge');
foreignKey(passSchema, 'Pass', 'tagReference', tag, 'Tag', 'tagReference');
foreignKey(passSchema, 'Pass', 'tollID', toll, 'Toll', 'tollID');

export default model('Pass', passSchema, 'pass');
