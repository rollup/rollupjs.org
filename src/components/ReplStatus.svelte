<script>
	import rollup from '../stores/rollup';
	import rollupOutput from '../stores/rollupOutput';
	import ReplStatusMessage from './ReplStatusMessage.svelte';

	let error, warnings, waiting;
	$: waiting = !$rollup.rollup;
	$: ({ error, warnings } = $rollupOutput);
</script>

<div
	class="status {waiting ? 'waiting' : error ? 'error' : warnings.length ? 'warnings' : 'success'}"
>
	<span>
		{#if waiting}
			<span class="icon icon-attention"></span>
			Loading Rollup...
		{:else if error}
			<ReplStatusMessage message="{error}" isError />
		{:else if warnings.length}
			<span class="icon icon-attention"></span>
			Rollup completed with warnings:
			<ul class="warning-list">
				{#each warnings as warning}
					<li class="warning">
						<ReplStatusMessage message="{warning}" />
					</li>
				{/each}
			</ul>
		{:else}
			<span class="icon icon-ok"></span>
			Rollup successful!
		{/if}
	</span>
</div>

<style>
	.status {
		padding: 0.5em;
		margin: 0 0 1em 0;
		color: white;
		word-break: break-word;
	}

	.success {
		background-color: #3d9970;
	}

	.waiting {
		background-color: #4384e6;
	}

	.warnings {
		background-color: #eed245;
		color: #181818;
	}

	.warning {
		margin-top: 16px;
	}

	.error {
		background-color: #e94c43;
	}

	.status > span {
		font-size: 1em;
	}

	.warning-list {
		list-style-type: none;
		padding-inline-start: 0;
		margin-block-start: 10px;
		margin-block-end: 0;
	}
</style>
