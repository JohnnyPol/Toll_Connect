/*import { Middleware, Request, Response, Router } from 'npm:express';

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
}*/
import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType, get_date, set_date } from '../util.ts';

import {difference} from 'jsr:@std/datetime';
import Toll from '../../models/toll.ts';
import Pass from '../../models/pass.ts';
import Tag from '../../models/tag.ts';
import moment from 'npm:moment';

export default function (oapi: Middleware): Router {
    const router = new Router();

    router.get('/:toll_id/:start_date/:end_date', async (req: Request, res: Response) => {
        const tollID: string = req.params.toll_id;
        const startDate: Date = get_date(req.params.start_date);
        const endDate: Date = get_date(req.params.end_date);

        try {
            // Fetch the toll document
            const tollDocument = await Toll.findById(tollID);
            if (!tollDocument) return die(res, ErrorType.BadRequest, 'Toll station not found');

            // Fetch passes and ensure 'tag' is fully populated
            const passes = await Pass.find({
                toll: tollID,
                time: { $gte: startDate, $lte: endDate }
            })
            .populate({
                path: 'tag',
                model: Tag, // Ensure we populate using the correct model
                select: 'tollOperator'
            });

            // Ensure all passes have their tag.tollOperator populated
            if (!passes.every(pass => pass.tag && pass.tag.tollOperator)) {
                console.warn('Warning: Some passes are missing tag.tollOperator');
            }

            // Calculate the number of days in the period
            //const daysInPeriod = moment(endDate).diff(moment(startDate), 'days') || 1;
			const { days }=difference(startDate,endDate);
            const totalPasses = passes.length;
            const avgPasses = totalPasses / days;

            // Aggregate passes per operator
            const operatorData = new Map<string, number>();

            passes.forEach(pass => {
                if (!pass.tag || !pass.tag.tollOperator) {
                    console.warn('Skipping pass with missing tag.tollOperator:', pass);
                    return;
                }

                const operatorID = String(pass.tag.tollOperator); // Convert ObjectId to string
                operatorData.set(operatorID, (operatorData.get(operatorID) || 0) + 1);
            });

            // Convert Map to List
            const operatorsPassesList = Array.from(operatorData.entries()).map(([operator, passes]) => ({
                operator,
                passes
            }));

            // Construct and send response
            res.status(200).json({
                toll: tollDocument,
                avg_passes: avgPasses,
                operators: operatorsPassesList
            });

        } catch (err) {
            console.error('Error fetching toll data:', err);
            die(res, ErrorType.Internal, 'Error fetching toll data');
        }
    });

    return router;
}


