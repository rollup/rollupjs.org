import { derived } from 'svelte/store';
import selectedExample from './selectedExample';
import examples from './examples';

export default derived([selectedExample, examples], ([$selectedExample, $examples]) => {
	if ($selectedExample) {
		const selectedExampleInformation = $examples.find(({ id }) => id === $selectedExample);
		if (selectedExampleInformation) {
			return selectedExampleInformation.modules;
		}
	}
	return [];
});
