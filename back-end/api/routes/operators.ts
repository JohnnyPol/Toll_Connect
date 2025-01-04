import { Middleware, Request, Response, Router } from 'npm:express';

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
			res.status(200).json([{
				id: '0',
				name: 'John Doe',
				address: 'Morge',
			}]);
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
		(_req: Request, res: Response) => {
			res.status(400).json([{ msg: 'WTF' }]);
		},
	);

	return router;
}
