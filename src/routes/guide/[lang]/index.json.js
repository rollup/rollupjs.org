import data from './_data.js';

const lookup = {};
data.forEach(({ lang, sections }) => {
	lookup[lang] = JSON.stringify(sections);
});

export function get(req, res, next) {
	const { lang } = req.params;

	if (lang in lookup) {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Cache-Control': `max-age=${30 * 60 * 1e3}` // 30 minutes
		});
		res.end(lookup[lang]);
	} else {
		next();
	}
}
