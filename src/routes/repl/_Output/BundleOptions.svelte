<script>
	export let options;
	export let output = [];
	export let error;

	let formats = [
		{ name: 'es', value: 'es' },
		{ name: 'amd', value: 'amd' },
		{ name: 'cjs', value: 'cjs' },
		{ name: 'iife', value: 'iife' },
		{ name: 'umd', value: 'umd' },
		{ name: 'system', value: 'system' }
	];
	let sortedImports = [];

	const defaultGlobals = {
		jquery: 'jQuery'
	};

	let userGlobals = {};

	$: sortedImports = getSortedImports(output, options);

	function getSortedImports(output, options) {
		const { format } = options;
		if ((format !== 'iife' && format !== 'umd') || output.length === 0) return [];
		return output[0].imports
			.sort((a, b) => (a < b ? -1 : 1))
			.map(name => ({
				name,
				value: userGlobals[name] || defaultGlobals[name] || name
			}));
	}

	function setFormat(format) {
		options.format = format;
	}
</script>

<style>
	.options {
		margin: 0 0 1em 0;
		border: 1px solid #eee;
	}

	button {
		display: block;
		width: 16.666666666666668%;
		float: left;
		/*height: 100%;*/
		padding: 0.75em 0;
		font-size: 0.8em;
		margin: 0;
	}

	.selected {
		background-color: #ccc;
		font-weight: bold;
	}

	section {
		border-bottom: 1px solid #eee;
	}

	section:last-child {
		border: none;
	}

	h3 {
		padding: 0.5rem;
		margin: 0;
		font-size: 1em;
		font-weight: 700;
	}

	input {
		padding-left: 1.5em;
		background-color: #eee;
	}

	section code {
		position: absolute;
		display: block;
		right: 0;
		top: 1px;
		padding: 0.5em 0.5em 0.5em 1.5em;
		line-height: 1;
	}
</style>

<div class="options">
	<section class="clearfix">
		<h3>options.format</h3>
		{#each formats as format, i}
			<button
				class="{format.value === options.format ? 'selected' : ''}"
				on:click="{() => setFormat(format.value)}">
				{format.name}
			</button>
		{/each}
	</section>

	{#if !error}
		{#if options.format === 'amd' || options.format === 'umd'}
			<section>
				<h3>options.amd.id</h3>
				<input bind:value="{options.amd.id}" placeholder="leave blank for anonymous module" />
			</section>
		{/if}

		{#if output[0] && (options.format === 'iife' || options.format === 'umd')}
			{#if output[0].exports.length}
				<section>
					<h3>options.name</h3>
					<input bind:value="{options.name}" />
				</section>
			{/if}

			{#if sortedImports.length}
				<section>
					<h3>options.globals</h3>
					{#each sortedImports as x (x.name)}
						<div><input bind:value="{options.globals[x.name]}" /> <code>'{x.name}'</code></div>
					{/each}
				</section>
			{/if}
		{/if}
	{/if}
</div>
