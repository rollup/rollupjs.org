import guides from '../src/routes/guide/[lang]/_data.js';

const guide = guides.find(guide => guide.lang === 'en');
if (!guide) {
	throw new Error('Could not find "en" docs');
}

const sections = guide.sections;
const ids = new Map();
const errors = [];

function addId(id, title) {
	if (ids.has(id)) {
		errors.push(
			`The id "${id}" in section "${title}" conflicts with the same id in section "${ids.get(id)}".`
		);
	}
	ids.set(id, title);
}

const idRegExp = / id="[^"]+/g;
for (const section of sections) {
	addId(section.slug, section.metadata.title);
	const matches = section.html.match(idRegExp) || [];
	for (const match of matches) {
		addId(match.slice(5), section.metadata.title);
	}
}

const linkRegExp = / href="guide\/en\/#[^"]+/g;
for (const section of sections) {
	const matches = section.html.match(linkRegExp) || [];
	for (const match of matches) {
		const id = match.slice(17);
		if (!ids.has(id)) {
			errors.push(
				`The link "${id}" in section "${section.metadata.title}" does not correspond to an existing id.`
			);
		}
	}
}

if (errors.length > 0) {
	throw new Error(errors.join('\n'));
} else {
	console.log('All ids are unique, all anchor targets found.');
}
