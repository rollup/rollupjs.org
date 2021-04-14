import { derived } from 'svelte/store';
import rollup from './rollup';
import modules from './modules';
import options from './options';
import { dirname, resolve } from '../helpers/path';
import { getFileNameFromMessage } from '../helpers/messages';

let bundleDebounceTimeout;
let nextBundleRequest = null;
let completedRequestHash = '';

function logWarning(message) {
	console.group(getFileNameFromMessage(message) || '');
	console.warn(message);
	console.groupEnd();
}

function hashOptionsAndRollupVersion({ $options, $rollup: { VERSION } }) {
	return JSON.stringify({ o: $options, v: VERSION });
}

// TODO instead of debouncing we should bundle in a worker
function requestBundle(bundleRequest) {
	// We are currently bundling, queue this request for when we are done
	if (nextBundleRequest) {
		nextBundleRequest = bundleRequest;
		return;
	}
	// Otherwise, restart the debounce timeout
	clearTimeout(bundleDebounceTimeout);
	if (bundleRequest.$rollup.error) {
		bundleRequest.set({ output: [], warnings: [], error: bundleRequest.$rollup.error });
		return;
	}
	if (!bundleRequest.$rollup.rollup) {
		return;
	}
	bundleDebounceTimeout = setTimeout(
		async () => {
			nextBundleRequest = bundleRequest;
			await bundle(bundleRequest);
			completedRequestHash = hashOptionsAndRollupVersion(bundleRequest);
			const currentBundleRequest = nextBundleRequest;
			nextBundleRequest = null;
			if (currentBundleRequest !== bundleRequest) {
				requestBundle(currentBundleRequest);
			}
		},
		// Do not debounce on Rollup version or options change
		completedRequestHash === hashOptionsAndRollupVersion(bundleRequest) ? 100 : 0
	);
}

async function bundle({
	$rollup: { rollup, VERSION, supportsCodeSplitting, supportsInput },
	$modules,
	$options,
	set
}) {
	if (!$modules.length) {
		return;
	}
	console.clear();
	console.log(`running Rollup version %c${VERSION}`, 'font-weight: bold');

	let moduleById = {};
	for (const module of $modules) {
		moduleById[module.name] = module;
	}

	const warnings = [];
	const inputOptions = {
		plugins: [
			{
				resolveId(importee, importer) {
					if (!importer) return importee;
					if (importee[0] !== '.') return false;

					let resolved = resolve(dirname(importer), importee).replace(/^\.\//, '');
					if (resolved in moduleById) return resolved;

					resolved += '.js';
					if (resolved in moduleById) return resolved;

					throw new Error(`Could not resolve '${importee}' from '${importer}'.`);
				},
				load: function (id) {
					return moduleById[id].code;
				}
			}
		],
		onwarn(warning) {
			warnings.push(warning);
			logWarning(warning);
		}
	};
	if (supportsCodeSplitting) {
		inputOptions.input = $modules
			.filter((module, index) => index === 0 || module.isEntry)
			.map(module => module.name);
	} else {
		inputOptions[supportsInput ? 'input' : 'entry'] = 'main.js';
	}

	try {
		const generated = await (await rollup(inputOptions)).generate($options);
		set({ output: supportsCodeSplitting ? generated.output : [generated], warnings, error: null });
	} catch (error) {
		set({ output: [], warnings, error });
		logWarning({ ...error });
	}
}

export default derived(
	[rollup, modules, options],
	([$rollup, $modules, $options], set) => {
		requestBundle({
			$rollup,
			$modules,
			$options,
			set
		});
	},
	{ output: [], warnings: [], error: null }
);
