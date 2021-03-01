<script context="module">
	export function preload() {
		return this.fetch(`api/examples.json`)
			.then(r => r.json())
			.then(examples => ({ examples }));
	}
</script>

<script>
	import Repl from '../../components/Repl.svelte';
	export let examples = [];
</script>

<Repl examples="{examples}" />
