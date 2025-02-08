import { Middleware, Router } from 'npm:express';

import admin         from './routes/admin.ts';
import charges_by    from './routes/charges_by.ts';
import operators     from './routes/operators.ts';
import pass_analysis from './routes/pass_analysis.ts';
import passes_cost   from './routes/passes_cost.ts';
import toll_passes   from './routes/toll_station_passes.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use('/admin', admin(oapi));
	router.use('/chargesBy', charges_by(oapi));
	router.use('/operators', operators(oapi));
	router.use('/passAnalysis', pass_analysis(oapi));
	router.use('/passesCost', passes_cost(oapi));
	router.use('/tollStationPasses', toll_passes(oapi));
	return router;
}
