var gobble = require( 'gobble' );

module.exports = gobble([
	gobble( 'src/files' ),

	gobble( 'node_modules/rollup/dist' ),

	gobble( 'src/app' )
		.transform( 'ractive', { type: 'es6' })
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
		})

// minify on deploy, but don't bother in development
]).transformIf( gobble.env() === 'production', 'uglifyjs' );
