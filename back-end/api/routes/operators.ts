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
			res.status(200).json([
				{ 'id': 'AM', 'name': 'aegeanmotorway' },
				{ 'id': 'EG', 'name': 'egnatia' },
				{ 'id': 'GE', 'name': 'gefyra' },
				{ 'id': 'KO', 'name': 'kentrikiodos' },
				{ 'id': 'MO', 'name': 'moreas' },
				{ 'id': 'NAO', 'name': 'naodos' },
				{ 'id': 'NO', 'name': 'neaodos' },
				{ 'id': 'OO', 'name': 'olympiaodos' },
			]);
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
