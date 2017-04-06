export function copyDefaults (options, defaults) {
	const result = {};

	for (let name in defaults) {
		result[name] = options[name] || defaults[name];
	}

	return result;
}

export function copyShallow (o) {
	return JSON.parse(JSON.stringify(o));
}