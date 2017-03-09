import Input from './Input/index.html';
import Output from './Output/index.html';
import Footer from './Footer.html';
import examples from './examples';
import { dirname, resolve } from './utils/path';
import examplesMatch from './utils/examplesMatch';
import debounce from './utils/debounce';

const supported = !!window.Promise && !!window.Map && !!window.Set;

if ( supported ) {
	document.querySelector('header h1 small').innerHTML = `v${rollup.VERSION}`;

	// recover state from hash fragment
	let json;
	const match = /shareable=(.+)$/.exec( window.location.search );
	if ( match ) {
		try {
			json = decodeURIComponent( atob( match[1] ) );
		} catch ( err ) {
			// noop
		}
	}

	if ( !match ) {
		// legacy
		json = decodeURIComponent( window.location.hash.slice( 1 ) );
	}

	let saved;
	let selectedExample;
	try {
		saved = JSON.parse( json );
		let example;

		// does this match an existing example?
		for ( let i = 0; i < examples.length; i += 1 ) {
			example = examples[i];

			if ( examplesMatch( example.modules, saved.modules ) ) {
				selectedExample = example;
				break;
			}
		}
	} catch ( err ) {
		selectedExample = examples[0];
	}

	const input = new Input({
		target: document.querySelector( '.input' ),
		data: {
			examples,
			selectedExample
		}
	});

	input.set({ selectedExample });

	if ( saved ) input.set({ modules: saved.modules });

	const output = new Output({
		target: document.querySelector( '.output' ),
		data: {
			options: saved ? saved.options : {
				format: 'cjs',
				moduleName: 'myBundle'
			}
		}
	});

	let updating = false;

	const update = () => {
		const modules = input.get( 'modules' );

		if ( updating ) return; // TODO this is inelegant...
		updating = true;

		console.clear();
		console.log( `running Rollup version %c${rollup.VERSION}`, 'font-weight: bold' );

		let moduleById = {};

		modules.forEach( module => {
			moduleById[ module.name ] = module;
		});

		const warnings = [];

		/*global rollup */
		rollup.rollup({
			entry: 'main.js',
			plugins: [{
				resolveId ( importee, importer ) {
					if ( !importer ) return importee;
					if ( importee[0] !== '.' ) return false;

					let resolved = resolve( dirname( importer ), importee ).replace( /^\.\//, '' );
					if ( resolved in moduleById ) return resolved;

					resolved += '.js';
					if ( resolved in moduleById ) return resolved;

					throw new Error( `Could not resolve '${importee}' from '${importer}'` );
				},
				load: function ( id ) {
					return moduleById[ id ].code;
				}
			}],
			onwarn ( warning ) {
				warnings.push( warning );

				console.group( warning.loc ? warning.loc.file : '' );

				console.warn( warning.message );

				if ( warning.frame ) {
					console.log( warning.frame );
				}

				if ( warning.url ) {
					console.log( `See ${warning.url} for more information` );
				}

				console.groupEnd();
			}
		}).then( bundle => {
			output.set({
				imports: bundle.imports,
				exports: bundle.exports
			});

			const options = output.get( 'options' );
			const generated = bundle.generate( options );

			output.set({
				code: generated.code,
				error: null,
				warnings
			});

			// save state as hash fragment
			history.replaceState( {}, 'x', `/repl?version=${rollup.VERSION}&shareable=${btoa( encodeURIComponent( JSON.stringify({ options, modules }) ) )}` );
		})
		.catch( error => {
			output.set({ error });
			setTimeout( () => {
				throw error;
			});
		})
		.then( () => {
			updating = false;
		});
	};

	input.observe( 'modules', debounce( update, 200 ) );
	input.observe( 'selectedExample', update );
	output.observe( 'options', update );
}

else {
	document.querySelector( 'main' ).innerHTML = `
		<div class='sorry'>
			<p>The browser build of Rollup uses features that aren't supported here. I <em>could</em> fix it, but then there'd probably be something else to fix, and frankly life is too short. Use Chrome or Firefox or a recent version of Safari or, hell, anything except what you're currently using.</p>

			<p>Sorry.</p>
		</div>
	`;
}

// TODO where did this live before?
// new Footer({
// 	target: document.querySelector( 'footer' )
// });
