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

<header>
	<select bind:value="{$selectedExample}">
		<option disabled selected value="{null}">Select an example...</option>
		{#each $examples as example}
			<option value="{example.id}">{example.title}</option>
		{/each}
	</select>

	<button class="start-over" on:click="{clear}">Start over</button>
</header>

<style>
	header {
		margin-bottom: 1.25rem;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		column-gap: 0.5rem;
	}

	select {
		font-size: inherit;
		font-family: inherit;
		position: relative;
		border: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border-radius: 0;
		padding: 0 2.5rem 0 0.5rem;
		background: #eee url(/images/select-arrow.svg) no-repeat 100% 50%;
		background-size: auto 100%;
		outline: none;
		line-height: 2.25rem;
	}

	select,
	.start-over {
		margin-bottom: 0.25rem;
	}

	@media (min-width: 400px) {
		.start-over {
			float: right;
		}
	}
</style>
