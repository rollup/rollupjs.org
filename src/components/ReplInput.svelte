<script>
	import Module from './ReplInputModule.svelte';
	import Header from './ReplInputHeader.svelte';
	import modules from '../stores/modules';
	let uid = 1;
	let modulesRef;

	function removeModule(index) {
		modules.update(modules => {
			modules.splice(index, 1);
			return modules;
		});
	}

	function toggleEntryModule(index) {
		$modules[index].isEntry = !$modules[index].isEntry;
	}

	function createModule() {
		modules.update(modules => {
			modules.push({
				name: `module_${uid++}.js`,
				code: ''
			});
			return modules;
		});

		setTimeout(() => {
			const inputs = modulesRef.querySelectorAll('input');
			const input = inputs[inputs.length - 1];
			input.focus();
		});
	}
</script>

<Header />

<div bind:this="{modulesRef}" class="modules">
	{#each $modules as module, i}
		<Module
			bind:name="{module.name}"
			bind:code="{module.code}"
			main="{i === 0}"
			isEntry="{module.isEntry}"
			on:remove="{() => removeModule(i)}"
			on:toggle-entry="{() => toggleEntryModule(i)}"
		/>
	{/each}
</div>

<button class="new-module" on:click="{createModule}">
	<span class="icon icon-plus"></span>
	add module
</button>

<style>
	.new-module {
		display: block;
		width: 100%;
		color: #3d9970;
		border: none;
		padding: 0;
		margin-bottom: 0;
		line-height: 2.25rem;
	}
</style>
