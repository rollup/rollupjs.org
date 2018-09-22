import fs from 'fs';
import path from 'path';
import marked from 'marked';
import hljs from 'highlight.js';

// Register dummy language for plain text code blocks.
hljs.registerLanguage('text', () => ({}));

export default fs.readdirSync('guide')
	.filter(dir => {
		return fs.statSync(`guide/${dir}`).isDirectory();
	})
	.map(lang => {
		return {
			lang,
			sections: create_guide(lang)
		};
	});

function create_guide(lang) {
	const files = fs.readdirSync(`guide/${lang}`).filter(file => {
		return file[0] !== '.' && path.extname(file) === '.md';
	});

	return files.map(file => {
		const markdown = fs.readFileSync(`guide/${lang}/${file}`, 'utf-8');

		let match = /---\n([\s\S]+?)\n---/.exec(markdown);
		const front_matter = match[1];
		let content = markdown.slice(match[0].length);

		const metadata = {};
		front_matter.split('\n').forEach(pair => {
			const colon_index = pair.indexOf(':');
			metadata[pair.slice(0, colon_index).trim()] = pair.slice(colon_index + 1).trim();
		});

		// syntax highlighting
		let uid = 0;
		const highlighted = {};

		content = content.replace(
			/```([\w-]+)?\n([\s\S]+?)```/g,
			(match, lang, code) => {
				const { value } = hljs.highlight(lang || 'bash', code);
				highlighted[++uid] = value;

				return `@@${uid}`;
			}
		);

		const html = marked(content)
			.replace(/<p>(<a class='open-in-repl'[\s\S]+?)<\/p>/g, '$1')
			.replace(/<p>@@(\d+)<\/p>/g, (match, id) => {
				return `<pre><code>${highlighted[id]}</code></pre>`;
			})
			.replace(/^\t+/gm, match => match.split('\t').join('  '));

		const subsections = [];
		const pattern = /<h3 id="(.+?)">(.+?)<\/h3>/g;
		while ((match = pattern.exec(html))) {
			const slug = match[1];
			const title = match[2]
				.replace(/<\/?code>/g, '')
				.replace(/&quot;/g, '"')
				.replace(/&#39;/g, '\'')
				.replace(/\.(\w+).*/, '.$1')
				.replace(/\((\w+).*\)/, '');

			subsections.push({ slug, title });
		}

		return {
			html,
			metadata,
			subsections,
			slug: file.replace(/^\d+-/, '').replace(/\.md$/, '')
		};
	});
}
