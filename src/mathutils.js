module.exports.clamp = (x, a, b) => Math.min(Math.max(x, a), b);
module.exports.radians = degrees => degrees/180*Math.PI;
module.exports.degrees = radians => radians/Math.PI*180;

const doVector = (v, w, fn) => v.slice(0).map((v,i) => fn(v,w.length ? w[i] : w));
module.exports.vMul = (v, w) => doVector((v,w) => v * s, v, w);
module.exports.vSub = (v, w) => doVector((v,w) => v - w, v, w);
module.exports.vAdd = (v, w) => doVector((v,w) => v + w, v, w);
module.exports.vDiv = (v, w) => doVector((v,w) => v / w, v, w);

module.exports.distance = function (ptArray1, ptArray2) {
	let squareSum = 0;
	for (var i = 0, ii = ptArray1.length; i < ii; ++i) 
		squareSum += Math.pow(ptArray2[i] - ptArray1[i], 2);
	return Math.sqrt(squareSum);
}

module.exports.dotProduct = (v1, v2) => {
	let result = 0;
	for (var i = 0, ii = v1.length; i < ii; i++) {
		result += v1[i] * v2[i];
	}
	return result;
} 

function cubicComponent (t, y0, y1, y2, y3) {
	const a0 = y3 - y2 - y0 + y1;
	const a1 = y0 - y1 - a0;
	const a2 = y2 - y0;
	return(a0*t*t*t + a1*t*t + a2*t + y1);
}
/**
 * takes a 1d buffer of 4 consecutive points of nComponents dimensions, returns a buffer of 
 * points between 2nd and 3rd points in buffer, of length nSteps*nComponents.
 * @param  {array} input       flat buffer of 4 consecutive points of nComponents dimensions
 * @param  {number} nSteps      the number of steps to interpolate between y2 and y3
 * @param  {number} nComponents the number of components in each point
 * @param  {array} output      optional buffer to use, default behavior returns a new array.
 * @return {array}             a buffer of points interpolated between y2 and y3
 */
module.exports.getCubicPoints = function getCubicPoints(input, nSteps, nComponents, output) {
	output = output || new Array(nSteps * nComponents);

	const p0x = input[0], p0y = input[1];
	const p1x = input[2], p1y = input[3];
	const p2x = input[4], p2y = input[5];
	const p3x = input[6], p3y = input[7];

	for (let s = 0; s < nSteps; ++s) {
		output[s*nComponents]     = cubicComponent(s/nSteps, p0x, p1x, p2x, p3x);
		output[s*nComponents + 1] = cubicComponent(s/nSteps, p0y, p1y, p2y, p3y);
	}

	return output;
};

const linearComponent = (t, p0, p1) => (1 - t) * p0 + t * p1;
module.exports.getLerpedCubicPoints = function getCubicPoints(input, nSteps, minDistance) {
	const output = [];

	const p0x = input[0], p0y = input[1];
	const p1x = input[2], p1y = input[3];
	const p2x = input[4], p2y = input[5];
	const p3x = input[6], p3y = input[7];

	let lastX = p1x, lastY = p1y;
	let currX, currY, dist;
	for (let s = 0; s <= nSteps; ++s) {
		currX = cubicComponent(s/nSteps, p0x, p1x, p2x, p3x);
		currY = cubicComponent(s/nSteps, p0y, p1y, p2y, p3y);
		dist = Math.sqrt(squareDistance2d(lastX, lastY, currX, currY));
		for (let l = 0; l < dist; l+=minDistance) {
			output.push(
				linearComponent(l/dist, lastX, currX),
				linearComponent(l/dist, lastY, currY)
			);
		}
		lastX = currX;
		lastY = currY;
	}

	return output;
};

const squareDistance2d = (p0x, p0y, p1x, p1y) => Math.pow(p1x - p0x, 2) + Math.pow(p1y - p0y, 2);

// module.exports.getCubicPointsEquidistant2d = (input, minDistance) => {
// 	const pts = [input[2], input[3]];
// 	const start = 1/3, end = 2/3;

