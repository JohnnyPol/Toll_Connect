import { NextFunction, Request, Response } from 'express';
import { die, ErrorType } from '@/api/util.ts';
import { stringify } from '@std/csv';

type Json = Record<string, unknown> | Record<string, unknown>[];

function check_empty(
	res: Response,
): (this: Response, json: Json) => Response | undefined {
	const original = res.json;
	return function (this, json) {
		if (res.status >= 400) {
			return res;
		}
		if (!(json instanceof Array) && Object.keys(json).length === 0) {
			return res.status(204).end();
		} else {
			return original.call(this, json);
		}
	};
}

function convert_csv(
	res: Response,
): (this: Response, json: Json) => Response | undefined {
	return function (this, json) {
		console.log('INFO: CSV middleware called');
		if (json === null) {
			return res.status(204).end();
		}
		const body = json instanceof Array ? json : [json];
		const columns = Object.keys(body[0]);
		const response = stringify(body, { columns });
		return res.status(200).type('text/plain').send(response);
	};
}

export default function (
	req: Request,
	res: Response,
	next: NextFunction,
): Response | undefined {
	if (req.query.format === undefined || req.query.format === 'json') {
		res.json = check_empty(res);
		return next && next();
	}
	if (req.query.format !== 'csv') {
		return die(res, ErrorType.BadRequest, 'Invalid format requested');
	}
	res.json = convert_csv;
	next && next();
}
