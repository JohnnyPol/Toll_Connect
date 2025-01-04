import {
	create as djwt_create,
	getNumericDate,
	Header,
	Payload,
	verify as djwt_verify,
} from 'https://deno.land/x/djwt/mod.ts';
import { Types } from 'npm:mongoose';
import { assert } from '@std/assert';

import TollOperator from '../models/toll_operator.ts';

if (!Deno.env.has('JWT_ENCODE')) {
	console.error(
		`Missing encode string for JWT: Add JWT_ENCODE to .env file`,
	);
	Deno.exit(2);
}

const key: CryptoKey = await crypto.subtle.generateKey(
	{ name: 'HMAC', hash: 'SHA-512' },
	true,
	['sign', 'verify'],
);
const header: Header = { alg: 'HS512', type: 'JWT' };

export enum UserLevel {
	Anonymous,
	Operator,
	Admin,
}

export type Token = {
	level: UserLevel;
	name: string;
	exp: number;
};

async function create(obj: Omit<Token, 'exp'>): Promise<string> {
	const payload: Token = {
		...obj,
		exp: getNumericDate(60 * 60),
	};
	return await djwt_create(header, payload, key);
}

async function verify(token: string): Promise<Token> {
	return await djwt_verify(token, key);
}

async function clearBlacklist(): Promise<void> {
	const docs = await TollOperator.find({ blacklist: { $gt: [] } }).exec();
	for (const doc of docs) {
		const now = new Date().getTime();
		doc.blacklist.filter(async (token: string) => {
			try {
				const { exp } = await verify(token);
				return exp > now;
			} catch (err) {
				return false;
			}
		});
		await doc.save();
	}
}

export { clearBlacklist, create, verify };
