import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType } from '../../util.ts';
import Tag from '../../../models/tag.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	/**
	 * GET /tag
	 * Retrieves all tag documents
	 */
	router.get('/', async (req: Request, res: Response) => {
		try {
			const tags = await Tag.find().populate('tollOperator').lean();
			res.status(200).json(tags);
		} catch (error) {
			console.error('Error fetching tags:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /tag/:id
	 * Retrieves a specific tag document by its ID
	 */
	router.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const tag = await Tag.findById(id).populate('tollOperator').lean();
			if (!tag) return die(res, ErrorType.BadRequest, 'Tag not found');

			res.status(200).json(tag);
		} catch (error) {
			console.error('Error fetching tag:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	return router;
}
