const mathutils = require('../src/mathutils.js');

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
})