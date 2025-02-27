import { DAY, format, MINUTE, parse } from '@std/datetime';
import { Request, Response, NextFunction } from 'express';
import { UserLevel } from '@/models/toll_operator.ts';

/**                       MONGOOSE CONNECTION ENUM                            */

export enum ConnectionStates {
	disconnected = 0,
	connected = 1,
	connecting = 2,
	disconnecting = 3,
	uninitialized = 99,
}

/**                         DATE CONVERSIONS                                  */

function set_date(date: Date): string {
	return format(date, 'yyyy-MM-dd HH:mm');
}

function get_date(date: string, get_end: boolean = false): Date {
	try {
		let res = parse(date, 'yyyyMMdd');
		res = new Date(res.getTime() - res.getTimezoneOffset() * MINUTE);
		if (get_end === true)
			return new Date(res.getTime() + DAY - 1);
		else
			return res;
	} catch (error) {
		console.error('Error parsing date:', error);
		return new Date(0);
	}
}

enum ErrorType {
	BadRequest = 400,
	Unauthorized = 401,
	Internal = 500,
}

function die(
	res: Response,
	type: ErrorType,
	msg: string | Error | unknown,
	extra: object = {},
): object {
	const json = msg instanceof Error
		? { status: 'failed', info: msg.message, ...extra }
		: typeof msg === 'string'
		? { status: 'failed', info: msg, ...extra }
		: { status: 'failed', info: 'unknown error', ...extra };
	res.status(type).json(json);
	return json;
}

function check_admin(req: Request, res: Response, next: NextFunction) {
	if (req.user == null || typeof req.user !== 'object' || req.user.level !== UserLevel.Admin) {
		return die(res, ErrorType.BadRequest, 'Admin level required');
	}
	return next();
};


export { die, ErrorType, get_date, set_date, check_admin };
