const normalize = require('./normalize');

module.exports = (redirections, options) => {
	return Object.entries(redirections).map(([source, destination]) => {
		const normalizedSource = normalize(source)
			.appendHTMLIndexIfNeeded()
			.ensureHTML(options)
			.relativeTo('/')
			.get();
		const normalizedDestination = normalize(destination)
			.relativeTo(normalizedSource)
			.get();
		return {normalizedSource, normalizedDestination};
	});
};
