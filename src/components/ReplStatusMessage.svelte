<script>
	import { getFileNameFromMessage } from '../helpers/messages';

	export let message = {};
	export let isError = false;

	const websitePrefix = 'https://rollupjs.org/';

	function isGuideUrl(url) {
		return url && url.startsWith(websitePrefix);
	}

	let frame;
	$: frame = getFrame(message);

	function getFrame({ loc, id, frame }) {
		const fileName = getFileNameFromMessage({ loc, id });
		if (fileName) {
			const location = loc ? ` (${loc.line}:${loc.column})` : '';
			return `${fileName}${location}${frame ? '\n' : ''}${frame}`;
		}
		return '';
	}
</script>

<div class="message">
	{#if isError}
		<span class="icon icon-error"></span>
		<strong>{message.name}:</strong>
	{/if}
	{message.message}
	{#if isGuideUrl(message.url)}
		<a href="{message.url.slice(websitePrefix.length)}" class="link" class:error="{isError}"
			>(<span class="link-text">link</span>)</a
		>
	{/if}
</div>
{#if frame}
	<pre class="frame"><code>{frame}</code></pre>
{/if}

<style>
	.message {
		line-height: 1;
	}

	.frame {
		overflow: hidden;
		word-break: normal;
		margin: 5px 0;
	}

	.link {
		margin: 0 2px;
	}

	.link-text {
		border-bottom: 1px solid #dd9999;
	}

	.link.error {
		color: #eeeeee;
	}

	.link.error .link-text {
		border-bottom: 1px solid #ffaaaa;
	}
</style>
