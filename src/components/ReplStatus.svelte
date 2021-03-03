<script>
	import rollup from '../stores/rollup';
	export let error;
	export let warnings;

	let waiting;
	$: {
		waiting = !$rollup.rollup;
	}
</script>

<div class="status {error ? 'error' : waiting ? 'waiting' : 'success'}">
	<span>
		{#if error}
			<span class="icon icon-error"></span>
			<strong>{error.name}:</strong>
			{error.message}
		{:else if waiting}
			<span class="icon icon-attention"></span>
			Loading Rollup...
		{:else}
			<span class="icon icon-ok"></span>
			Rollup successful!

			{#if warnings.length}
				({warnings.length}
				{warnings.length === 1 ? 'warning' : 'warnings'}
				— check the console)
			{/if}
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

	.error {
		background-color: #e94c43;
	}

	.status > span {
		font-size: 1em;
	}
</style>
