import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType, check_admin } from '../../util.ts';
import Payment from '../../../models/payment.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();
	router.use(check_admin);

	/**
	 * GET /
	 * Retrieves all payment documents
	 */
	router.get('/', async (_req: Request, res: Response) => {
		try {
			const payments = await Payment.find();				;
			res.status(200).json(payments);
		} catch (error) {
			console.error('Error fetching payments:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	/**
	 * GET /payments/:id
	 * Retrieves a specific payment document by its ID
	 */
	router.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			const payment = await Payment.findById(id);
			if (!payment) {
				return die(res, ErrorType.BadRequest, 'Payment not found');
			}

			res.status(200).json(payment);
		} catch (error) {
			console.error('Error fetching payment:', error);
			die(res, ErrorType.Internal, error);
		}
	});

	return router;
}
