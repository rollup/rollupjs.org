import express from 'express';
import compression from 'compression';
import sapper from 'sapper';
import serve from 'serve-static';
import { routes } from './manifest/server.js';
import App from './App.html';

express()
	.use(
		compression({ threshold: 0 }),
		serve('assets'),
		sapper({
			routes,
			App
		})
	)
	.listen(process.env.PORT);