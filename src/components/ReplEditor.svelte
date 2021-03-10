<script>
	import { onDestroy, onMount } from 'svelte';
	import { getCodeMirror } from '../helpers/getCodeMirror';
	import rollupOutput from '../stores/rollupOutput';
	import { getFileNameFromMessage } from '../helpers/messages';

	export let code;
	export let readonly = false;
	export let moduleName = null;

	let previousCode = code;
	let editorNode;
	let editor;

	$: if (moduleName && editor) {
		editor.removeOverlay('locations');
		const { error, warnings } = $rollupOutput;
		if (error) {
			addOverlay([error], 'rollup-error');
		} else {
			addOverlay(warnings, 'rollup-warning');
		}
	}

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
		const { default: CodeMirror } = await getCodeMirror();
		editor = CodeMirror.fromTextArea(editorNode, {
			lineNumbers: true,
			lineWrapping: true,
			indentWithTabs: true,
			indentUnit: 2,
			tabSize: 2,
			value: code,
			mode: 'javascript',
			readOnly: readonly
		});

		editor.on('change', instance => {
			editor.removeOverlay('locations');
			code = instance.getValue();
			previousCode = code;
		});

		editor.setValue(code);
	});

	onDestroy(() => {
		editor && editor.toTextArea();
	});

	$: if (previousCode !== code && editor) {
		previousCode = code;
		editor.setValue(code);
	}
</script>

<div class="codemirror-container">
	<textarea tabindex="0" bind:this="{editorNode}"></textarea>
</div>

<style>
	.codemirror-container {
		width: 100%;
		border-top: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
	}

	.codemirror-container :global(.CodeMirror) {
		border-radius: 3px;
		font-family: Inconsolata, monospace;
		font-size: 16px;
		line-height: 1.2;
		font-weight: 400;
		color: #333;
	}

	.codemirror-container :global(.CodeMirror) {
		height: auto;
	}

	@media (min-width: 768px) {
		.codemirror-container {
			height: 100%;
			border: none;
		}

		.codemirror-container :global(.CodeMirror) {
			height: 100%;
		}
	}

	.codemirror-container :global(.CodeMirror-gutters) {
		border-right: 1px solid #eee;
	}

	textarea {
		width: 100%;
		border: none;
	}

	:global(.cm-rollup-warning) {
		background-color: var(--warning-background);
		color: var(--warning-color);
		padding: 1px;
		margin: -1px;
	}

	:global(.cm-rollup-error) {
		background-color: var(--error-background);
		color: var(--error-color);
		padding: 1px;
		margin: -1px;
	}
</style>
