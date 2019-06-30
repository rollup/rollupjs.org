<script>
	import Editor from '../_Editor/index.svelte';
	import Status from './Status.svelte';
	import BundleOptions from './BundleOptions.svelte';

	export let options;
	export let output;
	export let error = null;
	export let warnings;
	export let waiting;
</script>

<style>
	.output {
		margin: 0 0 1em 0;
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

<Status {error} {warnings} {waiting} />

<BundleOptions bind:options {output} {error}/>

{#if !error}
	{#each output as chunk}
		<article class='output'>
			{#if output.length > 1}
				<header>
					<span class='module-name'>{chunk.fileName}</span>
				</header>
			{/if}

			<Editor code={chunk.code} readonly/>
		</article>
	{/each}
{/if}
