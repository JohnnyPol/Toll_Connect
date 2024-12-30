import { urlencoded, Request, Response } from 'npm:express';
import TollOperator from '../models/toll_operator.ts';

import { create, verify, UserLevel } from '../jwt.ts';

const login = [
	urlencoded({ extended: false }),
	async (req: Request, res: Response) => {
		const { username, password } = req.body;
		// assume password is alreasy hashed
		try {
			const user = await TollOperator.findOne({
				name: username, passwordHash: password
			});
			if (user === null)
				throw new Error('No such user found');
			res.json({ token: create({
				level: UserLevel.Operator, id: user._id
			}) });
		} catch (err) {
			res.status(401).send(err.toString());
		}
	}
];

const logout = [
	// assumes that token exists and is within req.body

	// TODO: need to create db collection OR update users collection to
	// hold last issued JWT
	async (req: Request, res: Response) => {
		try {
			const { id } = req.body.token;
		} catch (err) {
			res.send(err.toString());
		}
	}
];

export { login, logout };

