import {
	create as djwt_create,
	getNumericDate,
	Header,
	Payload,
	verify as djwt_verify,
} from 'https://deno.land/x/djwt/mod.ts';
import { Types } from 'mongoose';
import { assert } from '@std/assert';

import TollOperator, {
	UserLevel,
	TollOperatorDocument,
} from '@/models/toll_operator.ts';

if (!Deno.env.has('JWT_ENCODE')) {
	console.error(
		`Missing encode string for JWT: Add JWT_ENCODE to .env file`,
	);
	Deno.exit(1);
}

const key: CryptoKey = await crypto.subtle.generateKey(
	{ name: 'HMAC', hash: 'SHA-512' },
	true,
	['sign', 'verify'],
);
const header: Header = { alg: 'HS512', type: 'JWT' };

export type Token = {
	level: UserLevel;
	id: TollOperatorDocument['_id'];
	exp: number;
};

async function create(obj: Omit<Token, 'exp'>): Promise<string> {
	const payload: Token = {
		...obj,
		exp: getNumericDate(60 * 60),
	};
	return await djwt_create(header, payload, key);
}

async function verify(str: string): Promise<Token> {
	const token: Token = await djwt_verify(str, key);
	const doc = await TollOperator.findById(token.id);
	if (doc == null) throw Error('could not find id in database');
	if (str in doc.blacklist) throw Error('blacklisted token');
	return token;
}

async function clearBlacklist(): Promise<void> {
	const docs = await TollOperator.find({ blacklist: { $gt: [] } });
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
