import BaseView from './BaseView';
import examples from './examples';

console.log( examples );

const ractive = new BaseView({
	el: 'main',
	data: { examples }
});
