import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-replace';
import glob from 'glob';
import pkg from './package.json';

const dev = !!process.env.ROLLUP_WATCH;

console.log( `creating ${dev ? 'development' : 'production'} bundles` );

export default [
	/* client */
	{
		input: 'client/src/main.js',
		plugins: [
			json(),
			resolve(),
			commonjs({
				namedExports: {
					'node_modules/acorn/dist/acorn.js': [ 'parse, tokenizer' ],
					'node_modules/acorn/dist/acorn_loose.js': [ 'parse_dammit', 'tokTypes' ]
				}
			}),
			svelte({
				css: css => {
					css.write(`client/dist/main.css`);
				}
			}),
			buble(),
			!dev && uglify()
		],
		output: {
			file: 'client/dist/bundle.js',
			format: 'iife',
			sourcemap: true
		}
	},

	/* server */
	{
		input: 'server/src/index.js',
		external: Object.keys(pkg.dependencies).concat([
			'path', 'fs'
		]),
		plugins: [
			resolve(),
			commonjs({
				namedExports: {
					'node_modules/acorn/dist/acorn.js': [ 'parse, tokenizer' ],
					'node_modules/acorn/dist/acorn_loose.js': [ 'parse_dammit', 'tokTypes' ]
				}
			}),
			json(),
			svelte({
				generate: 'ssr',
				css: false
			})
		],
		output: {
			file: 'server/dist/bundle.js',
			format: 'cjs'
		}
	},

	/* service worker */
	{
		input: 'service-worker/src/main.js',
		plugins: [
			replace({
				__CACHEVERSION__: dev ? 'dev' : Date.now(),
				__MANIFEST__: JSON.stringify([].concat(
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
				))
			}),
			buble(),
			!dev && uglify()
		],
		output: {
			file: 'service-worker/dist/service-worker.js',
			format: 'iife',
			sourcemap: true
		}
	}
];