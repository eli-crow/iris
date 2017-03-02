module.exports.curry = function (fn, thisarg = window) {
	const args = new Array(arguments.length - 2);
	for (let i = 2, ii = arguments.length; i < ii; ++i) {
			args[i] = arguments[i];
	}
	return function() {
		fn.apply(thisarg, args);
	}
};
module.exports.isFunction = function (functionToCheck) {
	 var getType = {};
	 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
// from https://remysharp.com/2010/07/21/throttling-function-calls
module.exports.throttle = function(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	let last, deferTimer;
	return function () {
		const context = scope || this;
		const now = +new Date,
					args = arguments;
		if (last && now < last + threshhold) {
			clearTimeout(deferTimer);
			deferTimer = setTimeout(() => {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}

module.exports.debounce = function debounce (func, wait, immediate) {
	let timeout;
	return function() {
		const context = this, 
		      args = arguments;
		const later = () => {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};