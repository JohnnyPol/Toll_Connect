import { model, Schema, Document } from 'npm:mongoose';
import { precision, range, require, trim, unique } from './util.ts';

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export enum UserLevel {
	Anonymous = 0,
	Operator = 1,
	Admin = 2,
}

export interface TollOperatorDocument extends Document {
	_id: string;
	name: string;
	passwordHash: string;
	email: string;
	VAT: string;
	addressStreet: string;
	addressNumber: number;
	addressArea: string;
	addressZip: number;
	address: string;
};

const tollOperatorSchema = new Schema<TollOperatorDocument>({
	_id: unique(trim(require(String))), // username
	name: trim(require(String)),
	passwordHash: require(String),
	userLevel: {
		type: Number,
		enum: UserLevel
	}, 
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

export default model<TollOperatorDocument>('Toll Operator', tollOperatorSchema, 'tollOperator');
