import { NextFunction, Router } from 'express';

import authenticate from '@/authentication/middleware.ts';
import parser from '@/api/parser.ts';

import admin from '@/api/routes/admin.ts';
import charges_by from '@/api/routes/charges_by.ts';
import login from '@/authentication/login.ts';
import operators from '@/api/routes/operators.ts';
import pass_analysis from '@/api/routes/pass_analysis.ts';
import passes_cost from '@/api/routes/passes_cost.ts';
import payments from '@/api/routes/payments.ts';
import statistics from '@/api/routes/statistics.ts';
import toll_passes from '@/api/routes/toll_station_passes.ts';
/* CRUD API */
import tolls from '@/api/routes/db/tolls.ts';
import pass from '@/api/routes/db/pass.ts';
import payment from '@/api/routes/db/payment.ts';
import road from '@/api/routes/db/road.ts';
import tag from '@/api/routes/db/tag.ts';
import toll_operators from '@/api/routes/db/toll_operators.ts';

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
	router.use('/db/toll-operators', toll_operators(oapi));
	router.use('/db/tolls', tolls(oapi));
	router.use('/db/road', road(oapi));
	router.use('/db/pass', pass(oapi));
	router.use('/db/payment', payment(oapi));
	router.use('/db/tag', tag(oapi));

	return router;
}
