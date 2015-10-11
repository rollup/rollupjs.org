import Input from './Input/index';
import Output from './Output/index';
import Footer from './Footer';
import examples from './examples';
import { dirname, extname, resolve } from './utils/path';
import examplesMatch from './utils/examplesMatch';

// recover state from hash fragment
const json = window.location.hash.slice( 1 );
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
	// do nothing
}

const input = new Input({
	el: '.input',
	data: {
		examples,
		selectedExample
	}
});

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

const footer = new Footer({
	el: 'footer'
});

function update () {
	const modules = input.get( 'modules' );
	const options = output.get( 'options' );

	let moduleById = {};

	modules.forEach( module => {
		moduleById[ module.name ] = module;
	});

	// save state as hash fragment
	window.location.hash = JSON.stringify({ options, modules });

	/*global rollup */
	rollup.rollup({
		entry: '@main',
		resolveId ( importee, importer ) {
			if ( !importer ) return importee;
			if ( importee[0] !== '.' ) return undefined;
			return resolve( dirname( importer ), importee );
		},
		load: function ( id ) {
			if ( id === '@main' ) return modules[0].code;
			if ( id.substr( 0, 2 ) === './' ) id = id.substring( 2 );

			if ( extname( id ) === '' ) {
				id += '.js';
			}

			const module = moduleById[ id ];

			if ( !module ) throw new Error( `missing module ${id}` ); // TODO...

			return module.code;
		}
	}).then( bundle => {
		const generated = bundle.generate( options );

		output.set( 'code', generated.code );
		output.set( 'error', null );
	})
	.catch( error => output.set( 'error', error ) );
}

input.observe( 'modules', update );
output.observe( 'options', update );
