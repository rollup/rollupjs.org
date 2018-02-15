/* DEFAULT EXPORTS
   Default exports from the 'entry module' are
   exported from the bundle */
import answer from './answer.js';

export default function () {
	console.log( 'the answer is ' + answer );
}
