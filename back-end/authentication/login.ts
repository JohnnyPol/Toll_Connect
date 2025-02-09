import { Middleware, Request, Response, Router, urlencoded } from 'npm:express';

import TollOperator, { UserLevel } from '../models/toll_operator.ts';
import { create, verify } from './jwt.ts';

async function login(req: Request, res: Response): Promise<void> {
	const { username, password }: {
		username: string;
		password: string;
	} = req.body;
	// assume password is alreasy hashed
	try {
		const user = await TollOperator.findById(username).exec();
		if (user === null) {
			throw new Error(`User ${username} not found`);
		}
		if (user.passwordHash !== password) {
			throw new Error(`Incorrect password`);
		}
		res.status(200).json({
			token: await create({
				// Test just so that dummy@mail user can pass this conditional
				level: username === 'dummy@mail' // TODO: Maybe a change in the schema is needed
					? UserLevel.Admin
					: UserLevel.Operator,
				name: username,
			}),
		});
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({ message: err.toString() });
		}
	}
}

async function logout(req: Request, res: Response): Promise<void> {
	// assumes that token exists and is within req.body
	const token = req.get('x-observatory-auth');
	if (token === null) {
		res.status(400).send();
	}

	try {
		const { name, exp } = await verify(token);
		await TollOperator.findByIdAndUpdate(
			name,
			{ $push: { blacklist: token } },
		);
		setTimeout(async () => {
			await TollOperator.findByIdAndUpdate(
				name,
				{ $pull: { blacklist: token } },
			);
		}, (exp - new Date().getTime()) * 1000);
		res.status(200).send();
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({ message: err.toString() });
		}
	}
}

export default function ({ path }: Middleware): Router {
	const router = new Router();

	router.post(
		'/login',
		path({ // {{{
			summary: 'Login',
			operationId: 'login',
			requestBody: {
				required: true,
				content: {
					'application/x-www-form-urlencoded': {
						schema: {
							$ref: '#/definitions/Login',
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Logged in successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/Token',
							},
						},
					},
				},
				400: {
					description:
						'Could not find user / Incorrect password',
					content: {
						'application/json': {
							schema: {
								$ref: '#/definitions/Error',
							},
						},
					},
				},
			},
		}), // }}}
		urlencoded({ extended: false }),
		login,
	);

	router.post(
		'/logout',
		path({ // {{{
			summary: 'Logout',
			operationId: 'logout',
			parameters: [{
				in: 'header',
				required: true,
				name: 'x-observatory-auth',
				description: 'token to invalidate',
				schema: { type: 'string' },
			}],
			responses: {
				200: { description: 'Logged out successfully' },
				400: { description: 'No token provided' },
			},
		}), // }}}
		logout,
	);

	return router;
}
