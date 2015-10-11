let now;

if ( window.performance && typeof window.performance.now === 'function' ) {
	now = () => window.performance.now();
} else if ( typeof Date.now === 'function' ) {
	now = () => Date.now();
} else {
	now = () => new Date().getTime();
}

export default now;
