import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType } from '../../util.ts';
import Toll from '../../../models/toll.ts';

export default function (oapi: Middleware): Router {
    const router = new Router();

    /**
     * GET /tolls
     * Retrieves all toll documents
     */
    router.get('/', async (req: Request, res: Response) => {
        try {
            const tolls = await Toll.find().lean();
            res.status(200).json(tolls);
        } catch (error) {
            console.error('Error fetching tolls:', error);
            die(res, ErrorType.Internal, 'Error fetching tolls');
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
            die(res, ErrorType.Internal, 'Error fetching toll');
        }
    });

    return router;
}
