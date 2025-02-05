import { Middleware, Router } from 'npm:express';

import operators from './routes/operators.ts';

import admin from './routes/admin.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use('/operators', operators(oapi));
	router.use('/admin', admin(oapi));
	return router;
}
