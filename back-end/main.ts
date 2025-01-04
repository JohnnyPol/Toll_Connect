// @ts-types='npm:@types/express'
import express from 'npm:express';
import morgan from 'npm:morgan';
// import cors from 'npm:cors';
import openapi from 'npm:@wesleytodd/openapi';
// SEE: https://docs.deno.com/examples/express_tutorial/
import { MongoClient } from 'npm:mongodb';
// SEE: https://docs.deno.com/examples/mongo/

// express routes
import { login, logout } from './routes/login.ts';

/* CONNECTING TO DB */
import apiDoc from './api/api-doc.ts';
import api from './api/router.ts';

const client = new MongoClient('mongodb://localhost:27017');
try {
	await client.connect();
	console.log('OK connecting to db');
} catch (err) {
	console.error('ERR connectint to db:', err);
	Deno.exit(1);
}

/* EXPRESS APP */
const app = express();
// Add logging
app.use(morgan('dev'));

/* JWT REQUESTS - MIDDLEWARE */
app.post('/login', login);
app.use((req, res, next) => { next(); });
app.post('/logout', logout);
const oapi = openapi(apiDoc);

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
