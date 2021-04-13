import { derived } from 'svelte/store';
import rollupRequest from './rollupRequest';
import { supportsCodeSplitting, supportsInput } from '../helpers/rollupVersion';

async function getRollupUrl({ type, version }) {
	if (type === 'circleci') {
		const artifacts = await (
			await fetch(`https://circleci.com/api/v1.1/project/github/rollup/rollup/${version}/artifacts`)
		).json();
		const artifact =
			Array.isArray(artifacts) &&
			artifacts.find(artifact => artifact.path.endsWith('rollup.browser.js'));
		if (!artifact) {
			throw new Error('Invalid CircleCI build number.');
		}
		return artifact.url;
	} else if (type === 'pr') {
		return `https://rollup-ci-artefacts.s3.amazonaws.com/${version}/rollup.browser.js`;
	} else {
		return version
			? `https://unpkg.com/rollup@${version}/dist/rollup.browser.js`
			: 'https://unpkg.com/rollup/dist/rollup.browser.js';
	}
}

async function loadRollup($rollupRequest) {
	const url = await getRollupUrl($rollupRequest);
	return new Promise(async (fulfil, reject) => {
		const script = document.createElement('script');
		script.src = url;
		script.onload = () => {
			fulfil(window.rollup);
		};
		script.onerror = () => reject(new Error(`Could not load Rollup from ${url}`));
		document.querySelector('head').appendChild(script);
	});
}

let currentRollupRequest = { version: null, type: null };

function isRollupRequestCurrent($rollupRequest) {
	return (
		$rollupRequest.type === currentRollupRequest.type &&
		$rollupRequest.version === currentRollupRequest.version
	);
}

export default derived(
	rollupRequest,
	async ($rollupRequest, set) => {
		if ($rollupRequest.type && !isRollupRequestCurrent($rollupRequest)) {
			currentRollupRequest = $rollupRequest;
			try {
				const rollup = await loadRollup($rollupRequest);
				if (isRollupRequestCurrent($rollupRequest)) {
					set({
						...rollup,
						supportsCodeSplitting: supportsCodeSplitting(rollup.VERSION),
						supportsInput: supportsInput(rollup.VERSION),
						error: false
					});
				}
			} catch (error) {
				if (isRollupRequestCurrent($rollupRequest)) {
					set({ error });
				}
			}
		}
	},
	{}
);
