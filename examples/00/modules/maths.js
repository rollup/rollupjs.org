import square from './square.js';

export {default as square} from './square.js';

export function cube (x ) {
	return square(x) * x;
}
