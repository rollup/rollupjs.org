export function getFileNameFromMessage({ loc, id }) {
	return (loc && loc.file) || id;
}
