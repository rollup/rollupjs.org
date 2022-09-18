import {
	dropCursor,
	EditorView,
	highlightSpecialChars,
	keymap,
	lineNumbers
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import {
	bracketMatching,
	defaultHighlightStyle,
	foldKeymap,
	indentOnInput,
	syntaxHighlighting
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches } from '@codemirror/search';
import {
	autocompletion,
	closeBrackets,
	closeBracketsKeymap,
	completionKeymap
} from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { javascript } from '@codemirror/lang-javascript';

export const createEditor = (parent, doc, onUpdate, readonly) =>
	new EditorView({
		parent,
		doc,
		extensions: [
			lineNumbers(),
			highlightSpecialChars(),
			history(),
			dropCursor(),
			indentOnInput(),
			syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
			bracketMatching(),
			closeBrackets(),
			autocompletion(),
			highlightSelectionMatches(),
			keymap.of([
				...closeBracketsKeymap,
				...defaultKeymap,
				...historyKeymap,
				...foldKeymap,
				...completionKeymap,
				...lintKeymap
			]),
			javascript(),
			EditorState.readOnly.of(readonly),
			EditorView.lineWrapping,
			EditorState.tabSize.of(2),
			EditorView.updateListener.of(onUpdate)
		]
	});
