import { writable } from 'svelte/store';

const options = writable({
	format: 'es',
	name: 'myBundle',
	amd: { id: '' },
	globals: {}
});

export default {
	...options,
	set(value) {
		options.set(value.format === 'esm' ? { ...value, format: 'es' } : value);
	}
};
