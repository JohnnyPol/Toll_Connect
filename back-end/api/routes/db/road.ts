import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType } from '../../util.ts';
import Road from '../../../models/road.ts';

export default function (oapi: Middleware): Router {
    const router = new Router();

    /**
     * GET /road
     * Retrieves all road documents
     */
    router.get('/', async (req: Request, res: Response) => {
        try {
            const roads = await Road.find().lean(); 
            res.status(200).json(roads);
        } catch (error) {
            console.error('Error fetching roads:', error);
            die(res, ErrorType.Internal, 'Error fetching roads');
        }
    });

    /**
     * GET /road/:id
     * Retrieves a specific road document by its ID
     */
    router.get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const road = await Road.findById(id).lean();
            if (!road) return die(res, ErrorType.BadRequest, 'Road not found'); 

            res.status(200).json(road);
        } catch (error) {
            console.error('Error fetching road:', error);
            die(res, ErrorType.Internal, 'Error fetching road');
        }
    });

    return router;
}
