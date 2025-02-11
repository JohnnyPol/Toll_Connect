import { model, Schema, Document } from 'npm:mongoose';
import { precision, range, require, trim, unique } from './util.ts';

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export enum UserLevel {
	Anonymous = 0,
	Operator = 1,
	Admin = 2,
}

export interface TollOperatorInput {
	_id: string;
	passwordHash: string;
	userLevel: UserLevel;
	name?: string;
	email?: string;
	VAT?: string;
	addressStreet?: string;
	addressNumber?: number;
	addressArea?: string;
	addressZip?: number;
};

export interface TollOperatorDocument extends Document {
	_id: string;
	name: string;
	passwordHash: string;
	userLevel: UserLevel;
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
	passwordHash: require(String),
	name: {
		...trim(require(String)),
		default: '',
	},
	userLevel: {
		type: Number,
		enum: UserLevel
	}, 
	email: {
		...trim(require(String)),
		default: 'default@test.com',
		validate: {
			validator: (mail: string) => emailRegex.test(mail),
			message: 'Email is of invalid format',
		},
	},
	VAT: { ...trim(require(String)), default: '' },
	addressStreet: { ...trim(require(String)), default: 'Default' },
	addressNumber: {
		...require(Number),
		default: 0,
		validate: [
			range('Address number', 0),
			precision('Address number', 0),
		],
	},
	addressArea: { ...trim(require(String)), default: '' },
	addressZip: {
		...require(Number),
		default: 99999,
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
