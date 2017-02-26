const mathutils = require('../src/mathutils.js');

describe('squareDistance2d', () => {
	it('should return 2 for 0,0, 1,1', () => {
		expect(mathutils.squareDistance2d(0,0,1,1)).toEqual(2);
	})
})

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

describe('getSinePoints1d', () => {
	let nPts;
	let amplitude;

	beforeEach(() => {
		nPts = Math.floor(Math.random() * 100);
		amplitude = Math.random() * 100;
	})

	it('returns an array of points within the range [-amplitude to amplitude] inclusive', () => {
		const output = mathutils.getSinePoints1d(amplitude, nPts);
		let result = 'all within range';

		output.some(x => {
			if (Math.abs(x) > amplitude) {
				result = `value ${x} out of range.`;
				return true;
			}
		});
		
		expect(result).toEqual('all within range');
	})

	it('modifies output buffer in place if supplied', () => {
		const outputBuffer = new Array(nPts);
		const output = mathutils.getSinePoints1d(amplitude, nPts, outputBuffer);
		expect(output === outputBuffer).toBe(true);
	})
})