export function equal ( a, b, msg ) {
	if ( !msg ) msg = format( '%s does not equal %s', a, b );
	if ( a != b ) throw new Error( msg );
}

export function ok ( value, msg ) {
	if ( !msg ) msg = format( '%s is not truthy', value );
	if ( !value ) throw new Error( msg );
}

export function format ( str, ...args ) {
	return str.replace( /%s/g, () => args.shift() );
}
