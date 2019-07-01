<script>
    import { onDestroy, onMount } from 'svelte';
	export let code;
	export let readonly = false;
	let previousCode = code;
    let editorNode;
    let editor;

    onMount(() => {
        import('./codemirror.js').then(({ default: CodeMirror }) => {
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
        		code = instance.getValue();
        		previousCode = code;
        	});

        	editor.setValue(code);
        });
    });

    onDestroy(() => {
        editor && editor.toTextArea();
    });

    $: {
        if (code && previousCode !== code && editor) {
            previousCode = code;
            editor.setValue(code);
        }
    }
</script>

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
</style>

<div class='codemirror-container'>
	<textarea tabindex='0' bind:this={editorNode}></textarea>
</div>
