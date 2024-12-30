// @ts-types='npm:@types/express'
import express from 'npm:express';
import morgan from 'npm:morgan';
// SEE: https://docs.deno.com/examples/express_tutorial/
import { MongoClient } from 'npm:mongodb';
// SEE: https://docs.deno.com/examples/mongo/

// express routes
import { login, logout } from './routes/login.ts';

/* CONNECTING TO DB */
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

app.get('/', (req, res) => {
	res.send('Welcome to Deno');
});

if (import.meta.main) {
	app.listen(9115);
}
