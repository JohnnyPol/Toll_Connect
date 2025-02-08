import { Middleware, Request, Response, Router } from 'npm:express';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:operator_id/:date_from/:date_to',
		(req: Request, res: Response) => {
		},
	);


	return router;
}
