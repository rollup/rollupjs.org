export default function examplesMatch ( exampleModules, saved ) {
	let i = saved.length;
	if ( !i ) return false;

	let name;

	while ( i-- ) {
		name = saved[i].name.replace( /\.js$/, '' );

		const a = exampleModules[ name ];
		const b = saved[i].code;

		if ( !a ) return false;
		if ( a.trim() !== b.trim() ) return false;
	}

	return true;
}
