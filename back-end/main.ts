// @ts-types='npm:@types/express'
import express from 'npm:express';
// SEE: https://docs.deno.com/examples/express_tutorial/
import { MongoClient } from 'npm:mongodb';
// SEE: https://docs.deno.com/examples/mongo/

const client = new MongoClient('mongodb://localhost:27017');
try {
	await client.connect();
	console.log('OK connecting to db');
} catch (err) {
	console.error('ERR connectint to db:', err);
	Deno.exit(1);
}

const app = express();

app.get('/', (req, res) => {
	res.send('Welcome to Deno');
});

if (import.meta.main) {
	app.listen(8000);
}
