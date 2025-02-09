// @ts-types='npm:@types/express'
import express from 'npm:express';
import morgan from 'npm:morgan';
// import cors from 'npm:cors';
import openapi from 'npm:@wesleytodd/openapi';
// SEE: https://docs.deno.com/examples/express_tutorial/
import { connect } from 'npm:mongoose';
// SEE: https://docs.deno.com/examples/mongo/

import { clearBlacklist } from './authentication/jwt.ts';
import apiDoc from './api/api-doc.ts';
import api from './api/router.ts';
import cors from "cors";

/* CONNECTING TO DB */
try {
	await connect('mongodb://localhost:27017');
	console.log('OK connecting to db');
} catch (err) {
	console.error('ERR connectint to db:', err);
	Deno.exit(1);
}

// clear blacklists
try {
	await clearBlacklist();
} catch (err) {
	console.error('ERR clearing blacklist:', err);
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
	app.listen(9115);
}
