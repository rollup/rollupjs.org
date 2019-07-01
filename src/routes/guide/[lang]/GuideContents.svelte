<script>
	export let sections;
	export let lang;

	export let active = null;
	$: base =  `guide/${lang}/`;

	function scrollActiveIntoView() {
		const element = document.getElementById('link' + active);
		const sidebar = document.querySelector('.sidebar');
		if (element) {
			const {top, bottom} = element.getBoundingClientRect();
			const {top: sidebarTop, bottom: sidebarBottom} = sidebar.getBoundingClientRect();
			if (top < sidebarTop) {
				sidebar.scrollBy({top: top - sidebarTop - 20, behavior: 'smooth'});
			} else if (bottom > sidebarBottom) {
				sidebar.scrollBy({top: bottom - sidebarBottom + 20, behavior: 'smooth'});
			}
		}
	}

	$: {
	    if (active) {
		    scrollActiveIntoView();
	    }
	}
</script>

<style>
	.guide-toc {
		margin: 0;
		padding: 0 0 0 1em;
	}

	.guide-toc li {
		display: block;
		list-style: none;
		margin: 0 0 0.5em 0;
		line-height: 1.2;
	}

	.section {
		display: block;
		font-weight: 700;
		color: #333;
		font-size: 1rem;
		margin: 0 0 0.5em 0;
	}

	/*.subsection {
		display: block;
		font-weight: 500;
		color:#727272;
		font-size: 1em;
		margin: 0 0 0.15em 0;
	}*/

	.section.active, .subsection.active {
		color: rgba(239,51,53,1);
	}

	li::before {
		position: absolute;
		left: -1em;
		content: '»';
		color: #ccc;
	}

	.subsections {
		padding: 0 0 0 0.5em;
		margin: 0;
	}

	.subsections li {

	}

	.subsection {
		color: #666;
	}

	.subsections li::before {
		content: '';
	}
</style>

<ul class='guide-toc'>
	{#each sections as section}
		<li>
			<a class='section {section.slug === active ? "active": ""}' href='{base}#{section.slug}' id='link{section.slug}'>{section.metadata.title}</a>

			<ul class='subsections'>
				{#each section.subsections as subsection}
					<li>
						<a class='subsection {subsection.slug === active ? "active": ""}' href='{base}#{subsection.slug}' id='link{subsection.slug}'>{subsection.title}</a>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
