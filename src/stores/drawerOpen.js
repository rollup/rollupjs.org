import { writable } from 'svelte/store';

const { subscribe, set, update } = writable(false);

export default {
	subscribe,
	toggle: () => update(open => !open),
	close: () => set(false)
};
