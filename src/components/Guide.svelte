<script>
	import { onMount, onDestroy } from 'svelte';
	import GuideContents from './GuideContents.svelte';
	import drawerOpen from '../stores/drawerOpen';
	import currentSection from '../stores/currentSection';

	$: base = `guide/${lang}/`;

	export let sections = [];
	export let lang;
	let container;
	let params;
	let anchors = [];
	let positions = [];
	let timeouts = [];
	let lastId = '';

	function updateAnchorPositions() {
		const { top } = container.getBoundingClientRect();
		positions = anchors.map(anchor => anchor.getBoundingClientRect().top - top);
	}

	// This performs a binary search to not block scrolling too much
	function getCurrentSection() {
		const top = -window.scrollY;
		let first = 0;
		let last = positions.length - 1;

		while (first <= last) {
			const middle = Math.floor((first + last) / 2);
			if (positions[middle] + top < 40) {
				if (middle === last || positions[middle + 1] + top >= 40) {
					return middle;
				}
				first = middle + 1;
			} else {
				last = middle - 1;
			}
		}
		return 0;
	}

	function updateCurrentSection() {
		const anchor = anchors[getCurrentSection()];
		const { id } = anchor;
		if (id !== $currentSection) {
			$currentSection = id;
		}
	}

	function scrollOnHashChange() {
		const id = window.location.hash.slice(1) || $currentSection;
		if (id) {
			const element = document.getElementById(id);
			if (element) {
				window.scrollBy({ left: -Infinity, top: element.getBoundingClientRect().top - 75 });
			}
		}
	}

	onMount(() => {
		document.documentElement.lang = lang;

		anchors = Array.from(container.querySelectorAll('section[id]'))
			.concat(Array.from(container.querySelectorAll('h3[id]')))
			.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

		window.addEventListener('scroll', updateCurrentSection, true);
		window.addEventListener('resize', updateAnchorPositions, true);
		window.addEventListener('hashchange', scrollOnHashChange, true);

		// wait for fonts to load...
		timeouts = [setTimeout(updateAnchorPositions, 1000), setTimeout(updateAnchorPositions, 5000)];

		scrollOnHashChange();
		updateAnchorPositions();
		updateCurrentSection();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', updateCurrentSection, true);
			window.removeEventListener('resize', updateAnchorPositions, true);
			window.removeEventListener('hashchange', scrollOnHashChange, true);
		}

		timeouts.forEach(timeout => clearTimeout(timeout));
	});
</script>

<div bind:this="{container}" class="content">
	<div class="hero">
		<strong>rollup.js</strong>
	</div>

	{#each sections as section}
		<section id="{section.slug}">
			<h2>
				<a class="anchor" href="guide/en/#{section.slug}">
					<img src="/images/anchor.svg" alt="" />
				</a>
				{section.metadata.title}
			</h2>

			{#if section.tocItems.length > 0}
				<ul class="table-of-contents">
					{#each section.tocItems as tocItem}
						<li>
							<a href="{base}#{tocItem.id}">
								{@html tocItem.text}
							</a>

							<ul>
								{#each tocItem.subSubSections as subTocItem}
									<li>
										<a href="{base}#{subTocItem.id}">
											{@html subTocItem.text}
										</a>
									</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
			{/if}

			{@html section.html}
		</section>
	{/each}
</div>

<div class="mousecatcher" on:click="{drawerOpen.close}" class:visible="{$drawerOpen}"></div>
<div class="sidebar" class:open="{$drawerOpen}">
	<GuideContents sections="{sections}" lang="{lang}" />
</div>

<style>
	.mousecatcher {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background-color: black;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s;
		z-index: 3;
	}

	.mousecatcher.visible {
		pointer-events: all;
		opacity: 0.3;
		touch-action: none;
		overscroll-behavior: none;
	}

	.sidebar {
		position: fixed;
		left: 0;
		top: 3em;
		width: 16em;
		height: calc(100vh - 3em);
		display: block;
		background: white;
		z-index: 3;
		overflow-y: auto;
		padding: 1em;
		border-right: 1px solid #eee;
		transform: translateX(-16em);
		transition: transform 0.3s;
		overscroll-behavior: contain;
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.content {
		width: 100%;
		padding: 1em 1em 1em 1.5em;
		word-break: break-word;
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
		margin: 3rem 0 1rem -1rem;
		font-size: 1.8em;
		font-weight: 700;
		color: #333;
	}

	.table-of-contents,
	.table-of-contents ul {
		padding-left: 1.5em;
	}

	.content :global(h3) {
		margin: 4rem 0 1rem -1rem;
		font-size: 1.2em;
		font-weight: 700;
		color: #333;
	}

	.content :global(h3) :global(code) {
		font-weight: 700;
	}

	.content :global(h4) {
		margin: 2em 0 0.5em 0;
		font-size: 1em;
		font-weight: 700;
		color: #333;
	}

	.content :global(h2),
	.content :global(h3),
	.content :global(h4) {
		scroll-margin-top: 75px;
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

	.content :global(p),
	.content :global(ol) {
		margin: 0 0 1em 0;
		color: #181818;
		line-height: 1.5;
	}

	.content :global(a) {
		border-bottom: 1px solid #e3d9d9;
	}

	.content :global(a.anchor) {
		border-bottom: 0;
		position: absolute;
		left: -18px;
		padding-right: 2px;
		visibility: hidden;
		line-height: 28px;
	}

	.content :global(*:hover) > :global(a.anchor) {
		visibility: visible;
	}

	.content :global(strong) {
		font-weight: 500;
	}

	.content :global(code) {
		background-color: #f9f9f9;
		border-radius: 3px;
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
		word-break: normal;
	}

	.content :global(p),
	.content :global(ul),
	.content :global(ol) {
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

	.content :global(blockquote p:last-child) {
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
			transform: translateX(0);
		}

		.content {
			padding: 0 1em 2em 17.5em;
		}

		.hero {
			display: block;
		}

		.hero strong {
			font-size: 8em;
		}

		.mousecatcher.visible {
			display: none;
		}
	}
</style>
