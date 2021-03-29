<script>
	import Editor from './ReplEditor.svelte';
	import Status from './ReplStatus.svelte';
	import BundleOptions from './ReplBundleOptions.svelte';
	import rollupOutput from '../stores/rollupOutput';
</script>

<Status />

<BundleOptions />

{#if !$rollupOutput.error}
	{#each $rollupOutput.output as chunk}
		<article class="output">
			{#if $rollupOutput.output.length > 1}
				<header>
					<span class="module-name">{chunk.fileName}</span>
				</header>
			{/if}

			<Editor code="{chunk.code}" readonly />
		</article>
	{/each}
{/if}

<style>
	.output {
		margin: 0 0 0.5rem 0;
		border: 1px solid #eee;
	}

	.module-name {
		display: block;
		padding: 0.5em;
	}

	header {
		width: 100%;
		border-bottom: 1px solid #f4f4f4;
	}
</style>
