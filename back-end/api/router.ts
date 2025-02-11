import { NextFunction, Request, Response, Router } from 'express';
import { DataItem, stringify } from '@std/csv';

import { die, ErrorType } from '@/api/util.ts';
import authenticate from '@/authentication/middleware.ts';
import parser from '@/api/parser.ts';
import { UserLevel } from '@/models/toll_operator.ts';

import admin from './routes/admin.ts';
import charges_by from './routes/charges_by.ts';
import login from '../authentication/login.ts';
import operators from './routes/operators.ts';
import pass_analysis from './routes/pass_analysis.ts';
import passes_cost from './routes/passes_cost.ts';
import payments from './routes/payments.ts';
import statistics from './routes/statistics.ts';
import toll_passes from './routes/toll_station_passes.ts';
/* CRUD API */
import tolls from './routes/db/tolls.ts';
import pass from './routes/db/pass.ts';
import payment from './routes/db/payment.ts';
import road from './routes/db/road.ts';
import tag from './routes/db/tag.ts';
import toll_operators from './routes/db/toll_operators.ts';

export default function (oapi: NextFunction): Router {
	const router = new Router();

	router.use(parser);
	router.use(authenticate);
	// router.use((req, res, next) => {
		// req.user = { id: 'AM', level: UserLevel.Admin };
		// next();
	// })

	router.use('/', login(oapi));
	router.use('/admin', admin(oapi));
	router.use('/chargesBy', charges_by(oapi));
	router.use('/operators', operators(oapi));
	router.use('/passAnalysis', pass_analysis(oapi));
	router.use('/passesCost', passes_cost(oapi));
	router.use('/payments', payments(oapi));
	router.use('/statistics', statistics(oapi));
	router.use('/tollStationPasses', toll_passes(oapi));
	/* CRUD API */
	router.use('/db/tolls', tolls(oapi));
	router.use('/db/pass', pass(oapi));
	router.use('/db/payment', payment(oapi));
	router.use('/db/road', road(oapi));
	router.use('/db/tag', tag(oapi));
	router.use('/db/toll-operators', toll_operators(oapi));

	return router;
}
