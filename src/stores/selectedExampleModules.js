import { derived } from 'svelte/store';
import selectedExample from './selectedExample';
import examples from './examples';

// TODO Lukas this should actually be local to the example selector component? And if so, do we need to
// have any of selectedExample or selectedExampleModules?
// instead: Local component state of the selector!
export default derived([selectedExample, examples], ([$selectedExample, $examples]) => {
	if ($selectedExample) {
		const selectedExampleInformation = $examples.find(({ id }) => id === $selectedExample);
		if (selectedExampleInformation) {
			return selectedExampleInformation.modules;
		}
	}
	return [];
});
