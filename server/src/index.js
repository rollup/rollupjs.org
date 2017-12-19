import path from 'path';
import express from 'express';
import compression from 'compression';
import servePage from './servePage.js';

import Nav from '../../universal/components/Nav.html';
import Repl from '../../universal/routes/Repl/index.html';
import Guide from '../../universal/routes/Guide.html';

const dev = !!process.env.DEV;

const app = express();

const root = path.resolve( '.' );

app.use( compression({ threshold: 0 }) );

app.use( express.static( 'client/dist', {
	maxAge: 60 * 1000 // one minute... we want to keep this short
}));

app.use( express.static( 'service-worker/dist', {
	maxAge: 60 * 1000 // one minute... we want to keep this short
}));

app.use( express.static( 'public', {
	maxAge: 1000 * 60 * 60 * 24 // one day
}));

app.get( '/guide/', ( req, res ) => {
	res.redirect( 301, '/' );
});

app.get( '/guide', ( req, res ) => {
	res.redirect( 301, '/' );
});

app.get( '/repl', ( req, res ) => {
	servePage( res, {
		title: 'rollup.js',
		lang: 'en',
		nav: Nav.render({ route: 'repl', lang: 'en' }).html,
		route: Repl.render().html // TODO is there any point? just render an empty box instead?
	}).catch( err => {
		console.log( err.stack );
	});
});

app.get( '/:lang', ( req, res ) => {
	serveGuide( req, res, req.params.lang );
});

app.get( '/', ( req, res ) => {
	serveGuide( req, res, 'en' );
});

function serveGuide ( req, res, lang ) {
	const sections = require( `${root}/public/guide/${lang}.json` );
	const summary = require( `${root}/public/guide-summary/${lang}.json` );

	servePage( res, {
		title: 'rollup.js',
		lang,
		nav: Nav.render({ route: 'guide', lang }).html,
		route: Guide.render({
			sections,
			summary,
			lang
		}).html
	}).catch( err => {
		console.log( err.stack );
	});
}

app.use( ( req, res, next ) => {
	if ( req.url.slice( -1 ) === '/' && req.url.length > 1 ) {
		res.redirect( 301, req.url.slice( 0, -1 ) );
	} else {
		next();
	}
});

app.listen( 3001, () => {
	console.log( 'listening on localhost:3001' );
});