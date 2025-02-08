import { Middleware, Router } from 'npm:express';

import admin from './routes/admin.ts';
import login from '../authentication/login.ts';
import operators from './routes/operators.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use('/', login(oapi));
	router.use('/operators', operators(oapi));
	router.use('/admin', admin(oapi));
	return router;
}
