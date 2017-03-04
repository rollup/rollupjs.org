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

		console.log( body );

		body = body
			.replace( '# Rollup', `---\ntitle: Overview\n---` ) // add YAML front matter
			.replace( /^#/gm, '##' ); // h2 -> h3

		fs.writeFileSync( 'src/guide/00-overview.md', body );
	});
});