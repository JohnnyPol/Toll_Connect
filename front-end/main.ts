// @ts-types='npm:@types/express'
import express from 'npm:express';

const app = express();

app.get('/', (req, res) => {
	res.send('Welcome to Deno');
});

if (import.meta.main) {
	app.listen(8000);
}
