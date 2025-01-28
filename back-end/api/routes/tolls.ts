import { Middleware, Request, Response, Router } from 'npm:express';
import Toll from '../../models/toll.ts';
import TollOperator from '../../models/toll_operator.ts';
import Pass from '../../models/pass.ts';
import Road from '../../models/road.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/:id',
		async (req: Request, res: Response) => {
			const { id } = req.params;
			const toll = await Toll.findById(id);

			if (!toll) {
				return res.status(404).json({
					error: 'Toll not found',
				});
			}

			const operator = await TollOperator.findById(
				toll.tollOperator,
			);
			if (!operator) {
				return res.status(404).json({
					error: 'Operator not found',
				});
			}

			const road = await Road.findById(toll.road);

			const avgPasses = await Pass.getAveragePasses(id);

			const response = {
				_id: toll._id,
				name: toll.name,
				price: toll.price[1],
				road: road.name,
				operator_name: operator.name,
				avg_passes: avgPasses,
			};

			const delay = Math.floor(Math.random() * 1000) + 500; // Random delay between 500ms and 1500ms
			const shouldFail = false; //Math.random() < 0.5; // 10% chance of failure

			setTimeout(() => {
				if (shouldFail) {
					return res.status(500).json({
						error: 'Internal server error',
					});
				}
				res.status(200).json(response);
			}, delay);
		},
	);

	router.get(
		'/:tollId/operator/:operatorId/passes/heatmap',
		async (req: Request, res: Response) => {
			const { tollId, operatorId } = req.params;

			const toll = await Toll.findById(tollId);
			if (!toll) {
				return res.status(404).json({
					error: 'Toll not found',
				});
			}

			const operator = await TollOperator.findById(
				operatorId,
			);
			if (!operator) {
				return res.status(404).json({
					error: 'Operator not found',
				});
			}

			const avgPasses = await Pass.getAveragePasses(tollId);

			const response = {
				lat: toll.latitude,
				lng: toll.longitude,
				mag: avgPasses,
			};

			res.status(200).json(response);
		},
	);

	return router;
}
