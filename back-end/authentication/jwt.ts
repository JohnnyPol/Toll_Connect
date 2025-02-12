import {
	create as djwt_create,
	getNumericDate,
	Header,
	verify as djwt_verify,
} from 'https://deno.land/x/djwt/mod.ts';

import TollOperator, {
	TollOperatorDocument,
	UserLevel,
} from '@/models/toll_operator.ts';

if (!Deno.env.has('JWT_ENCODE')) {
	const encode = Array.from(
		crypto.getRandomValues(new Uint8Array(32)),
		(byte) => byte.toString(16).padStart(2, '0')
	).join();
	await Deno.writeTextFile('.env', `JWT_ENCODE=${encode}\n`, { append: true });
	console.error(
		`Missing encode string for JWT: Add JWT_ENCODE to .env file`,
	);
	Deno.exit(1);
}

if (!Deno.env.has('JWT_KEY')) {
	const key: CryptoKey = await crypto.subtle.generateKey(
		{ name: 'HMAC', hash: 'SHA-512' },
		true,
		['sign', 'verify'],
	);
	const bytes = btoa(String.fromCharCode(
		...new Uint8Array(
			await crypto.subtle.exportKey('raw', key),
		),
	));
	await Deno.writeTextFile('.env', `JWT_KEY=${bytes}\n`, { append: true });
	Deno.env.set('JWT_KEY', bytes);
}

const keyBytes = Uint8Array.from(
	atob(<string> Deno.env.get('JWT_KEY')),
	(c) => c.charCodeAt(0),
);
const key: CryptoKey = await crypto.subtle.importKey(
	'raw',
	keyBytes,
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
	try {
		const token: Token = await djwt_verify(str, key);
		const doc = await TollOperator.findById(token.id);
		if (doc == null) throw Error('could not find id in database');
		if (doc.blacklist.includes(str)) throw Error('blacklisted token');
		return token;
	} catch (err) {
		throw err;
	}
}

async function clearBlacklist(): Promise<void> {
	const docs = await TollOperator.find({ blacklist: { $gt: [] } });
	for (const doc of docs) {
		const now = new Date().getTime() / 1000;
		const tmp = await Promise.all(doc.blacklist.map(
			async (token: string) => {
				try {
					const { exp } = await verify(token);
					return exp > now ? token : null;
				} catch (err) {
					console.error('ERR clear blacklist:', err);
					return null;
				}
			}
		));
		doc.blacklist = tmp.filter((it) => it !== null);
	}
}

export { clearBlacklist, create, verify };
