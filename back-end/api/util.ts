import { format, parse } from '@std/datetime';
import { Response } from 'express';

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

function get_date(date: string): Date {
	try {
		return parse(date, 'yyyyMMdd');
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
		: msg instanceof String
		? { status: 'failet', info: msg, ...extra }
		: { status: 'failed', info: 'internal error', ...extra };
	res.status(type).json(json);
	return json;
}

export { die, ErrorType, get_date, set_date };
