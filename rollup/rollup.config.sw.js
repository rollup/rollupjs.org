import replace from 'rollup-plugin-replace';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import glob from 'glob';

const dev = !!process.env.DEV;

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
	'/guide.json',
	glob.sync( 'examples/**/*.json', { cwd: 'public' }).map( x => `/${x}` )
);

export default {
	entry: 'client/service-worker.js',
	dest: 'public/service-worker.js',
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