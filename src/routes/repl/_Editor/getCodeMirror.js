let codeMirror;

// This is to work around an issue where several parallel dynamic imports of the
// same module only resolve the last import
export function getCodeMirror() {
	if (codeMirror) return codeMirror;
	return (codeMirror = import('./codemirror.js'));
}
