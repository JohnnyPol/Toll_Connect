import {
	create, verify, Header, Payload
} from 'https://deno.land/x/djwt/mod.ts';
import { Types } from 'npm:mongoose';
import { assert } from '@std/assert';

if (!Deno.env.has('JWT_ENCODE')) {
	console.error(`Missing encode string for JWT: Add JWT_ENCODE to .env file`);
	Deno.exit(2);
}

const key: CryptoKey = await crypto.subtle.generateKey(
	{ name: 'HMAC', hash: 'SHA-256' },
	true, ['sign', 'verify'],
);

export enum UserLevel {
	Anonymous,
	Operator,
	Admin,
}

export type Token = {
	level: UserLevel;
	id: Types.ObjectId;
};

export type ErrorToken = {
	msg: Error;
};

async function createJWT (payload: Token | ErrorToken) : Promise<string> {
	return await create({
		alg:'HS256', typ:'JWT', exp: getNumericDate(60 * 60)
	}, payload, key);
}

async function verifyJWT (token: string): Promise<Token | ErrorToken> {
	return await verify(token, key);
}

export { createJWT as create, verifyJWT as verify };
