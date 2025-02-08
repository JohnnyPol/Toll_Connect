import { format, parse } from 'jsr:@std/datetime';
import { Response } from 'npm:express';

/**                         DATE CONVERSIONS                                  */

function set_date (date: Date) : string {
	return format(date, 'yyyy-MM-DD HH:mm');
}

function get_date (date: string) : Date {
	return parse(date, 'yyyyMMDD');
}

enum ErrorType {
	BadRequest   = 400,
	Unauthorized = 401,
	Internal     = 500,
};

function
die (
	res: Response, type: ErrorType, msg: string, extra: object = {}
): void {
	return res.status(type).json({ error: msg, ...extra });
};

export { get_date, set_date, ErrorType, die };
