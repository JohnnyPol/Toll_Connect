// @ts-types='npm:@types/express'
import express from 'npm:express';
import morgan from 'npm:morgan';
// import cors from 'npm:cors';
import openapi from 'npm:@wesleytodd/openapi';
// SEE: https://docs.deno.com/examples/express_tutorial/
import mongoose, { connect } from 'npm:mongoose';
// SEE: https://docs.deno.com/examples/mongo/

import { clearBlacklist } from './authentication/jwt.ts';
import apiDoc from './api/api-doc.ts';
import api from './api/router.ts';
import cors from "cors";

async function check_connection () : void {
	if (mongoose.connection.readyState === 1) {
		console.log('OK db already connected');
		return;
	}
	try {
		console.log('TRY connecting to db');
		await connect('mongodb://localhost:27017');
	} catch (err) {
		console.error('ERR connecting to db:', err);
	}
	// clear blacklists
	if (mongoose.connection.readyState === 1) {
		console.log('OK connecting to DB');
		try {
			await clearBlacklist();
		} catch (err) {
			console.error('ERR clearing blacklist:', err);
		}
	} else {
		console.error(
			'ERR connecting to db: status:',
			mongoose.connection.readyState
		);
	}
}

/* EXPRESS APP */
const app = express();
const oapi = openapi(apiDoc);

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(morgan('dev'));

app.use(oapi);
app.use('/docs', oapi.swaggerui());
app.use('/api', api(oapi));


app.get(
	'/',
	oapi.path({
		responses: {
			200: {
				description: 'successful response',
				content: {
					schema: {
						type: 'array',
						items: {
							$ref: '#/definitions/TollOperator',
						},
					},
				},
			},
		},
	}),
	(_req, res) => {
		res.json({ id: '0', name: 'John Doe', address: 'Morge' });
	},
);

if (import.meta.main) {
	/* CONNECTING TO DB */
	check_connection();
	setInterval(check_connection, 5 * 1000);

	app.listen(9115);
}
