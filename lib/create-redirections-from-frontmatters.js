const normalize = require('./normalize');

function stringToPath(path) {
	if (typeof path !== 'string') {
		return path;
	}

	const output = [];

	for (const item of path.split('.')) {
		for (const key of item.split(/\[([^}]+)]/g)) {
			// Push to the new array
			if (key.length > 0) {
				output.push(key);
			}
		}
	}

	return output;
}

function get(object, path, def) {
	const pathArray = stringToPath(path);
	let current = object;

	for (const item of pathArray) {
		if (!current[item]) {
			return def;
		}

		current = current[item];
	}

	return current;
}

module.exports = (files, options = {}) => {
	const getRedirectFrom = file =>
		get(file, options.frontmatter.redirectFrom || 'redirectFrom', null);
	const getRedirectTo = file =>
		get(file, options.frontmatter.redirectTo || 'redirectTo', null);
	const acc = [];

	Object.entries(files).forEach(([filepath, file]) => {
		const redirectFrom = getRedirectFrom(file);
		if (redirectFrom) {
			for (const source of [].concat(redirectFrom)) {
				const normalizedDestination = normalize(filepath)
					.relativeTo('/')
					.get();
				const normalizedSource = normalize(source)
					.appendHTMLIndexIfNeeded()
					.ensureHTML(options)
					.relativeTo(normalizedDestination)
					.get();
				acc.push({normalizedSource, normalizedDestination});
			}
		}

		const redirectTo = getRedirectTo(file);
		if (redirectTo) {
			const normalizedSource = normalize(filepath)
				.appendHTMLIndexIfNeeded()
				.ensureHTML(options)
				.relativeTo('/')
				.get();
			const normalizedDestination = normalize(redirectTo)
				.relativeTo(normalizedSource)
				.get();
			acc.push({normalizedSource, normalizedDestination});
			delete files[filepath];
		}
	});

	return acc;
};
