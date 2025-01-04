import { Middleware, Router } from 'npm:express';

import operators from './routes/operators.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use('/operators', operators(oapi));
	return router;
}
