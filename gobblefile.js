/*global module, require */
var sander = require( 'sander' );
var gobble = require( 'gobble' );
var marked = require( 'marked' );

var asString = { encoding: 'utf-8' };

var partials = {};
sander.readdirSync( 'src/partials' ).forEach( file => {
	partials[ file.replace( '.html', '' ) ] = sander.readFileSync( `src/partials/${file}`, asString );
});

var replaceOptions = {
	replacements: partials,
	delimiters: [ '{{>', '}}' ]
};

module.exports = gobble([
	gobble( 'src/files' )
		.transform( 'replace', replaceOptions ),

	gobble( 'src/guide' )
		.transform( function ( inputdir, outputdir, options, done ) {
			var markdownFiles = sander.readdirSync( inputdir ).filter( file => /\.md/.test( file ) );

			var templates = {
				index: sander.readFileSync( inputdir, 'index.html', asString ),
				section: sander.readFileSync( inputdir, 'section.html', asString )
			};

			var sections = markdownFiles
				.map( file => {
					var markdown = sander.readFileSync( inputdir, file, asString );

					var match = /---\n([\s\S]+?)\n---/.exec( markdown );
					var frontMatter = match[1];
					var content = markdown.slice( match[0].length );

					var metadata = {};
					frontMatter.split( '\n' ).forEach( pair => {
						var colonIndex = pair.indexOf( ':' );
						metadata[ pair.slice( 0, colonIndex ).trim() ] = pair.slice( colonIndex + 1 );
					});

					return {
						html: marked( content ),
						metadata: metadata,
						slug: file.replace( /^\d+-/, '' ).replace( /\.md$/, '' )
					};
				});

			var main = sections.map( section => {
				return templates.section.replace( /\{\{([^\}]+)\}\}/g, function ( match, keypath ) {
					return section.metadata[ keypath ] || section[ keypath ];
				});
			}).join( '\n' );

			var sidebar = sections.map( section => {
				return `<li><a href='#${section.slug}'>${section.metadata.title}</a></li>`;
			}).join( '\n' );

			var html = templates.index
				.replace( '{{>sidebar}}', sidebar )
				.replace( '{{>main}}', main );

			sander.writeFileSync( outputdir, 'index.html', html );
			done();
		})
		.transform( 'replace', replaceOptions )
		.moveTo( 'guide' ),

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
				require( 'postcss-clearfix' )
				//require( 'cssnano' ) // commenting out until we can figure out how to disable z-index rebasing
			]
		})

// minify on deploy, but don't bother in development
]).transformIf( gobble.env() === 'production', 'uglifyjs' );
