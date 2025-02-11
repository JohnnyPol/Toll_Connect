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
	blacklist: string[];
};

const tollOperatorSchema = new Schema<TollOperatorDocument>({
	/* Not default initializable */
	_id: unique(trim(require(String))), // username
	passwordHash: require(String),
	userLevel: {
		type: Number,
		enum: UserLevel
	},
	/* Default initializable */
	name: {
		type: String,
		trim: true,
		default: '',
	},
	email: {
		type: String,
		trim: true,
		default: 'default@test.com',
		validate: {
			validator: (mail: string) => emailRegex.test(mail),
			message: 'Email is of invalid format',
		},
	},
	VAT: { type: String, trim: true, default: '' },
	addressStreet: { type: String, trim: true, default: 'Default' },
	addressNumber: {
		type: Number,
		default: 0,
		validate: [
			range('Address number', 0),
			precision('Address number', 0),
		],
	},
	addressArea: { type: String, trim: true, default: '' },
	addressZip: {
		type: Number,
		default: 99999,
		validate: [
			range('Address ZIP', 10_000, 99_999),
			precision('Address ZIP', 0),
		],
	},
	blacklist: {
		type: [String],
		default: [],
	}
});

tollOperatorSchema.virtual('address').get(function (): string {
	return `${this.addressStreet} ${this.addressNumber}, ${this.addressArea} ${this.addressZip}`;
});

export default model<TollOperatorDocument>('Toll Operator', tollOperatorSchema, 'tollOperator');
