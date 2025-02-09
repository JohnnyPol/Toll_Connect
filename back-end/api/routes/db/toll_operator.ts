import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType } from '../../util.ts';
import TollOperator from '../../../models/toll_operator.ts';

export default function (oapi: Middleware): Router {
    const router = new Router();

    /**
     * GET /toll-operator
     * Retrieves all toll operator documents
     */
    router.get('/', async (req: Request, res: Response) => {
        try {
            const tollOperators = await TollOperator.find().lean(); 
            res.status(200).json(tollOperators);
        } catch (error) {
            console.error('Error fetching toll operators:', error);
            die(res, ErrorType.Internal, 'Error fetching toll operators');
        }
    });

    /**
     * GET /toll-operator/:id
     * Retrieves a specific toll operator document by its ID
     */
    router.get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const tollOperator = await TollOperator.findById(id).lean(); 
            if (!tollOperator) return die(res, ErrorType.BadRequest, 'Toll Operator not found'); 

            res.status(200).json(tollOperator);
        } catch (error) {
            console.error('Error fetching toll operator:', error);
            die(res, ErrorType.Internal, 'Error fetching toll operator');
        }
    });

    return router;
}
