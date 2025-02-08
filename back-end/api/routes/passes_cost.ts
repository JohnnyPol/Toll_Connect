import { Middleware, Request, Response, Router } from 'npm:express';
import { die, ErrorType, get_date, set_date } from '../util.ts';

import TollOperator from '../../models/toll_operator.ts';
import Pass from '../../models/pass.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:operator_id/:tag_id/:date_from/:date_to',
		async (req: Request, res: Response) => {
			const stationOpID : string = req.params.operator_id;
			const tagOpID     : string = req.params.tag_id;
			const date_from   : Date   = get_date(req.params.date_from);
			const date_to     : Date   = get_date(req.params.date_to);

			try {
				const operator = await TollOperator.findById(stationOpID);
				const tag      = await TollOperator.findById(tagOpID);
				if (!operator)
					return die(res, ErrorType.BadRequest, 'Operator not found');
				if (!tag)
					return die(res, ErrorType.BadRequest, 'Tag not found');

				const passes = await Pass.find({
					'tag.tollOperator': tagOpID,
					'toll.tollOperator': stationOpID,
					time: { $gte: date_from, $lte: date_to },
				}).populate(['tag', 'toll']);

				res.status(200).json({
					stationOpID,
					tagOpID,
					requestTimestamp: set_date(new Date()),
					periodFrom: set_date(date_from),
					periodTo: set_date(date_to),
					nPasses: passes.length,
					passesCost: passes.reduce( (acc, pass) => acc + pass.charge, 0)
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

router.get('/passesCost/:tollOpID/:tagOpID/:date_from/:date_to', async (req, res) => {
    try {
        // Extract parameters from URL
        const { tollOpID, tagOpID, date_from, date_to } = req.params;

        // Convert date strings to JavaScript Date objects
        const startDate = moment(date_from, 'YYYY-MM-DD').toDate();
        const endDate = moment(date_to, 'YYYY-MM-DD').toDate();

        // Validate if station and tag operators exist
        const tollOperatorExists = await TollOperator.findById(tollOpID);
        const tagOperatorExists = await TollOperator.findById(tagOpID);

        if (!tollOperatorExists || !tagOperatorExists) {
            return res.status(400).json({ error: 'Invalid Toll Operator IDs' });
        }

        // Fetch pass data where:
        // - The tag provider is `tagOpID`
        // - The toll station operator is `tollOpID`
        // - The pass time is within the given period
        const passes = await Pass.find({
            'tag.tollOperator': tagOpID,
            'toll.tollOperator': tollOpID,
            time: { $gte: startDate, $lte: endDate }
        });

        // Calculate total passes count and total cost
        const nPasses = passes.length;
        const passesCost = passes.reduce((total, pass) => total + pass.charge, 0);

        // Construct response object
        const responseObject = {
            tollOpID,
            tagOpID,
            requestTimestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            periodFrom: date_from,
            periodTo: date_to,
            nPasses,
            passesCost
        };

        res.json(responseObject);
    } catch (error) {
        console.error('Error fetching passes cost:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

*/