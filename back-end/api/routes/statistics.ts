import { Middleware, Request, Response, Router } from 'npm:express';

import { die, ErrorType } from '../util.ts';
import Toll from '../../models/toll.ts';
import Pass from '../../models/pass.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/heatmap',
		async (req: Request, res: Response) => {
			try {
				const tolls  = await Toll.find({}).sort('_id');
				const passes = await Pass.find({}).sort('toll');

				const resp : {
					latitude: number;
					longitude: number;
					count: number
				}[] = [];

				let i = 0;
				tolls.forEach(toll => {
					const { _id, latitude, longitude } = toll;
					let len = resp.push({ latitude, longitude, count: 0 });
					while (i < passes.length && passes[i].toll == _id)
						resp[len - 1].count++;
				});

				res.status(200).json(resp);
			} catch (err) {
				console.error('Error in heatmap:', err);
				die(res, ErrorType.Internal, 'Error in heatmap');
			}
		},
	);

	router.get(
		'/toll/:toll_id/:start_date/:end_date',
		(req: Request, res: Response) => {
		},
	);

	return router;
}

