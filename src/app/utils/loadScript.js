export default function loadScript ( src ) {
	return new Promise( function ( fulfil, reject ) {
		var script = document.createElement( 'script' );
		script.onload = fulfil;
		script.onerror = reject;

		script.src = src;

		document.querySelector( 'head' ).appendChild( script );
	});
}