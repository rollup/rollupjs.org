require( 'console-group' ).install();

Promise.resolve()
	.then( () => require( './build-examples.js' )() )
	.then( () => require( './build-repl.js' )() )
	.then( () => require( './build-guide.js' )() );