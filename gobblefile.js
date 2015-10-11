var gobble = require( 'gobble' );

module.exports = gobble([
	gobble( 'src/files' ),

	gobble( 'node_modules/rollup/dist' ),

	gobble([
		gobble( 'src/app' ).transform( 'ractive', { type: 'es6' }),
		gobble( 'src/examples' ).transform( 'spelunk', {
			dest: 'examples.js',
			type: 'es6'
		})
	])
		.transform( 'rollup-babel', {
			entry: 'main.js',
			dest: 'app.js',
			format: 'cjs',
			external: [
				'ractive'
			]
		})
		.transform( 'browserify', {
			entries: [ './app' ],
			dest: 'app.js',
			debug: true,
			standalone: 'app'
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
