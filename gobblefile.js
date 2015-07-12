var gobble = require( 'gobble' );

module.exports = gobble([
	gobble( 'src/files' ),

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
		.transform( 'derequire' )
		.transform( 'browserify', {
			entries: [ './app' ],
			dest: 'app.js',
			debug: true,
			standalone: 'app'
		})
]);
