import examples from '../examples.js';
import examplesMatch from './examplesMatch.js';

export default function recoverState () {
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
			}
		}
	} catch ( err ) {
		selectedExample = examples[0];
	}

	return { saved, selectedExample };
}