#!/usr/bin/env zx

import path from 'path';

const mermaidFiles = await globby('guide/en/*.mmd');
await Promise.all(
	mermaidFiles.map(
		file =>
			$`npx mmdc -c mermaid.config.json -i "${file}" -o "static/graphs/${path.basename(
				file,
				'.mmd'
			)}.svg"`
	)
);
