<script context="module">
	export function preload ( { params } ) {
		return this.fetch(`guide/${params.lang}.json`).then(r => r.json()).then(sections => ({
			sections,
			lang: params.lang
		}));
	}
</script>

<script>
	import {onMount, onDestroy} from 'svelte';
	import GuideContents from './GuideContents.svelte';

	export let sections = [];
	export let lang;
	let container;
	let contents;
	let params;
	let anchors = [];
	let positions = [];
	let timeouts = [];
	let lastId = '';

	function onresize () {
		const { top } = container.getBoundingClientRect();
		positions = anchors.map(anchor => anchor.getBoundingClientRect().top - top);
	}

	function onscroll () {
		const top = -window.scrollY;
		let i = anchors.length;
		while (i--) {
			if ( positions[i] + top < 40 ) {
				const anchor = anchors[i];
				const { id } = anchor;

				if ( id !== lastId ) {
					lastId = id;
					contents.$set({ active: id });
				}
				return;
			}
		}
	}

	function onhashchange ( event ) {
		const id = window.location.hash.slice(1);
		if ( id ) {
			const element = document.getElementById(id);
			if ( element ) {
				window.scrollBy({ left: -Infinity, top: element.getBoundingClientRect().top })
			}
		}
	}

	onMount(() => {
		anchors = Array.from(container.querySelectorAll('section[id]'))
				.concat(Array.from(container.querySelectorAll('h3[id]')))
				.sort(( a, b ) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

		window.addEventListener('scroll', onscroll, true);
		window.addEventListener('resize', onresize, true);
		window.addEventListener('hashchange', onhashchange, true);

		// wait for fonts to load...
		timeouts = [
			setTimeout(onresize, 1000),
			setTimeout(onresize, 5000)
		];

		onhashchange();
		onresize();
		onscroll();
	});

	onDestroy(() => {
		if ( typeof window !== 'undefined' ) {
			window.removeEventListener('scroll', onscroll, true);
			window.removeEventListener('resize', onresize, true);
			window.removeEventListener('hashchange', onhashchange, true);
		}

		timeouts.forEach(timeout => clearTimeout(timeout));
	});
</script>

<style>
	.sidebar {
		position: fixed;
		left: 0;
		top: 3.6em;
		width: 16em;
		height: calc(100vh - 3.6em);
		display: none;
		overflow-y: auto;
		padding: 1em;
		border-right: 1px solid #eee;
	}

	.content {
		width: 100%;
		padding: 1em;
	}

	.hero {
		max-width: 64em;
		margin: 0 auto 2em auto;
		border-bottom: 2px solid rgba(239, 51, 53, 0.4);
		display: none;
	}

	.hero strong {
		position: relative;
		font-weight: 400;
		left: -0.03em;
	}

	h2 {
		padding: 6rem 0 0 0;
		margin: -3rem 0 1rem -1rem;
		font-size: 1.8em;
		font-weight: 700;
		pointer-events: none;
		color: #333;
	}

	.content :global(h3) {
		padding-top: 6rem;
		margin: -3rem 0 0 -1rem;
		font-size: 1.2em;
		font-weight: 700;
		pointer-events: none;
		color: #333;
	}

	.content :global(h3) :global(code) {
		font-weight: 700;
	}

	.content :global(h4) {
		padding-top: 4em;
		margin: -3em 0 0.5em 0;
		font-size: 1em;
		font-weight: 700;
		color: #333;
		z-index: -1;
	}

	.content :global(h4) :global(code) {
		font-weight: 700;
	}

	.content :global(h4) :global(em) {
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: #666;
		position: relative;
		top: -0.1em;
	}

	.content :global(p) {
		margin: 0 0 1em 0;
		font-weight: 300;
		color: #181818;
		line-height: 1.5;
	}

	.content :global(a) {
		border-bottom: 1px solid #e3d9d9;
	}

	.content :global(strong) {
		font-weight: 500;
	}

	.content :global(code) {
		background-color: #f9f9f9;
		padding: 0.2em 0.4em;
		border-radius: 3px;
	}

	.content :global(code) {
		padding: 0;
	}

	section:first-child :global(h3) {
		border: none;
	}

	section {
		border-bottom: 1px solid #eee;
		max-width: 64em;
		margin: 0 auto 2em auto;
		padding: 0 0 4em 1em;
	}

	section:last-child {
		border: none;
	}

	.content :global(pre) {
		background-color: #f9f9f9;
		border-left: 2px solid #eee;
		margin: 0 0 1em 0;
		padding: 12px 8px 12px 12px;
		border-radius: 3px;
	}

	.content :global(p), .content :global(ul), .content :global(ol) {
		max-width: 48em;
	}

	.content :global(li) {
		margin: 0;
	}

	.content :global(blockquote) {
		position: relative;
		color: #999;
		margin: 1em 0;
		padding: 0.5em 0 0.5em 2em;
		max-width: 48em;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
	}

	.content :global(blockquote) :global(p) {
		color: #666;
	}

	.content :global(blockquote) :global(p):last-child {
		margin: 0;
	}

	.content :global(blockquote)::before {
		content: '!';
		position: absolute;
		left: 0.5em;
		top: 0.8em;
		color: rgba(170, 0, 0, 0.7);
		font-size: 0.8em;
		font-weight: 800;
		width: 1em;
		height: 1em;
		text-align: center;
		line-height: 1;
		padding: 0.15em 0.1em 0.1em 0.1em;
		border-radius: 50%;
		border: 2px solid rgba(170, 30, 30, 0.7);
	}

	@media (min-width: 768px) {
		.sidebar {
			display: block;
		}

		.content {
			padding: 0 1em 2em 17em;
		}

		.hero {
			display: block;
		}

		.hero strong {
			font-size: 8em;
		}

		h2 {
			padding: 7rem 0 0 0;
			margin: -4rem 0 1rem -1rem;
		}

		.content :global(h3) {
			padding-top: 7rem;
			margin: -5rem 0 0 -1rem;
		}
	}

</style>

<div bind:this={container} class='content'>
	<div class="hero">
		<strong>rollup.js</strong>
	</div>

    {#each sections as section}
		<section id='{section.slug}'>
			<h2>{section.metadata.title}</h2>
            {@html section.html}
		</section>
    {/each}
</div>

<div class='sidebar'>
	<GuideContents bind:this={contents} {sections} lang='{lang}'/>
</div>
