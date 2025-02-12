import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType } from '../../util.ts';
import Toll from '../../../models/toll.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	/**
	 * GET /tolls
	 * Retrieves all toll documents
	 */
	router.get('/', async (_req: Request, res: Response) => {
		try {
			const tolls = await Toll.find();
			res.status(200).json(tolls);
		} catch (error) {
			console.error('Error fetching tolls:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /tolls/:id
	 * Retrieves a specific toll document by its ID
	 */
	router.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const toll = await Toll.findById(id);
			if (!toll) return die(res, ErrorType.BadRequest, 'Toll not found');

			res.status(200).json(toll);
		} catch (error) {
			console.error('Error fetching toll:', error);
			die(res, ErrorType.Internal, error);
		}
	});
	/**
	 * GET /tolls/by_operator/:operator_id
	 * Retrieves all tolls associated with a specific toll operator
	 */
	router.get(
		'/by_operator/:operator_id',
		async (req: Request, res: Response) => {
			const { operator_id } = req.params;

			try {
				const tolls = await Toll.find({ tollOperator: operator_id })
					.select('_id name latitude longitude')
					;

				if (!tolls.length) {
					return die(
						res,
						ErrorType.BadRequest,
						'No tolls found for the given operator',
					);
				}

				res.status(200).json(tolls);
			} catch (error) {
				console.error('Error fetching tolls by operator:', error);
				die(res, ErrorType.Internal, error);
			}
		},
	);

	return router;
}
