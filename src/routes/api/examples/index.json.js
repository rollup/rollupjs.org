import examples from './_data.js';

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Cache-Control': `max-age=${30 * 60 * 1e3}` // 30 minutes
	});
	res.end(JSON.stringify(examples));
}
