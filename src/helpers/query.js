import modules from '../stores/modules';
import options from '../stores/options';
import selectedExample from '../stores/selectedExample';
import rollupRequest from '../stores/rollupRequest';

const atob =
	typeof window === 'undefined' ? base64 => Buffer.from(base64, 'base64').toString() : window.atob;

export async function updateStoresFromQuery(query, hasModules) {
	try {
		if (query.shareable) {
			const json = decodeURIComponent(atob(query.shareable));
			const { modules: queryModules, options: queryOptions, example } = JSON.parse(json);
			modules.set(queryModules);
			options.set(queryOptions);
			selectedExample.set(example);
		} else if (query.gist) {
			const result = await (
				await fetch(`https://api.github.com/gists/${query.gist}`, {
					method: 'GET',
					headers: { Accept: 'application/vnd.github.v3+json' }
				})
			).json();
			const entryModules = query.entry ? query.entry.split(',') : [];
			modules.set(
				[result.files['main.js'] || { filename: 'main.js', content: '' }]
					.concat(
						Object.keys(result.files)
							.filter(fileName => fileName !== 'main.js')
							.map(fileName => result.files[fileName])
					)
					.map(module => ({
						name: module.filename,
						code: module.content,
						isEntry: entryModules.indexOf(module.filename) >= 0
					}))
			);
		} else if (!hasModules) {
			selectedExample.set('00');
		}
	} catch (err) {
		console.error(err);
		selectedExample.set('00');
	}

	if (query.circleci) {
		rollupRequest.requestCircleCI(query.circleci);
	} else if (query.pr) {
		rollupRequest.requestPr(query.pr);
	} else {
		rollupRequest.requestVersion(query.version);
	}
}

export function updateQuery($modules, $options, $selectedExample, $rollupRequest, rollupVersion) {
	if (typeof history === 'undefined') return;
	const params = {};
	if ($rollupRequest.type === 'circleci') {
		params.circleci = $rollupRequest.version;
	} else if ($rollupRequest.type === 'pr') {
		params.pr = $rollupRequest.version;
	} else {
		const version = $rollupRequest.version || rollupVersion;
		if (version) {
			params.version = version;
		}
	}

	const json = JSON.stringify({
		modules: $modules,
		options: $options,
		example: $selectedExample
	});

	params.shareable = btoa(encodeURIComponent(json));
	const queryString = Object.keys(params)
		.map(key => `${key}=${params[key]}`)
		.join('&');
	const url = `/repl/?${queryString}`;
	window.history.replaceState({}, '', url);
}
