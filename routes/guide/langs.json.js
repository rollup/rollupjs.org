import fs from 'fs';

const langs = fs.readdirSync('guide').filter(dir => {
	if (dir[0] === '.') return;
	const stats = fs.statSync(`guide/${dir}`);
	return stats.isDirectory();
});

const json = JSON.stringify(langs);

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	res.end(json);
}