import examples from './_data.js';

const lookup = {};
examples.forEach(example => {
	lookup[example.id] = JSON.stringify(example);
});

export function get(req, res, next) {
	const { id } = req.params;

	if (id in lookup) {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Cache-Control': `max-age=${30 * 60 * 1e3}` // 30 minutes
		});
		res.end(lookup[id]);
	} else {
		next();
	}
}
