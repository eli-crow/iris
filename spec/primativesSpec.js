const primatives = require('../src/primatives.js');


describe('The circle primative,', function () {
	const radius = 1;
	const numberOfPoints = 50;
	const xOffset = 10;
	const yOffset = 20;
	let circle;

	describe('When supplied with radius and number of points', function () {
		beforeEach(function () {
			circle = primatives.circle(radius, numberOfPoints);
		})

		it('returns a Float32Array.', function () {
			expect(circle.constructor).toEqual(Float32Array);
		});
		it('returns an array with length == 2 * nPts + 2.', function () {
			expect(circle.length).toEqual(102);
		})
		it('returns an array of points relative to zero', function () {
			expect(circle[0]).toEqual(0);
			expect(circle[1]).toEqual(0);
		})
	});

	describe('When supplied with radius, number of points, and x and y offset', function () {
		beforeEach(function () {
			circle = primatives.circle(radius, numberOfPoints, xOffset, yOffset);
		})

		it('returns a Float32Array.', function () {
			expect(circle.constructor).toEqual(Float32Array);
		});
		it('returns an array with length == 2 * nPts + 2.', function () {
			expect(circle.length).toEqual(102);
		})
		it('returns an array of points offset by x, and y', function () {
			expect(circle[0]).toEqual(10);
			expect(circle[1]).toEqual(20);
		})
	});
})


describe('The rectangle primative', function () {
	const width = 20;
	const height = 10;
	let rectangle;

	beforeEach(function () {
		rectangle = primatives.rectangle(width, height);
	})

	it('returns a Float32Array.', function () {
		expect(rectangle.constructor).toEqual(Float32Array);
	});

	it('returns an array with length 8', function () {
		expect(rectangle.length).toEqual(8);
	})
})