// 	let lastT = start, lastX = input[2], lastY = input[3];
// 	let currT = end,   currX = input[2], currY = input[3];
// 	while (lastT < end) {
// 		currX = cubicComponent(currT, input[0], input[2], input[4], input[6]);
// 		currY = cubicComponent(currT, input[1], input[3], input[5], input[7]);

// 		console.log(squareDistance2d(lastX, lastY, currX, currY, minDistance) <= minDistance * minDistance);

// 		if (squareDistance2d(lastX, lastY, currX, currY, minDistance) <= minDistance * minDistance) {
// 			pts.push(currX, currY);
// 			lastT = currT;
// 			lastX = currX; 
// 			lastY = currY;
// 			currT = end;
// 		} else {
// 			currT -= 0.02;
// 		}
// 	}
// 	console.log(pts.length);
// 	return pts;
// }
// 

const getCatmullRomT = (t, p0x, p0y, p1x, p1y) => Math.pow(squareDistance2d(p0x, p0y, p1x, p1y), 0.25) + t;
module.exports.getCentripetalCRPoints2d = function (input, nSteps, minDistance) {
	const p0x = input[0], p0y = input[1];
	const p1x = input[2], p1y = input[3];
	const p2x = input[4], p2y = input[5];
	const p3x = input[6], p3y = input[7];

	const pts = [p1x, p1y];

	const t1 = getCatmullRomT(0,  p0x, p0y, p1x, p1y);
	const t2 = getCatmullRomT(t1, p1x, p1y, p2x, p2y);
	const t3 = getCatmullRomT(t2, p2x, p2y, p3x, p3y);

	const getComponent = (t, p0, p1, p2, p3) => {
		const A1 = (t1-t)/(t1   )*p0 + (t   )/(t1   )*p1;
		const A2 = (t2-t)/(t2-t1)*p1 + (t-t1)/(t2-t1)*p2;
		const A3 = (t3-t)/(t3-t2)*p2 + (t-t2)/(t3-t2)*p3;
		
		const B1 = (t2-t)/(t2   )*A1 + (t   )/(t2   )*A2;
		const B2 = (t3-t)/(t3-t1)*A2 + (t-t1)/(t3-t1)*A3;
		
		return (t2-t)/(t2-t1)*B1 + (t-t1)/(t2-t1)*B2;
	};

	let lastX = p1x, lastY = p1y;
	for(let t=t1; t<t2; t+=(t2-t1)/nSteps) {
		const x = getComponent(t, p0x, p1x, p2x, p3x);
		const y = getComponent(t, p0y, p1y, p2y, p3y);
		console.log(Math.sqrt(squareDistance2d(lastX, lastY, x, y)));
		if (squareDistance2d(lastX, lastY, x, y) >= minDistance) 
			pts.push(x, y);
		lastX = x;
		lastY = y;
	}

	return pts;
}


// module.exports.getCubicPointsEquidistant2d = (input, minDistance) => {
// 	const pts = [input[2], input[3]];
// 	let lastX = input[2], lastY = input[3], currX, currY;

// 	for (let i = 0, ii = 30; i < ii; i++) {
// 		currX = cubicComponent(i/ii, input[0], input[2], input[4], input[6]);
// 		currY = cubicComponent(i/ii, input[1], input[3], input[5], input[7]);
// 		if (squareDistance2d(lastX, lastY, currX, currY) > minDistance * minDistance) 
// 			pts.push(currX, currY);
// 	}

// 	console.log(pts.length);
// 	return pts;
// }





module.exports.getSinePoints2d = function(width, amplitude, nPts, xOffset, yOffset, output) {
	output = output || new Array(nPts * 2);

	for (let i = 0; i < nPts; i++) {
		output[2 * i]     = xOffset + width*i/nPts
		output[2 * i + 1] = yOffset + amplitude * Math.sin(i/nPts*2*Math.PI);
	}

	return output;
}

module.exports.getSinePoints1d = function(amplitude, nPts, output) {
	output = output || new Array(nPts);

	for (let i = 0; i < nPts; i++)
		output[i] = amplitude * i/nPts

	return output;
}


module.exports.squareDistance2d = squareDistance2d;
module.exports.lerp = linearComponent;