const fs = require( 'fs' );
const path = require( 'path' );
const Module = require( 'module' );
const rollup = require( 'rollup' );
const json = require( 'rollup-plugin-json' );
const svelte = require( 'rollup-plugin-svelte' );
const commonjs = require( 'rollup-plugin-commonjs' );
const resolve = require( 'rollup-plugin-node-resolve' );
const CleanCSS = require( 'clean-css' );
const { mkdirp } = require( './utils.js' );

const root = path.resolve( __dirname, '../..' );
const dev = !!process.env.DEV;

module.exports = () => {
	console.group( 'generating CSS' );
	// generate CSS
	return rollup.rollup({
		entry: `${root}/shared/App.html`,
		plugins: [
			resolve(),
			commonjs({
				namedExports: {
					'node_modules/acorn/dist/acorn.js': [ 'parse' ]
				}
			}),
			json(),
			svelte({
				generate: 'ssr'
			})
		]
	}).then( bundle => {
		const { code } = bundle.generate({ format: 'cjs' });

		const m = new Module();
		m._compile( code, `${root}/shared/App.html` );

		const css = fs.readFileSync( `${root}/server/templates/main.css`, 'utf-8' )
			.replace( '__codemirror__', fs.readFileSync( `${root}/node_modules/codemirror/lib/codemirror.css`, 'utf-8' ) )
			.replace( '__components__', m.exports.renderCss().css );

		const result = dev ? css : new CleanCSS().minify( css ).styles;

		mkdirp( `${root}/public/css` );
		fs.writeFileSync( `${root}/public/css/main.css`, result );
		console.groupEnd();
	});
};
