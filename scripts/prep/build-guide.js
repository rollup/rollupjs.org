const fs = require( 'fs' );
const path = require( 'path' );
const marked = require( 'marked' );
const hljs = require( 'highlight.js' );

const root = path.resolve( __dirname, '../..' );

function mkdirp ( dir ) {
	const parent = path.dirname( dir );
	if ( dir === parent ) return;
	mkdirp( parent );

	try {
		fs.mkdirSync( dir );
	} catch ( err ) {
		if ( err.code !== 'EEXIST' ) {
			throw err;
		}
	}
}

module.exports = () => {
	mkdirp( `${root}/public/guide` );
	mkdirp( `${root}/public/guide-summary` );

	fs.readdirSync( `${root}/guide` )
		.filter( dir => fs.statSync( `${root}/guide/${dir}` ).isDirectory() )
		.forEach( lang => {
			const sections = fs.readdirSync( `${root}/guide/${lang}` )
				.filter( file => file[0] !== '.' && path.extname( file ) === '.md' )
				.map( file => {
					const markdown = fs.readFileSync( `${root}/guide/${lang}/${file}`, 'utf-8' );

					let match = /---\n([\s\S]+?)\n---/.exec( markdown );
					const frontMatter = match[1];
					let content = markdown.slice( match[0].length );

					const metadata = {};
					frontMatter.split( '\n' ).forEach( pair => {
						const colonIndex = pair.indexOf( ':' );
						metadata[ pair.slice( 0, colonIndex ).trim() ] = pair.slice( colonIndex + 1 ).trim();
					});

					// syntax highlighting
					let uid = 0;
					const highlighted = {};

					content = content
						.replace( /```([\w-]+)?\n([\s\S]+?)```/g, ( match, lang, code ) => {
							const { value } = hljs.highlight( lang || 'bash', code );
							highlighted[ ++uid ] = value;

							return `@@${uid}`;
						});

					const html = marked( content )
						.replace( /<p>(<a class='open-in-repl'[\s\S]+?)<\/p>/g, '$1' )
						.replace( /<p>@@(\d+)<\/p>/g, ( match, id ) => {
							return `<pre><code>${highlighted[ id ]}</code></pre>`;
						})
						.replace( /^\t+/gm, match => match.split( '\t' ).join( '  ' ) );

					const subsections = [];
					const pattern = /<h3 id="(.+?)">(.+?)<\/h3>/g;
					while ( match = pattern.exec( html ) ) {
						const slug = match[1];
						const title = match[2]
							.replace( /<\/?code>/g, '' )
							.replace( /\.(\w+).*/, '.$1' )
							.replace(/\((\w+).*\)/, '');

						subsections.push({ slug, title });
					}

					return {
						html,
						metadata,
						subsections,
						slug: file.replace( /^\d+-/, '' ).replace( /\.md$/, '' )
					};
				});

			fs.writeFileSync( `${root}/public/guide/${lang}.json`, JSON.stringify( sections ) );
			fs.writeFileSync( `${root}/public/guide-summary/${lang}.json`, JSON.stringify( sections ) );
		});
};