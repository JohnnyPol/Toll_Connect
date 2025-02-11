import { NextFunction, Request, Response } from 'express';
import { verify } from './jwt.ts'; // Import verify function from jwt.ts
import { Token } from '@/authentication/jwt.ts';
import { die, ErrorType } from '@/api/util.ts';
import { UserLevel } from '@/models/toll_operator.ts';

export default async function (
	req: Request,
	res: Response,
	next: NextFunction,
) : Middleware {
	const token: Token | undefined = req.get('x-observatory-auth');

	if (token == null) {
		req.user = <Token> { level: UserLevel.Anonymous, id: '', exp: -1 };
		console.log('INFO anonymous token:', req.user);
		return next();
	}

	try {
		req.user = await verify(token);
		console.log('INFO token verified:', req.user);
		return next();
	} catch (err) {
		console.error('ERR in token verification', err);
		return die(res, ErrorType.Unauthorized, 'error in token verification');
	}
}
