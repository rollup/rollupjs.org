/* DYNAMIC NAMESPACES
   In some cases, you don't know which exports will
   be accessed until you actually run the code. In
   these cases, Rollup creates a namespace object
   for dynamic lookup */
import * as constants from './constants';

Object.keys( constants ).forEach( key => {
	console.log( `The value of ${key} is ${constants[key]}` );
});
