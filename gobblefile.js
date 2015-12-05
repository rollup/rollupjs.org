var gobble = require( 'gobble' );

module.exports = gobble([
	gobble( 'src/files' ),

	// node_modules
	gobble( 'node_modules/rollup/dist' ),

	gobble( 'node_modules/ractive' )
		.include( 'ractive.js' )
		.moveTo( 'ractive' ),

	gobble( 'node_modules/codemirror' )
		.include([ 'lib/**', 'mode/javascript/**' ])
		.moveTo( 'codemirror' ),

	// app
	gobble([
		gobble( 'src/app' ).transform( 'ractive', { type: 'es6' }),
		gobble( 'src/examples' ).transform( 'spelunk', {
			dest: 'examples.js',
			type: 'es6'
		})
	])
		.transform( 'rollup', {
			entry: 'main.js',
			dest: 'app.js',
			format: 'iife',
			external: [ 'ractive' ],
			plugins: [
				require( 'rollup-plugin-babel' )(),
				require( 'rollup-plugin-npm' )({
					jsnext: true,
					skip: [ 'ractive' ]
				})
			]
		}),

	gobble( 'src/styles' )
		.transform( 'postcss', {
			src: 'index.css',
			dest: 'min.css',
			plugins: [
				require( 'postcss-import' ),
				require( 'autoprefixer' ),
				require( 'postcss-nested' ),
				require( 'postcss-clearfix' ),
				//require( 'cssnano' ) // commenting out until we can figure out how to disable z-index rebasing
			]
		})

// minify on deploy, but don't bother in development
]).transformIf( gobble.env() === 'production', 'uglifyjs' );
