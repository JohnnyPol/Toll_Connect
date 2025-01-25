import { model, Schema } from 'npm:mongoose';
import { precision, range, require, trim, unique } from './util.ts';

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const tollOperatorSchema = new Schema({
	_id: unique(trim(require(String))),
	name: trim(require(String)), // TODO: Why unique?
	passwordHash: require(String),
	email: {
		...trim(require(String)),
		validate: {
			validator: (mail: string) => emailRegex.test(mail),
			message: 'Email is of invalid format',
		},
	},
	VAT: trim(require(String)),
	addressStreet: trim(require(String)),
	addressNumber: {
		...require(Number),
		validate: [
			range('Address number', 0),
			precision('Address number', 0),
		],
	},
	addressArea: trim(require(String)),
	addressZip: {
		...require(Number),
		validate: [
			range('Address ZIP', 10_000, 99_999),
			precision('Address ZIP', 0),
		],
	},
});

tollOperatorSchema.virtual('address').get(function (): string {
	return `${this.addressStreet} ${this.addressNumber}, ${this.addressArea} ${this.addressZip}`;
});

export default model('Toll Operator', tollOperatorSchema, 'tollOperator');
