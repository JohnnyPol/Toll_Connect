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

const flatten = (obj: any, prefix = ''): Record<string, any> => {
	return Object.keys(obj).reduce((acc: Record<string, any>, k: string) => {
		const pre = prefix.length ? prefix + '_' : '';
		if (
			typeof obj[k] === 'object' && obj[k] !== null &&
			!Array.isArray(obj[k])
		) {
			Object.assign(acc, flatten(obj[k], pre + k));
		} else {
			acc[pre + k] = obj[k];
		}
		return acc;
	}, {});
};

function expandArrays(obj: Record<string, any>): Record<string, any>[] {
	const arrayProps = Object.entries(obj).filter(([_, v]) => Array.isArray(v));
	if (arrayProps.length === 0) return [obj];

	const [[key, arr]] = arrayProps;
	const rest = { ...obj };
	delete rest[key];

	if (arr.length === 0) {
    return [rest];
  }

	return arr.flatMap((item) => {
		const flattenedItem = flatten(item);
		const newObj = { ...rest };
		// Add flattened array item properties with array key prefix
		Object.entries(flattenedItem).forEach(([k, v]) => {
			newObj[`${k}`] = v;
		});
		return expandArrays(newObj);
	});
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
	console.log('INFO: CSV middleware activated');
	res.json = function (data) {
		console.log('INFO: CSV middleware called');
		data = JSON.parse(JSON.stringify(data));
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
		if (data === null) {
			return res.status(204).end();
		}
		try {
			const body = data instanceof Array
				? data.flatMap((item) => expandArrays(flatten(item)))
				: expandArrays(flatten(data));

			const columns = Object.keys(body[0]);
			const response = stringify(body, { columns });
			res.status(200).send(response);
		} catch (error) {
			die(res, ErrorType.Internal, error);
		}
	};
	next && next();
}
