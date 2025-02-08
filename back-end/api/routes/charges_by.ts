import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType, get_date, set_date } from '../util.ts';

import TollOperator from '../../models/toll_operator.ts';
import Pass from '../../models/pass.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:operator_id/:date_from/:date_to',
		async (req: Request, res: Response) => {
			const tollOpID  : string = req.params.operator_id;
			const date_from : Date   = get_date(req.params.date_from);
			const date_to   : Date   = get_date(req.params.date_to);

			try {
				const operator = await TollOperator.findById(tollOpID);
				if (!operator)
					return die(res, ErrorType.BadRequest, 'Operator not found');

				const passes = await Pass.find({
					'toll.tollOperator': tollOpID,
					'tag.tollOperator': { $ne: tollOpID },
					time: { $gte: date_from, $lte: date_to }
				}).populate(['tag', 'toll']).sort('tag.tollOperator');

				const processed: {
					visitingOpID: string;
					nPasses: number;
					passesCost: number;
				}[] = [];
				passes.forEach(pass => {
					if (processed.length === 0 ||
						processed[processed.length - 1].visitingOpID !== pass.tag.tollOperator) {
						processed.push({
							visitingOpID: pass.tag.tollOperator,
							nPasses: 1,
							passesCost: pass.tag.charge,
						});
					} else {
						processed[processed.length - 1].nPasses++;
						processed[processed.length - 1].passesCost += pass.tag.charge;
					}
				});

				res.status(200).json({
					tollOpID,
					requestTimestamp: set_date(new Date()),
					periodFrom: set_date(date_from),
					periodTo: set_date(date_to),
					vOpList: processed,
				});
			} catch (err) {
				console.error('Error fetching passes cost:', err);
				die(res, ErrorType.Internal, 'Error fetching passes cost');
			}
		},
	);


	return router;
}
/*
import express from 'express';
import Pass from '../../models/pass.ts';
import TollOperator from '../../models/tollOperator.ts';
import moment from 'npm:moment';

const router = express.Router();

router.get('/chargesBy/:tollOpID/:date_from/:date_to', async (req, res) => {
    try {
        // Extract parameters from URL
        const { tollOpID, date_from, date_to } = req.params;

        // Convert date strings to JavaScript Date objects
        const startDate = moment(date_from, 'YYYY-MM-DD').toDate();
        const endDate = moment(date_to, 'YYYY-MM-DD').toDate();

        // Validate if station operator exists
        const tollOperatorExists = await TollOperator.findById(tollOpID);

        if (!tollOperatorExists) {
            return res.status(400).json({ error: 'Invalid Toll Operator ID' });
        }

        // Fetch pass data where:
        // - The toll station operator is `tollOpID`
        // - The pass time is within the given period
        const passes = await Pass.find({
            'toll.tollOperator': tollOpID,
            time: { $gte: startDate, $lte: endDate }
        });

        // Group passes by visiting operators (tag.tollOperator)
        const operatorCharges = new Map<string, { nPasses: number; passesCost: number }>();

        passes.forEach(pass => {
            const visitingOpID = pass.tag.tollOperator;
            const passCharge = pass.charge;

            if (!operatorCharges.has(visitingOpID)) {
                operatorCharges.set(visitingOpID, { nPasses: 0, passesCost: 0 });
            }

            const data = operatorCharges.get(visitingOpID)!;
            data.nPasses += 1;
            data.passesCost += passCharge;
        });

        // Convert map to list format
        const vOpList = Array.from(operatorCharges.entries()).map(([visitingOpID, { nPasses, passesCost }]) => ({
            visitingOpID,
            nPasses,
            passesCost
        }));

        // Construct response object
        const responseObject = {
            tollOpID,
            requestTimestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            periodFrom: date_from,
            periodTo: date_to,
            vOpList
        };

        res.json(responseObject);
    } catch (error) {
        console.error('Error fetching operator charges:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

*/