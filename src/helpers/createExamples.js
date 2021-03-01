import fs from 'fs';

function read_json(file) {
	return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export default () =>
	fs
		.readdirSync('examples')
		.filter(file => file[0] !== '.')
		.map(id => {
			const example = read_json(`examples/${id}/example.json`);
			example.id = id;
			example.entryModules = example.entryModules || ['main.js'];

			example.modules = fs
				.readdirSync(`examples/${id}/modules`)
				.filter(name => name[0] !== '.')
				.map(name => {
					const code = fs.readFileSync(`examples/${id}/modules/${name}`, 'utf-8').trim();
					const isEntry = example.entryModules.indexOf(name) >= 0;
					return { name, code, isEntry };
				})
				.sort((a, b) => {
					if (a.name === 'main.js') return -1;
					if (b.name === 'main.js') return 1;
					if (a.isEntry) return -1;
					if (b.isEntry) return 1;
					return a.name < b.name ? -1 : 1;
				});

			return example;
		});
