import { Middleware, Request, Response, Router } from 'npm:express';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:status/:date_from/:date_to',
		/*
		 * Query: page_size, page_number, target_op_id?, is_payer?
		 * Return: {
		 *     total_pages: number, results: Payment[]
		 * }, reverse time sorting
		 *
		 * Notes:
		 *   - If status == Validated, disregard is_payer
		 *   - If Admin, disregard is_payer and sent everything
		 */
		(req: Request, res: Response) => {},
	);

	router.put(
		'/pay/:id',
		(req: Request, res: Response) => {},
	);

	router.put(
		'/validate/:id',
		(req: Request, res: Response) => {},
	);

	return router;
}

