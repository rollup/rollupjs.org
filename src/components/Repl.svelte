<script>
	import Input from './ReplInput.svelte';
	import Output from './ReplOutput.svelte';
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	import rollup from '../stores/rollup';
	import selectedExample from '../stores/selectedExample';
	import modules from '../stores/modules';
	import options from '../stores/options';
	import rollupOutput from '../stores/rollupOutput';
	import rollupRequest from '../stores/rollupRequest';
	import { updateQuery, updateStoresFromQuery } from '../helpers/query';

	const { page } = stores();

	onMount(() => updateStoresFromQuery($page.query, $modules.length > 0));

	$: updateQuery($modules, $options, $selectedExample, $rollupRequest, $rollup.VERSION);
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
			{#if $rollupOutput.output.length > 1}chunks come{:else}bundle comes{/if}
			out
		</h2>
		<div class="output">
			<Output />
		</div>
	</div>
</div>

<style>
	h2 {
		white-space: nowrap;
		margin-bottom: 0.25rem;
	}

	.repl {
		height: calc(100% - 3.6em);
		--warning-color: #181818;
		--warning-background: #eed245;
		--error-color: white;
		--error-background: #e94c43;
	}

	.left,
	.right {
		width: 100%;
		padding: 1rem;
	}

	:global(button) {
		font-family: inherit;
		font-size: inherit;
		border: none;
		outline: none;
		cursor: pointer;
		background-color: #eee;
		padding: 0 1rem;
		line-height: 2.25rem;
		white-space: nowrap;
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
