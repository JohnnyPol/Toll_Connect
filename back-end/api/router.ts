import { Middleware, Router } from 'npm:express';
import { authenticateUser } from "../authentication/authMiddlware.ts"; // Import authentication middleware

import admin from './routes/admin.ts';
import charges_by from './routes/charges_by.ts';
import login from '../authentication/login.ts';
import operators from './routes/operators.ts';
import pass_analysis from './routes/pass_analysis.ts';
import passes_cost from './routes/passes_cost.ts';
import payments from './routes/payments.ts';
import statistics from './routes/statistics.ts';
import toll_passes from './routes/toll_station_passes.ts';
import tolls         from './routes/db/tolls.ts';
import pass          from './routes/db/pass.ts';
import payment       from './routes/db/payment.ts';
import road          from './routes/db/road.ts';
import tag           from './routes/db/tag.ts';
import toll_operator from './routes/db/toll_operator.ts';


export default function (oapi: Middleware): Router {
	const router = new Router();

	// Public Routes (Login does not require authentication)
	router.use("/", login(oapi));

	// router.use(authenticateUser);
	// Protected Routes (Require authentication)
	router.use("/admin", admin(oapi));
	router.use("/chargesBy", charges_by(oapi));
	router.use("/operators", operators(oapi));
	router.use("/passAnalysis", pass_analysis(oapi));
	router.use("/passesCost", passes_cost(oapi));
	router.use('/payments', payments(oapi));
	router.use("/statistics", statistics(oapi));
	router.use("/tollStationPasses", toll_passes(oapi));
	router.use("/db/tolls", tolls(oapi));
	router.use("/db/pass", pass(oapi));
	router.use("/db/payment", payment(oapi));
	router.use("/db/road", road(oapi));
	router.use("/db/tag", tag(oapi));
	router.use("/db/toll_operator", toll_operator(oapi));



	return router;
}
