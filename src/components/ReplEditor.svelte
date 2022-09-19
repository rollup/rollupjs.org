<script>
	import { onDestroy, onMount } from 'svelte';
	import rollupOutput from '../stores/rollupOutput';
	import { getFileNameFromMessage } from '../helpers/messages';

	export let code;
	export let readonly = false;
	export let moduleName = null;

	let previousCode = code;
	let editorContainer;
	let editor;
	let addWarningsEffect;

	$: if (moduleName && editor) {
		const { error, warnings } = $rollupOutput;
		if (error) {
			addMarkers([error], 'error');
		} else {
			addMarkers(warnings, 'warning');
		}
	}

	function addMarkers(messages, type) {
		const relevantMessages = messages.filter(
			message => typeof message.pos === 'number' && getFileNameFromMessage(message) === moduleName
		);
		editor.dispatch({ effects: [addWarningsEffect.of({ messages: relevantMessages, type })] });
	}

	onMount(async () => {
		const { createEditor, addWarnings } = await import('../helpers/editor.js');
		addWarningsEffect = addWarnings;
		editor = createEditor(
			editorContainer,
			code,
			({ changedRanges, state: { doc } }) => {
				if (changedRanges.length) {
					code = doc.toString();
					previousCode = code;
				}
			},
			readonly
		);
	});

	onDestroy(() => {
		editor && editor.destroy();
	});

	$: if (previousCode !== code && editor) {
		previousCode = code;
		editor.dispatch({
			changes: { from: 0, to: editor.state.doc.length, insert: code }
		});
	}
</script>

<div class="codemirror-container" bind:this="{editorContainer}"></div>

<style>
	.codemirror-container {
		width: 100%;
		height: 100%;
	}
</style>
