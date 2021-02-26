import { writable } from 'svelte/store';

function createDrawerOpen() {
	const { subscribe, set, update } = writable(false);

	return {
		subscribe,
		toggle: () => update(open => !open),
		close: () => set(false)
	};
}

export const drawerOpen = createDrawerOpen();
