import fs from 'fs';

function read_json(file) {
	return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export default fs.readdirSync('examples').filter(file => file[0] !== '.').map(id => {
	const example = read_json(`examples/${id}/example.json`);
	example.id = id;

	example.modules = fs
		.readdirSync(`examples/${id}/modules`)
		.filter(name => name[0] !== '.')
		.map(name => {
			const code = fs
				.readFileSync(`examples/${id}/modules/${name}`, 'utf-8')
				.trim();
			return { name, code };
		})
		.sort((a, b) => {
			return a.name === 'main.js'
				? -1
				: b.name === 'main.js' ? 1 : a.name < b.name ? -1 : 1;
		});

	return example;
});