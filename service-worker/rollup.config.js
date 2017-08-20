import replace from 'rollup-plugin-replace';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import glob from 'glob';

const dev = !!process.env.ROLLUP_WATCH;

console.log( `creating ${dev ? 'development' : 'production'} service worker` );

const manifest = [].concat(
	// routes
	'/',
	'/repl',

	// js
	'/bundle.js',
	'/curl.js',

	// css
	'/main.css',

	// content
	glob.sync( 'examples/**/*.json', { cwd: 'public' }).map( x => `/${x}` ),
	glob.sync( 'fontello/**/*.*', { cwd: 'public' }).map( x => `/${x}` ),
	glob.sync( 'images/**/*.*', { cwd: 'public' }).map( x => `/${x}` )
);

export default {
	entry: 'service-worker/src/main.js',
	dest: 'service-worker/dist/service-worker.js',
	format: 'iife',
	plugins: [
		replace({
			__CACHEVERSION__: dev ? 'dev' : Date.now(),
			__MANIFEST__: JSON.stringify( manifest )
		}),
		buble(),
		!dev && uglify()
	],
	sourceMap: true
};