import Input from './Input/index';
import Output from './Output/index';
import Footer from './Footer';
import examples from './examples';
import { dirname, extname, resolve } from './utils/path';

const input = new Input({
	el: '.input',
	data: { examples }
});

const output = new Output({
	el: '.output'
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

	/*global rollup */
	rollup.rollup({
		entry: 'main',
		resolveId ( importee, importer ) {
			if ( !importer ) return importee;
			if ( importee[0] !== '.' ) return undefined;

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
		const generated = bundle.generate( options );

		output.set( 'code', generated.code );
		output.set( 'error', null );
	})
	.catch( error => output.set( 'error', error ) );
}

input.observe( 'modules', update );
output.observe( 'options', update );
