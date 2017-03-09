let promise;

export default function loadCodemirror () {
	if ( !promise ) {
		promise = window.loadScript( '/codemirror/lib/codemirror.js' )
			.then( () => window.loadScript( '/codemirror/mode/javascript/javascript.js' ) );
	}

	return promise;
}