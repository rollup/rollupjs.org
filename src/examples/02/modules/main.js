import { getStringTag } from './unbind';
import { arrayTag } from './tags';

console.log( getStringTag( [] ) === arrayTag ); // true
