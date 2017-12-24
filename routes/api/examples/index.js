import examples from './_data.js';

const contents = JSON.stringify(examples.map(example => {
	return {
		id: example.id,
		title: example.title
	};
}));

export function get(req, res) {
	res.set({
		'Content-Type': 'application/json',
		'Cache-Control': `max-age=${30 * 60 * 1e3}` // 30 minutes
	});
	res.end(contents);
}