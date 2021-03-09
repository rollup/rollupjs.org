<script>
	import selectedExample from '../stores/selectedExample';
	import examples from '../stores/examples';
	import modules from '../stores/modules';

	let selectedExampleModules = [];

	$: clearSelectedExampleOnModulesChange($modules);
	$: updateModulesOnExampleSelection($selectedExample);

	function clearSelectedExampleOnModulesChange(modules) {
		if (
			$selectedExample &&
			(modules.length !== selectedExampleModules.length ||
				selectedExampleModules.some((module, index) => {
					const currentModule = modules[index];
					return (
						currentModule.name !== module.name ||
						currentModule.code !== module.code ||
						currentModule.isEntry !== module.isEntry
					);
				}))
		) {
			$selectedExample = null;
		}
	}

	function updateModulesOnExampleSelection(selectedExample) {
		if (selectedExample) {
			selectedExampleModules = $examples.find(({ id }) => id === selectedExample).modules;
			$modules = selectedExampleModules.map(module => ({ ...module }));
		}
	}

	function clear() {
		$selectedExample = null;
		$modules = [{ name: 'main.js', code: '', isEntry: true }];
	}
</script>

<header class="start-here clearfix">
	<select bind:value="{$selectedExample}">
		<option disabled selected value="{null}">Select an example...</option>
		{#each $examples as example}
			<option value="{example.id}">{example.title}</option>
		{/each}
	</select>

	<button class="start-over" on:click="{clear}">Start over</button>
</header>

<style>
	select {
		font-size: inherit;
		font-family: inherit;
		position: relative;
		border: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border-radius: 0;
		padding: 0.5em 3em 0.5em 0.5em;
		margin-bottom: 1em;
		background: #eee url(/images/select-arrow.svg) no-repeat 100% 50%;
		background-size: auto 100%;
		outline: none;
	}

	@media (min-width: 400px) {
		.start-over {
			float: right;
		}
	}
</style>
