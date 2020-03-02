import fs from 'fs';
import path from 'path';
import marked from 'marked';
import hljs from 'highlight.js';

// Register dummy language for plain text code blocks.
hljs.registerLanguage('text', () => ({}));

export default fs
	.readdirSync('guide')
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

		content = content.replace(/```([\w-]+)?\n([\s\S]+?)```/g, (match, lang, code) => {
			const { value } = hljs.highlight(lang || 'bash', code);
			highlighted[++uid] = value;

			return `@@${uid}`;
		});

		const renderer = new marked.Renderer();
		renderer.heading = (text, level, raw, slugger) => {
			const id = slugger.slug(raw);
			return `<h${level} id="${id}"><a class="anchor" href="guide/en/#${id}"><svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>${text}</h${level}>`;
		};
		const html = marked(content, { renderer })
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
				.replace(/<(\w+).*>.*<\/\1>/, '')
				.replace(/&quot;/g, '"')
				.replace(/&#39;/g, "'")
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
