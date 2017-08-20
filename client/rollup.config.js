import svelte from 'rollup-plugin-svelte';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';

const dev = !!process.env.ROLLUP_WATCH;

console.log( `creating ${dev ? 'development' : 'production'} client bundle` );

export default {
	entry: 'client/src/main.js',
	dest: 'client/dist/bundle.js',
	format: 'iife',
	plugins: [
		json(),
		nodeResolve(),
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
	sourceMap: true
};