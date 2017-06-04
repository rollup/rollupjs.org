import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import json from 'rollup-plugin-json';

const pkg = require('./package.json');

export default {
	entry: 'server/src/index.js',
	dest: 'server/dist/bundle.js',
	format: 'cjs',
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
	]
};
