import { handler } from './build/handler.js';
import express from 'express';

const app = express();

app.use((req, res, next) => {
	res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
	res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
	next();
});

app.get('/_health', (req, res) => {
	res.end('ok');
});

app.use(handler);

app.listen(3000, () => {
	console.log('listening on port 3000');
});
