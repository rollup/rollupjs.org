const isRollupVersionAtLeast = (version, major, minor) => {
	if (!version) return true;
	const [currentMajor, currentMinor] = version.split('.').map(Number);
	return currentMajor > major || (currentMajor === major && currentMinor >= minor);
};

export const supportsInput = version => isRollupVersionAtLeast(version, 0, 48);

export const supportsCodeSplitting = version => isRollupVersionAtLeast(version, 1, 0);
