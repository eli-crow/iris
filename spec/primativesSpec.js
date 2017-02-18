const primatives = require('../src/primatives.js');

describe('The circle primative', function () {
	const radius = 1;
	const numberOfPoints = 50;
	let circle;

	beforeEach(function () {
		circle = primatives.circle(radius, numberOfPoints);
	})

	it('returns a Float32Array.', function () {
		expect(circle.constructor).toEqual(Float32Array);
	});

	it('returns an array with length == 2 * nPts + 2.', function () {
		expect(circle.length).toEqual(102);
	})
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