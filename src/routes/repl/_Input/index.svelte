<script>
	import Module from './Module.svelte';

	export let examples = [];
	export let selectedExample = null;
	export let codeSplitting;
	export let modules = [];

	let uid = 1;
	let modulesRef;

	function removeModule(index) {
		modules.splice(index, 1);
		modules = modules;
	}

	function toggleEntryModule(index) {
		modules[index].isEntry = !modules[index].isEntry;
	}

	function createModule() {
		modules.push({
			name: `module_${uid++}.js`,
			code: ''
		});
		modules = modules;

		setTimeout(() => {
			const inputs = modulesRef.querySelectorAll('input');
			const input = inputs[inputs.length - 1];
			input.focus();
		});
	}

	function clear() {
		modules = [{ name: 'main.js', code: '', isEntry: true }];
		selectedExample = null;
	}
</script>

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

	.new-module {
		display: block;
		width: 100%;
		color: #3d9970;
		border: none;
		padding: 1em;
		margin-bottom: 0;
	}

	@media (min-width: 400px) {
		.start-over {
			float: right;
		}
	}
</style>

<header class="start-here clearfix">
	<select bind:value="{selectedExample}">
		<option disabled selected value="{null}">Select an example...</option>
		{#each examples as example}
			<option value="{example.id}">{example.title}</option>
		{/each}
	</select>

	<button class="start-over" on:click="{clear}">Start over</button>
</header>

<div bind:this="{modulesRef}" class="modules">
	{#each modules as module, i}
		<Module
			bind:name="{module.name}"
			bind:code="{module.code}"
			main="{i === 0}"
			isEntry="{codeSplitting && module.isEntry}"
			{codeSplitting}
			on:remove="{() => removeModule(i)}"
			on:toggle-entry="{() => toggleEntryModule(i)}" />
	{/each}
</div>

<button class="new-module" on:click="{createModule}">
	<span class="icon icon-plus"></span>
	add module
</button>
