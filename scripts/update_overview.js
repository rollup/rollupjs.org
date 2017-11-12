const fs = require( 'fs' );
const https = require( 'https' );

// yes this is messy af. deal with it
https.get( 'https://raw.githubusercontent.com/rollup/rollup/master/README.md', res => {
	let body = '';

	res.on( 'data', chunk => {
		body += chunk;
	});

	res.on( 'end', () => {
		body = body.slice( 0, body.indexOf( '## License' ) ); // remove license
		body = body.slice( 0, body.indexOf( '<p' ) ) + body.slice( body.indexOf( '</p>' ) + 4 ); // remove badges

		body = body
			.replace( /\[([^\].]+)\]\(https?:\/\/rollupjs.org(?:\/guide)\/?\)/gm, '$1' )
			.replace( /the user guide/gm, 'this user guide' )
			.replace( '# Rollup', `---\ntitle: Introduction\n---` ) // add YAML front matter
			.replace( /^#+\s*$/gm, '' );

		const chunks = body.split( '```' );

		body = chunks
			.map( ( chunk, i ) => {
				if ( i % 2 ) return chunk;
				return chunk.replace( /^#/gm, '##' ); // h2 -> h3
			})
			.join( '```' );

		fs.writeFileSync( 'guide/en/00-introduction.md', body );
	});
});