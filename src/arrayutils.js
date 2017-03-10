function rotateArray (arr, step) {
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

function flatten (arr) {
	if (arr.length <= 1) return arr;
	return arr.reduce((flat, toFlatten) => {
		flat = Array.isArray(flat) ? flat : [flat];
		return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	});
}

/**
 * returns a boolean that is true if value matches any member of array
 * @return {Boolean} a boolean that is true if value matches any member of array
 */
function isAnyOf(value, array) {
	for (var i = 0, ii = array.length; i < ii; i++) {
		if (value === array[i]) return true;
	}
	return false;
}


module.exports.isAnyOf = isAnyOf
module.exports.rotateArray = rotateArray;
module.exports.flatten = flatten;