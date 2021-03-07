<script>
	import Input from './ReplInput.svelte';
	import Output from './ReplOutput.svelte';
	import { dirname, resolve } from '../helpers/path';
	import { supportsCodeSplitting, supportsInput } from '../helpers/rollupVersion';
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import rollup from '../stores/rollup';
	import selectedExample from '../stores/selectedExample';
	import examples from '../stores/examples';
	import modules from '../stores/modules';
	import options from '../stores/options';
	import { updateQuery, updateStoresFromQuery } from '../helpers/query';

	let output = [];
	let selectedExampleModules = [];
	let warnings = [];
	let error;
	const { page } = stores();

	const atob =
		typeof window === 'undefined'
			? base64 => Buffer.from(base64, 'base64').toString()
			: window.atob;

	onMount(() => updateStoresFromQuery($page.query));

	$: {
		if ($rollup.rollup) {
			error = null;
			requestBundle();
		} else if ($rollup.error) {
			error = $rollup.error;
		}
	}

	$: {
		if ($selectedExample) {
			updateSelectedExample($selectedExample);
		} else {
			selectedExampleModules = [];
		}
	}

	function updateSelectedExample(example) {
		({ modules: selectedExampleModules } = $examples.find(({ id }) => id === example));
		$modules = selectedExampleModules.map(module => ({ ...module }));
	}

	$: {
		if ($modules) {
			requestDebouncedBundle();
		}
	}

	$: {
		if ($options) {
			requestBundle();
		}
	}

	$: {
		updateQuery($modules, $options, $selectedExample, $rollup.VERSION, $page.query.circleci);
	}

	// TODO instead of debouncing, we should bundle in a worker
	let bundleDebounceTimeout;

	function requestDebouncedBundle() {
		clearTimeout(bundleDebounceTimeout);
		bundleDebounceTimeout = setTimeout(requestBundle, 100);
	}

	let bundlePromise = null;

	async function requestBundle() {
		if (!$modules.length || !$rollup.rollup) return;
		if (bundlePromise) {
			await bundlePromise;
		}
		if (
			selectedExampleModules.length &&
			($modules.length !== selectedExampleModules.length ||
				selectedExampleModules.some((module, index) => {
					const currentModule = $modules[index];
					return (
						currentModule.name !== module.name ||
						currentModule.code !== module.code ||
						currentModule.isEntry !== module.isEntry
					);
				}))
		) {
			console.log('reset selected');
			selectedExample.set(null);
		}
		bundlePromise = bundle($rollup).then(() => (bundlePromise = null));
	}

	async function bundle({ rollup, VERSION: version, supportsCodeSplitting, supportsInput }) {
		// TODO Lukas uncomment
		// console.clear();
		console.log(`running Rollup version %c${version}`, 'font-weight: bold');

		let moduleById = {};
		for (const module of $modules) {
			moduleById[module.name] = module;
		}

		warnings = [];
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

						throw new Error(`Could not resolve '${importee}' from '${importer}'`);
					},
					load: function (id) {
						return moduleById[id].code;
					}
				}
			],
			onwarn(warning) {
				warnings.push(warning);
				console.group(warning.loc ? warning.loc.file : '');
				console.warn(warning.message);

				if (warning.frame) {
					console.log(warning.frame);
				}

				if (warning.url) {
					console.log(`See ${warning.url} for more information`);
				}

				console.groupEnd();
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

			if (supportsCodeSplitting) {
				output = generated.output;
				error = null;
			} else {
				output = [generated];
				error = null;
			}
		} catch (err) {
			error = err;
			if (error.frame) console.log(error.frame);
			setTimeout(() => {
				throw error;
			});
		}
	}
</script>

<div class="repl">
	<div class="left">
		<h2>ES6 modules go in...</h2>
		<div class="input">
			<Input />
		</div>
	</div>
	<div class="right">
		<h2>
			...
			{#if output.length > 1}chunks come{:else}bundle comes{/if}
			out
		</h2>
		<div class="output">
			<Output output="{output}" error="{error}" warnings="{warnings}" />
		</div>
	</div>
</div>

<style>
	.repl {
		height: calc(100% - 3.6em);
	}

	.left,
	.right {
		width: 100%;
		padding: 1em;
	}

	:global(button) {
		font-family: inherit;
		font-size: inherit;
		border: none;
		outline: none;
		cursor: pointer;
		background-color: #eee;
		padding: 0.5em 1em;
		margin-bottom: 1em;
	}

	:global(button):hover,
	:global(button):active {
		background-color: #eaeaea;
	}

	:global(button):disabled {
		cursor: default;
	}

	:global(.icon) {
		font-size: 0.8em;
	}

	:global(input) {
		display: block;
		width: 100%;
		font-family: inherit;
		font-size: inherit;
		padding: 0.5em;
		border: none;
		outline: none;
		line-height: 1;
		color: #333;
		background-color: inherit;
	}

	:global(input):focus {
		background-color: #eaeaea;
	}

	@media (min-width: 45rem) {
		.left,
		.right {
			width: 50%;
			height: 100%;
			float: left;
			overflow-y: auto;
		}
	}
</style>
