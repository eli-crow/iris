module.exports.curry = function (fn, thisarg = window) {
	const args = new Array(arguments.length - 2);
	for (let i = 2, ii = arguments.length; i < ii; ++i) {
			args[i] = arguments[i];
	}
	return function() {
		fn.apply(thisarg, args);
	}
}
module.exports.isFunction = function (functionToCheck) {
	 var getType = {};
	 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}