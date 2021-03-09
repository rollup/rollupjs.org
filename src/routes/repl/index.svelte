<script context="module">
	export function preload() {
		return this.fetch(`api/examples.json`)
			.then(r => r.json())
			.then(examples => ({ examples }));
	}
</script>

<script>
	import Repl from '../../components/Repl.svelte';
	import examplesStore from '../../stores/examples';
	export let examples = [];
	$: $examplesStore = examples;
</script>

<Repl />
