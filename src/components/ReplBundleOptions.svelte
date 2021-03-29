<script>
	import options from '../stores/options';
	import rollupOutput from '../stores/rollupOutput';

	const formats = [
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

	$: sortedImports = getSortedImports($rollupOutput.output, $options);

	function getSortedImports(output, options) {
		const { format } = options;
		if ((format !== 'iife' && format !== 'umd') || output.length === 0) return [];
		return output[0].imports.sort((a, b) => (a < b ? -1 : 1));
	}

	function setFormat(format) {
		$options.format = format;
	}
</script>

<div class="options">
	<section>
		<h3>output.format</h3>
		<div class="option-buttons">
			{#each formats as format, i}
				<button
					class:selected="{format.value === $options.format}"
					on:click="{() => setFormat(format.value)}"
				>
					{format.name}
				</button>
			{/each}
		</div>
	</section>

	{#if !$rollupOutput.error}
		{#if $options.format === 'amd' || $options.format === 'umd'}
			<section>
				<h3>output.amd.id</h3>
				<input bind:value="{$options.amd.id}" placeholder="leave blank for anonymous module" />
			</section>
		{/if}

		{#if $rollupOutput.output[0] && ($options.format === 'iife' || $options.format === 'umd')}
			{#if $rollupOutput.output[0].exports.length}
				<section>
					<h3>output.name</h3>
					<input bind:value="{$options.name}" />
				</section>
			{/if}

			{#if sortedImports.length}
				<section>
					<h3>output.globals</h3>
					{#each sortedImports as x (x)}
						<div><input bind:value="{$options.globals[x]}" /> <code>'{x}'</code></div>
					{/each}
				</section>
			{/if}
		{/if}
	{/if}
</div>

<style>
	.options {
		margin: 0 0 1.5rem 0;
		border: 1px solid #eee;
		line-height: 2rem;
	}

	.option-buttons {
		display: flex;
	}

	button {
		display: block;
		font-size: 0.8rem;
		margin: 0;
		flex-basis: 0;
		flex-grow: 1;
		line-height: 2rem;
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
		padding: 0 0.5rem;
		margin: 0;
		font-size: 1em;
		font-weight: 700;
		line-height: 2rem;
	}

	input {
		font-size: 0.8rem;
		padding: 0 0.5rem;
		line-height: 2rem;
		background-color: #eee;
	}

	section code {
		font-size: 0.8rem;
		line-height: 2rem;
		position: absolute;
		display: block;
		right: 0;
		top: 0;
		padding: 0 0.5rem 0 1.5rem;
	}
</style>
