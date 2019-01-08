const isRollupVersionAtLeast = (major, minor) => {
	const [currentMajor, currentMinor] = window.rollup.VERSION.split('.').map(Number);
	return currentMajor > major || (currentMajor === major && currentMinor >= minor);
};

export const supportsInput = () => isRollupVersionAtLeast(0, 48);
export const supportsCodeSplitting = () => isRollupVersionAtLeast(1, 0);
