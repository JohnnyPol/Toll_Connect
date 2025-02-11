import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType } from '../../util.ts';
import Pass from '../../../models/pass.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	/**
	 * GET /pass
	 * Retrieves all pass documents
	 */
	router.get('/', async (req: Request, res: Response) => {
		try {
			const passes = await Pass.find().populate(['tag', 'toll']).lean();
			res.status(200).json(passes);
		} catch (error) {
			console.error('Error fetching passes:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /pass/:id
	 * Retrieves a specific pass document by its ID
	 */
	router.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const pass = await Pass.findById(id).populate(['tag', 'toll']);
			if (!pass) return die(res, ErrorType.BadRequest, 'Pass not found');

			res.status(200).json(pass);
		} catch (error) {
			console.error('Error fetching pass:', error);
			die(res, ErrorType.Internal, 'Error fetching pass');
		}
	});

	return router;
}
