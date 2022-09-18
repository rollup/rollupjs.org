<script>
	import { onDestroy, onMount } from 'svelte';
	import rollupOutput from '../stores/rollupOutput';
	import { getFileNameFromMessage } from '../helpers/messages';
	import { createEditor } from '../helpers/editor';

	export let code;
	export let readonly = false;
	export let moduleName = null;

	let previousCode = code;
	let editorContainer;
	let editor;

	$: if (moduleName && editor) {
		// TODO Lukas remove overlay
		const { error, warnings } = $rollupOutput;
		// TODO Lukas add overlay
		// if (error) {
		// 	addOverlay([error], 'rollup-error');
		// } else {
		// 	addOverlay(warnings, 'rollup-warning');
		// }
	}

	// TODO Lukas remove/rework
	function addOverlay(messages, type) {
		const relevantMessages = messages.filter(
			message => message.loc && getFileNameFromMessage(message) === moduleName
		);
		if (relevantMessages.length) {
			const lines = {};
			for (const {
				loc: { line, column }
			} of relevantMessages) {
				if (lines[line]) {
					lines[line].push(column);
				} else {
					lines[line] = [column];
				}
			}
			editor.addOverlay({
				name: 'locations',
				token(stream) {
					const line = lines[stream.lineOracle.line + 1];
					if (line) {
						let i = 0;
						while (typeof line[i] === 'number' && stream.pos > line[i]) {
							i++;
						}
						if (typeof line[i] !== 'number') {
							stream.skipToEnd();
						} else if (stream.pos < line[i]) {
							stream.pos = line[i];
						} else {
							stream.pos++;
							return type;
						}
					} else {
						stream.skipToEnd();
					}
				}
			});
		}
	}

	onMount(async () => {
		const { createEditor } = await import('../helpers/editor.js');
		editor = createEditor(
			editorContainer,
			code,
			({ changedRanges, state: { doc } }) => {
				if (changedRanges.length) {
					// TODO Lukas removeOverlay
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

	.codemirror-container :global(.cm-editor .cm-content),
	.codemirror-container :global(.cm-editor .cm-gutters) {
		font-family: Inconsolata, monospace;
		font-size: 16px;
		line-height: 1.2;
		font-weight: 400;
	}

	.codemirror-container :global(.cm-editor .cm-content) {
		color: #333;
		height: 100%;
	}

	.codemirror-container :global(.cm-editor .cm-gutters) {
		color: #999;
	}

	.codemirror-container :global(.cm-editor) {
		outline: none;
	}

	.codemirror-container :global(.cm-gutters) {
		border-right: 1px solid #eee;
	}

	/* TODO Lukas overlay styling */
	/*:global(.CodeMirror) :global(.cm-overlay.cm-rollup-warning) {*/
	/*	background-color: var(--warning-background);*/
	/*	color: var(--warning-color);*/
	/*	padding: 1px;*/
	/*	margin: -1px;*/
	/*}*/

	/*:global(.CodeMirror) :global(.cm-overlay.cm-rollup-error) {*/
	/*	background-color: var(--error-background);*/
	/*	color: var(--error-color);*/
	/*	padding: 1px;*/
	/*	margin: -1px;*/
	/*}*/
</style>
