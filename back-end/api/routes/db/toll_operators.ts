import { Middleware, Request, Response, Router } from 'express';
import { check_admin, die, ErrorType } from '@/api/util.ts';
import TollOperator, { UserLevel } from '@/models/toll_operator.ts';

export default function (_oapi: Middleware): Router {
	const router = new Router();

	/**
	 * GET /toll-operators
	 * Retrieves all toll operator documents
	 */
	router.get('/', async (_req: Request, res: Response) => {
		try {
			const tollOperators = await TollOperator.find({
				userLevel: UserLevel.Operator,
			});
			res.status(200).json(tollOperators);
		} catch (error) {
			console.error('Error fetching toll operators:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /toll-operators/:id
	 * Retrieves a specific toll operator document by its ID
	 */
	router.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const tollOperator = await TollOperator.findById(id);
			if (!tollOperator) {
				return die(
					res,
					ErrorType.BadRequest,
					'Toll Operator not found',
				);
			}

			res.status(200).json(tollOperator);
		} catch (error) {
			console.error('Error fetching toll operator:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /toll-operators/all
	 * Retrieves all toll operators
	 */
	router.get(
		'/admin/all',
		check_admin,
		async (_req: Request, res: Response) => {
			try {
				const tollOperators = await TollOperator.find();
				res.status(200).json(tollOperators.map((op) => op._id));
			} catch (error) {
				console.error('Error fetching toll operators:', error);
				die(res, ErrorType.Internal, error);
			}
		},
	);

	return router;
}
