import { Middleware, Request, Response, Router } from 'npm:express';
import Toll from '../../models/toll.ts';

import TollOperator from '../../models/toll_operator.ts';

export default function (oapi: Middleware): Router {
	const router = new Router();

	router.get(
		'/',
		oapi.path({
			summary: 'Fetch toll operators',
			operationId: 'getOperators',
			responses: {
				200: {
					description: 'List of operators',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/TollOperator',
								},
							},
						},
					},
				},
			},
		}),
		(_req: Request, res: Response) => {
			setTimeout(() => {
				res.status(200).json([
					{ '_id': 'AM', 'name': 'aegeanmotorway' },
					{ '_id': 'EG', 'name': 'egnatia' },
					{ '_id': 'GE', 'name': 'gefyra' },
					{ '_id': 'KO', 'name': 'kentrikiodos' },
					{ '_id': 'MO', 'name': 'moreas' },
					{ '_id': 'NAO', 'name': 'naodos' },
					{ '_id': 'NO', 'name': 'neaodos' },
					{ '_id': 'OO', 'name': 'olympiaodos' },
				]);
			}, 1000); // 1000ms = 1 second
		},
	);

	router.get(
		'/:id',
		oapi.path({
			summary: 'Fetch toll operators',
			operationId: 'getOperators',
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					type: 'string',
				},
			],
			responses: {
				200: {
					description: 'found operator',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/definitions/TollOperator',
								},
							},
						},
					},
				},
				400: {
					description: 'could not find operator',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/Error',
							},
						},
					},
				},
			},
		}),
		async (_req: Request, res: Response) => {
			const { id } = _req.params;
			try {
				const info = await TollOperator.findById(id)
					.exec();
				res.status(200).json(info);
			} catch (error) {
				console.error(error);
				res.status(500).json({
					error: 'Internal server error',
				});
			}
		},
	);

	router.get(
		'/:id/tolls',
		async (req: Request, res: Response) => {
			const { id } = req.params;
			const info = await Toll.find({ tollOperator: id }, {
				_id: 1,
				name: 1,
				latitude: 1,
				longitude: 1,
			});
			res.status(200).json(info);
		},
	);

	return router;
}
