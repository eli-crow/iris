const mathutils = require('../src/mathutils.js');

describe("distance", () => {
	it('returns the correct distance between two two-dimensional points', () => {
		expect(mathutils.distance([0,0], [1,1])).toEqual(Math.SQRT2);
	});
	it('returns the correct distance between two three-dimensional points', () => {
		expect(mathutils.distance([0,0,0], [1,1,1])).toEqual(Math.sqrt(3))
	});
	it('returns the correct distance between two n-dimensional points', () => {
		const n = Math.ceil(Math.random() * 10)
		const input1 = new Array(n).fill(0)
		const input2 = new Array(n).fill(1)
		expect(mathutils.distance(input1, input2)).toEqual(Math.sqrt(n))
	});
})

describe("getCubicPoints", () => {
	let nComponents
	let nSteps
	let input

	beforeEach(() => {
		nComponents = Math.floor(Math.random() * 6 + 2)
		nSteps = Math.floor(Math.random() * 20 + 5)
		input = new Array(4 * nComponents).fill(0).map(x => Math.random() * 100)
	})

	it('returns a buffer whose length is nComponents * nSteps', () => {
		const output = mathutils.getCubicPoints(input, nSteps, nComponents)
		expect(output.length).toEqual(nComponents * nSteps)
	})

	it('returns a buffer filled with numbers', () => {
		const output = mathutils.getCubicPoints(input, nSteps, nComponents)
		let allNumbers = true;
		for (var i = 0, ii = output.length; i < ii; i++) {
			if (typeof output[i] === 'number') continue;
			allNumbers = false; break;
		}
		expect(allNumbers).toBe(true);
	})

	it('returns a buffer filled with numbers within the distance between p1 and p2 from both p1 and p2', () => {
		let badDistance = 'okay';
		const maxDistance = mathutils.distance(
			input.slice(nComponents,   2*nComponents),
			input.slice(2*nComponents, 3*nComponents)
		)

		const output = mathutils.getCubicPoints(input, nSteps, nComponents)

		for (var i = nComponents, ii = output.length; i < ii; i+=nComponents) {
			const dist1 = mathutils.distance(
				output.slice(i-nComponents, i),
				output.slice(i, i+nComponents)
			)
			if (dist1 < maxDistance) continue;
			badDistance = `bad distance is ${dist}`;
		}

		expect(badDistance).toEqual('okay');
	})

	it(', when supplied with an optional output buffer, modifies the output buffer in place', () => {
		const outBuffer = new Array(nComponents * nSteps);
		const output = mathutils.getCubicPoints(input, nSteps, nComponents, outBuffer);
		expect(output).toEqual(outBuffer);
	})
})

// describe("getCubicPointsEquidistant", () => {
// 	let nComponents
// 	let maxIterations
// 	let input

// 	beforeEach(() => {
// 		nComponents = Math.floor(Math.random() * 6 + 2)
// 		maxIterations = Math.floor(Math.random() * 4 + 1)
// 		input = new Array(4 * nComponents).fill(0).map(x => Math.random() * 100)
// 	})

// 	it('returns a buffer twice the size of the input when maxIterations == 1', () => {
// 		maxIterations = 1;
// 		const output = mathutils.getCubicPointsEquidistant(input, nComponents, maxIterations )
// 		expect(output.length).toEqual(nComponents * 2)
// 	})

	// it('returns a buffer whose length is nComponents * (2^maxIterations)', () => {
	// 	const output = mathutils.getCubicPointsEquidistant(input, nComponents, maxIterations, )
	// 	expect(output.length).toEqual(nComponents * Math.pow(maxIterations, 2))
	// })

	// it(', when supplied with an optional output buffer, modifies the output buffer in place', () => {
	// 	const outBuffer = new Array(nComponents * nSteps);
	// 	const output = mathutils.getCubicPointsEquidistant(input, nComponents, maxIterations, outBuffer);
	// 	expect(output).toEqual(outBuffer);
	// })
// })