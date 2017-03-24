import Input from './Input/index.html';
import Output from './Output/index.html';
import examples from './examples';
import { dirname, resolve } from './utils/path';
import recoverState from './utils/recoverState';
import debounce from './utils/debounce';

const { saved, selectedExample } = recoverState();

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

// load correct version of Rollup
const versionMatch = /version=([^&]+)/.exec( window.location.search );
const url = versionMatch ?
	'https://unpkg.com/rollup@' + versionMatch[1] + '/dist/rollup.browser.js' :
	'https://unpkg.com/rollup/dist/rollup.browser.js';

window.loadScript( url ).then( () => {
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
});