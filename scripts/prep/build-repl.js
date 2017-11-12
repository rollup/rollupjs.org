const { copy } = require( './utils.js' );

module.exports = () => {
	copy( `node_modules/codemirror/lib/codemirror.css`, `public/codemirror.css` );
};