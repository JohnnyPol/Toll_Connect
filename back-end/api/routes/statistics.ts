import { Middleware, Request, Response, Router } from 'npm:express';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/heatmap',
		(req: Request, res: Response) => {
		},
	);

	router.get(
		'/toll/:toll_id/:start_date/:end_date',
		(req: Request, res: Response) => {
		},
	);

	return router;
}

