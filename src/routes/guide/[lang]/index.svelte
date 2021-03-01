<script context="module">
	export function preload({ params }) {
		return this.fetch(`guide/${params.lang}.json`)
			.then(r => r.json())
			.then(sections => ({
				sections,
				lang: params.lang
			}));
	}
</script>

<script>
	import Guide from '../../../components/Guide.svelte';
	export let sections = [];
	export let lang;
</script>

<Guide sections="{sections}" lang="{lang}" />
