import Input from './Input/index';
import Output from './Output/index';
import Footer from './Footer';
import examples from './examples';
import { dirname, extname, resolve } from './utils/path';
import examplesMatch from './utils/examplesMatch';
import debounce from './utils/debounce';

const supported = !!window.Promise;

if ( supported ) {
	console.log( `running Rollup version %c${rollup.VERSION}`, 'font-weight: bold' );

	// recover state from hash fragment
	const json = decodeURIComponent( window.location.hash.slice( 1 ) );

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
		el: '.input',
		data: {
			examples,
			selectedExample
		}
	});

	input.set({ selectedExample });

	if ( saved ) input.set( 'modules', saved.modules );

	const output = new Output({
		el: '.output',
		data: {
			options: saved ? saved.options : {
				format: 'amd',
				moduleName: 'myBundle'
			}
		}
	});

	let updating = false;

	const update = () => {
		const modules = input.get( 'modules' );

		if ( updating ) return; // TODO this is inelegant...
		updating = true;

		let moduleById = {};

		modules.forEach( module => {
			moduleById[ module.name ] = module;
		});

		/*global rollup */
		rollup.rollup({
			entry: 'main',
			resolveId ( importee, importer ) {
				if ( !importer ) return importee;
				if ( importee[0] !== '.' ) return false;

				return resolve( dirname( importer ), importee ).replace( /^\.\//, '' );
			},
			load: function ( id ) {
				if ( id === 'main' ) return modules[0].code;
				if ( extname( id ) === '' ) id += '.js';

				const module = moduleById[ id ];

				if ( !module ) throw new Error( `missing module ${id}` ); // TODO...

				return module.code;
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
				error: null
			});

			// save state as hash fragment
			window.location.hash = encodeURIComponent( JSON.stringify({ options, modules }) );
		})
		.catch( error => {
			output.set( 'error', error );
			setTimeout( () => {
				throw error;
			});
		})
		.then( () => {
			updating = false;
		});
	}

	input.observe( 'modules', debounce( update, 200 ) );
	input.observe( 'selectedExample', update );
	output.observe( 'options', update );
}

else {
	document.querySelector( 'main' ).innerHTML = `
		<div class='sorry'>
			<p>The browser build of Rollup uses ES6 Promises, which aren't supported here. I <em>could</em> fix it, but then there'd probably be something else to fix, and frankly life is too short. Use Chrome or Firefox or a recent version of Safari or, hell, anything except what you're currently using.</p>

			<p>Sorry.</p>
		</div>
	`
}

new Footer({
	el: 'footer'
});
