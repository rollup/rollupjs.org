import { writable } from 'svelte/store';

const { subscribe, set } = writable({ version: null, type: null });

export default {
	subscribe,
	requestVersion: version => set({ version, type: 'version' }),
	requestCircleCI: version => set({ version, type: 'circleci' }),
	requestPr: version => set({ version, type: 'pr' })
};
