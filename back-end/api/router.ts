import { Middleware, Request, Response, Router } from 'npm:express';
import { DataItem, stringify } from '@std/csv';
import { authenticateUser } from '@/authentication/authMiddlware.ts'; // Import authentication middleware
import { die, ErrorType } from '@/api/util.ts';

import admin from './routes/admin.ts';
import charges_by from './routes/charges_by.ts';
import login from '../authentication/login.ts';
import operators from './routes/operators.ts';
import pass_analysis from './routes/pass_analysis.ts';
import passes_cost from './routes/passes_cost.ts';
import payments from './routes/payments.ts';
import statistics from './routes/statistics.ts';
import toll_passes from './routes/toll_station_passes.ts';
import tolls from './routes/db/tolls.ts';
import pass from './routes/db/pass.ts';
import payment from './routes/db/payment.ts';
import road from './routes/db/road.ts';
import tag from './routes/db/tag.ts';
import toll_operators from './routes/db/toll_operators.ts';

function csv_parser (req: Request, res: Response, next: Middleware) {
		if (req.query.format === undefined || req.query.format === 'json') {
			const original = res.json;
			res.json = function (json: object | object[]) {
				if (res.status >= 400)
					return res;
				if (!(json instanceof Array) && Object.keys(json).length === 0)
					return res.status(204).end();
				else
					return original.call(this, json);
			}
			return next && next();
		}

		if (req.query.format !== 'csv') {
			return die(res, ErrorType.BadRequest, 'Invalid format requested');
		}

		res.json = function (json: object | object[]) {
			console.log('INFO: CSV middleware called');
			if (json === null)
				return res.status(204).end();
			const body: readonly DataItem[] = json instanceof Array ? json : [json];
			const columns = Object.keys(body[0]);
			const response = stringify(body, { columns });
			return res.status(200).type('text/plain').send(response);
		};

		next && next();
	}

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.use(csv_parser);

	// Public Routes (Login does not require authentication)
	router.use('/', login(oapi));

	// TODO: Remove the below comment
	// router.use(authenticateUser);

	// Protected Routes (Require authentication)
	router.use('/admin', admin(oapi));
	router.use('/chargesBy', charges_by(oapi));
	router.use('/operators', operators(oapi));
	router.use('/passAnalysis', pass_analysis(oapi));
	router.use('/passesCost', passes_cost(oapi));
	router.use('/payments', payments(oapi));
	router.use('/statistics', statistics(oapi));
	router.use('/tollStationPasses', toll_passes(oapi));
	router.use('/db/tolls', tolls(oapi));
	router.use('/db/pass', pass(oapi));
	router.use('/db/payment', payment(oapi));
	router.use('/db/road', road(oapi));
	router.use('/db/tag', tag(oapi));
	router.use('/db/toll-operators', toll_operators(oapi));

	return router;
}
