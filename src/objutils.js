module.exports.copyDefaults = function (options, defaults) {
	const result = {};

	for (let name in defaults) {
		result[name] = options[name] || defaults[name];
	}

	return result;
}