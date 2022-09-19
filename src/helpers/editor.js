import { Decoration, dropCursor, EditorView, keymap, lineNumbers } from '@codemirror/view';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import { defaultHighlightStyle, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';

export const addWarnings = StateEffect.define();

const warningsField = StateField.define({
	create() {
		return Decoration.none;
	},
	update(warnings, transaction) {
		let hasWarning = false;
		for (let e of transaction.effects) {
			if (e.is(addWarnings)) {
				if (!hasWarning) {
					hasWarning = true;
					warnings = Decoration.none;
				}
				warnings = warnings.update({
					add: e.value.messages
						.sort((a, b) => a.pos - b.pos)
						.map(({ pos, message }) =>
							Decoration.mark({
								attributes: { class: `cm-rollup-${e.value.type}`, title: message }
							}).range(pos, pos + 1)
						)
				});
			}
		}
		return warnings;
	},
	provide: field => EditorView.decorations.from(field)
});

const marks = {
	warning: Decoration.mark({ attributes: { class: 'cm-rollup-warning', title: 'oooo' } }),
	error: Decoration.mark({ class: 'cm-rollup-error' })
};

const editorFont = {
	fontFamily: 'Inconsolata, monospace',
	fontSize: '16px',
	lineHeight: '1.2',
	fontWeight: '400'
};

const theme = EditorView.baseTheme({
	'.cm-rollup-warning': {
		backgroundColor: 'var(--warning-background)',
		color: 'var(--warning-color)',
		padding: '1px',
		margin: '-1px'
	},
	'.cm-rollup-error': {
		backgroundColor: 'var(--error-background)',
		color: 'var(--error-color)',
		padding: '1px',
		margin: '-1px'
	},
	'.cm-scroller': {
		fontFamily: 'Inconsolata, monospace',
		fontSize: '16px',
		lineHeight: '1.2',
		fontWeight: '400'
	},
	'.cm-content': {
		color: '#333',
		height: '100%'
	},
	'.cm-gutters': {
		color: '#999',
		borderRight: '1px solid #eee'
	},
	'&.cm-editor.cm-focused': {
		outline: 'none'
	}
});

export const createEditor = (parent, doc, onUpdate, readonly) =>
	new EditorView({
		parent,
		doc,
		extensions: [
			lineNumbers(),
			history(),
			dropCursor(),
			indentOnInput(),
			syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
			closeBrackets(),
			keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
			javascript(),
			EditorState.readOnly.of(readonly),
			EditorView.lineWrapping,
			EditorState.tabSize.of(2),
			EditorView.updateListener.of(onUpdate),
			warningsField,
			theme
		]
	});
