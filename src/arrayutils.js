module.exports.rotateArray = function (arr, step) {
	var offset = 0;
	var copy = arr.concat();
	for (var i = 0, ii = arr.length; i < ii; i++) {
		if (i + step < ii) {
			 arr[i + step] = copy[i];
			 offset++;
		} else {
			 arr[i - offset] = copy[i];
		}
	};
}

const flatten = arr => {
	if (arr.length <= 1) return arr;
	return arr.reduce((flat, toFlatten) => {
		flat = Array.isArray(flat) ? flat : [flat];
		return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	});
}

module.exports.flatten = flatten;