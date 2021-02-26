import getLanguages from './_data.js';

export function get(req, res, next) {
	const { lang } = req.params;
	const languages = getLanguages();

	if (lang in languages) {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Cache-Control': `max-age=${30 * 60 * 1e3}` // 30 minutes
		});
		res.end(languages[lang]);
	} else {
		next();
	}
}
