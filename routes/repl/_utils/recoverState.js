export default function recoverState() {
	const search = typeof window !== 'undefined' ? window.location.search : '';
	// recover state from hash fragment
	let json;
	const match = /shareable=(.+)$/.exec(search);
	if (match) {
		try {
			json = decodeURIComponent(atob(match[1]));
		} catch (err) {
			// noop
		}
	}

	let saved;
	let selectedExample = null;

	try {
		saved = JSON.parse(json);
		selectedExample = saved.example;
	} catch (err) {
		selectedExample = '00';
	}

	return { saved, selectedExample };
}
