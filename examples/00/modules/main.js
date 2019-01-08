/* DYNAMIC IMPORTS
   Rollup supports automatic chunking and lazy-loading
   via dynamic imports utilizing the import mechanism
   of the host system. */
if (displayMath) {
	import('./maths.js').then(function (maths) {
		console.log(maths.square(5));
		console.log(maths.cube(5));
	});
}
