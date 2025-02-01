// @ts-types='npm:@types/express'
import express from 'npm:express';
import morgan from 'npm:morgan';
import cors from 'npm:cors';
import openapi from 'npm:@wesleytodd/openapi';
// SEE: https://docs.deno.com/examples/express_tutorial/
import { connect } from 'npm:mongoose';
// SEE: https://docs.deno.com/examples/mongo/

import login from './authentication/login.ts';
import { clearBlacklist } from './authentication/jwt.ts';
import apiDoc from './api/api-doc.ts';
import api from './api/router.ts';

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

// Middleware
app.use(cors());
app.use(morgan('dev'));

app.use(oapi);
app.use('/docs', oapi.swaggerui());
app.use('/api', api(oapi));

// Enable CORS for all routes

// app.use(
// 	cors({
// 		origin: "http://localhost:5173",
// 		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// 		allowedHeaders: ["Content-Type", "Authorization", "X-OBSERVATORY-AUTH"],
// 		credentials: true,
// 	})
// );

app.use('/', login(oapi));

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
	app.listen(9115, '0.0.0.0');
}
