const __operators = ['**', '*', '/', '+', '-', '='];
const __operations = {
	"**": (l,r) => Math.pow(l, r),
	"+":  (l,r) => l + r,
	"-":  (l,r) => l - r,
	"*":  (l,r) => l * r,
	"/":  (l,r) => l / r
};

const doVector = (fn, left, right) => {
	left = left.slice(0);

	for (var i = left.length - 1; i >= 0; i--) {
		left[i] = fn(left, right.length ? right[i] : right)
	}

	return left;
}


const orderOfOperations = (a, b) => __operators.indexOf(a[1]);
const __validToken = /^(?![0-9])([a-zA-Z_]+[0-9]*)+$/g
function parseString (vString) {
	const tokens = vString.split(/\s+/g);
	const operations = [];

	for (var i = 0, ii = tokens.length; i < ii; i++) {
		const t = tokens[i];
		if (t in __operations) {
			const left = tokens[i-1];
			const right = tokens[i+1];
			if (left.match(__validToken) && right.match(__validToken)) {
				operations.push([left, t, right])
			}
		}
	}

	return operations.sort(orderOfOperations);
}

function Envector(arguments) {
	return function V (string) {
		operations = parseString(string);

		return result;
	}
}

const V = Envector(this);

V(`p3 = p1 + p2 / 25 + t ** 2`);

return V.p3;