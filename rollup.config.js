import clientConfig from './client/rollup.config.js';
import serverConfig from './server/rollup.config.js';
import swConfig from './service-worker/rollup.config.js';

export default [
	clientConfig,
	serverConfig,
	swConfig
];