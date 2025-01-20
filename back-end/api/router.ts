import { Middleware, Router } from 'npm:express';

import operators from './routes/operators.ts';
import tolls from './routes/tolls.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use('/operators', operators(oapi));
	router.use('/tolls', tolls(oapi));
	return router;
}
