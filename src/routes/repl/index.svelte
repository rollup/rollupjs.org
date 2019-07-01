<script context="module">
	export function preload() {
		return this.fetch(`api/examples.json`).then(r => r.json()).then(examples => ({ examples }));
	}
</script>

<script>
	import Input from './_Input/index.svelte';
	import Output from './_Output/index.svelte';
	import {dirname, resolve} from './_utils/path';
	import {supportsCodeSplitting, supportsInput} from './_utils/rollupVersion';
    import { onMount } from 'svelte';
    import { stores } from '@sapper/app';
    import { get } from 'svelte/store';

	export let examples = [];
	let output = [];
	let options = {
		format: 'cjs',
		name: 'myBundle',
		amd: { id: '' },
		globals: {}
	};
	let codeSplitting = false;
	let selectedExample = null;
	let selectedExampleModules = [];
	let modules = [];
	let warnings = [];
	let input;
	let rollup;
	let error;

	function getUrlRollupVersion() {
	  if (typeof window === 'undefined') return null;
	  const versionMatch = /version=([^&]+)/.exec(window.location.search);
	  return versionMatch && versionMatch[1];
	}

	const urlRollupVersion = getUrlRollupVersion();

	const atob = typeof window ==='undefined'
		? base64 => Buffer.from(base64, 'base64').toString()
		: window.atob;

	function loadRollup () {
		const url = urlRollupVersion ?
			`https://unpkg.com/rollup@${urlRollupVersion}/dist/rollup.browser.js` :
			'https://unpkg.com/rollup/dist/rollup.browser.js';

    	return new Promise(( fulfil, reject ) => {
    		const script = document.createElement('script');
    		script.src = url;
    		script.onload = () => {
    			fulfil(window.rollup);
    		};
    		script.onerror = reject;
    		document.querySelector('head').appendChild(script);
    	});
    }

    onMount(async () => {
    	const {query} = get(stores().page);
        try {
        	if ( query.shareable ) {
        		const json = decodeURIComponent(atob(query.shareable));
        		({modules, options, example: selectedExample} = JSON.parse(json));
        		input.$set({modules, selectedExample});
        	} else if ( query.gist ) {
        		const result = await (await fetch(`https://api.github.com/gists/${query.gist}`, {
        			method: 'GET',
        			headers: { Accept: 'application/vnd.github.v3+json' }
        		})).json();
        		const entryModules = query.entry ? query.entry.split(',') : [];
        		modules = [result.files['main.js'] || { filename: 'main.js', content: '' }]
        			.concat(Object.keys(result.files)
        				.filter(fileName => fileName !== 'main.js')
        				.map(fileName => result.files[fileName])
        			).map(module => ({
        				name: module.filename,
        				code: module.content,
        				isEntry: entryModules.indexOf(module.filename) >= 0
        			}));
        	} else {
        		selectedExample = '00';
        	}
        } catch (err) {
        	console.error(err);
        	selectedExample = '00';
        }

		rollup = await loadRollup();
		codeSplitting = rollup && supportsCodeSplitting(rollup.VERSION);
		return requestBundle();
    });

	$: {
	    if (selectedExample) {
	        updateSelectedExample();
	    }
	}

	function updateSelectedExample() {
		fetch(`api/examples/${selectedExample}.json`).then(r => r.json()).then(example => {
        	modules = example.modules;
        	selectedExampleModules = modules.map(module => ({...module}))
        });
        input.$set({modules, selectedExample});
	}

	$: {
	  if (modules) {
	    requestDebouncedBundle();
	  }
	}

	$: {
	  if (options) {
	    requestBundle();
	  }
	}

    // TODO instead of debouncing, we should bundle in a worker
	let bundleDebounceTimeout;
	function requestDebouncedBundle() {
		clearTimeout(bundleDebounceTimeout);
		bundleDebounceTimeout = setTimeout(requestBundle, 100);
	}

	let bundlePromise = null;
	async function requestBundle() {
		if (!modules.length || !rollup) return;
		if (bundlePromise) {
		  await bundlePromise;
		}
		bundlePromise = bundle().then(() => bundlePromise = null);
	}

	async function bundle () {
		console.clear();
		console.log(`running Rollup version %c${rollup.VERSION}`, 'font-weight: bold');
		if (selectedExample && selectedExampleModules.length) {
		  if (modules.length !== selectedExampleModules.length || selectedExampleModules.some((module, index) => {
		    const currentModule = modules[index];
		    return currentModule.name !== module.name ||
		        currentModule.code !== module.code ||
		        currentModule.isEntry !== module.isEntry;
		  })) {
		    selectedExample = null;
		    selectedExampleModules = [];
		  }
		}

		updateUrl();

		let moduleById = {};

		modules.forEach(module => {
			moduleById[module.name] = module;
		});

		warnings = [];
		const inputOptions = {
			plugins: [{
				resolveId ( importee, importer ) {
					if ( !importer ) return importee;
					if ( importee[0] !== '.' ) return false;

					let resolved = resolve(dirname(importer), importee).replace(/^\.\//, '');
					if ( resolved in moduleById ) return resolved;

					resolved += '.js';
					if ( resolved in moduleById ) return resolved;

					throw new Error(`Could not resolve '${importee}' from '${importer}'`);
				},
				load: function ( id ) {
					return moduleById[id].code;
				}
			}],
			onwarn ( warning ) {
				warnings.push(warning);

				console.group(warning.loc ? warning.loc.file : '');

				console.warn(warning.message);

				if ( warning.frame ) {
					console.log(warning.frame);
				}

				if ( warning.url ) {
					console.log(`See ${warning.url} for more information`);
				}

				console.groupEnd();
			}
		};
		if ( codeSplitting ) {
			inputOptions.input = modules
				.filter(( module, index ) => index === 0 || module.isEntry)
				.map(module => module.name);
		} else {
			inputOptions[supportsInput(rollup.VERSION) ? 'input' : 'entry'] = 'main.js';
		}

		try {
			const generated = await (await rollup.rollup(inputOptions)).generate(options);

			if ( codeSplitting ) {
				output = generated.output;
				error = null;
			} else {
			    output = [generated];
				error = null;
			}
		} catch (err) {
			error = err;
			if ( error.frame ) console.log(error.frame);
			setTimeout(() => {
				throw error;
			});
		}
	}

	function updateUrl () {
    	if ( typeof history === 'undefined' ) return;

    	const params = {};
    	if ( typeof rollup !== 'undefined' ) {
    		params.version = rollup.VERSION;
    	} else if ( urlRollupVersion ) {
    		params.version = urlRollupVersion;
    	}

    	const json = JSON.stringify({
    		modules,
    		options,
    		example: selectedExample
    	});
    	params.shareable = btoa(encodeURIComponent(json));
    	const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    	const url = `/repl/?${queryString}`;
    	window.history.replaceState({}, '', url);
    }
</script>

<style>
	.repl {
		height: calc(100% - 3.6em);
	}

	.left, .right {
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

	:global(button):hover, :global(button):active {
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
		.left, .right {
			width: 50%;
			height: 100%;
			float: left;
			overflow-y: auto;
		}
	}
</style>

<div class='repl'>
	<div class='left'>
		<h2>ES6 modules go in...</h2>
		<div class='input'>
		    <Input {examples} {codeSplitting} bind:selectedExample bind:modules bind:this={input}/>
		</div>
	</div>
	<div class='right'>
	    <h2>...{#if output.length > 1}chunks come{:else}bundle comes{/if} out</h2>
		<div class='output'>
			<Output bind:options {output} {error} {warnings} waiting={!rollup}/>
		</div>
	</div>
</div>

<!-- trick Sapper into generating example JSON files -->
{#each examples as example}
    <a hidden href="api/examples/{example.id}.json">{example.title}</a>
{/each}
