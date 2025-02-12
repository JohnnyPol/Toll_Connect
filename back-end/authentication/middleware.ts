import { NextFunction, Request, Response, Middleware } from 'express';
import { Token, verify } from '@/authentication/jwt.ts';
import { die, ErrorType } from '@/api/util.ts';
import { UserLevel } from '@/models/toll_operator.ts';

const ANON: Token = { level: UserLevel.Anonymous, id: '', exp: -1 };

export default async function (
	req: Request,
	res: Response,
	next: NextFunction,
) : Middleware {
	const token: string | undefined = req.get('x-observatory-auth');

	if (token == null) {
		req.user = ANON;
		console.log('INFO anonymous token:', req.user);
		return next();
	}

	try {
		req.user = await verify(token);
		console.log('INFO token verified:', req.user);
		return next();
	} catch (err) {
		console.error('ERR in token verification', err);
		return die(res, ErrorType.Unauthorized, err);
	}
}
