<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
	const langs = ['en', 'sk', 'zh'];
</script>

<svelte:head>
	<title>rollup.js</title>
</svelte:head>

<div class="layout">
	<Nav page="{segment === 'repl' ? 'repl' : 'guide'}" />
	<slot />
</div>

<!-- hidden links, to ensure `sapper export` works as expected -->
<a hidden href="guide">Guide</a>
{#each langs as lang}<a hidden href="guide/{lang}">{lang}</a>{/each}

<style>
	.layout {
		padding: 3em 0 0 0;
	}

	@media (min-width: 768px) {
		.layout {
			padding: 3.6em 0 0 0;
		}
	}
</style>
