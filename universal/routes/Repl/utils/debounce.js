export default function ( fn, ms ) {
	let timeout;

	return function () {
		clearTimeout( timeout );
		timeout = setTimeout( fn, ms || 250 );
	};
}
