import * as cubicHermite from 'cubic-hermite';

export const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
export const wrap = (x, n) => ((x%n)+n)%n;
export const radians = degrees => degrees/180*Math.PI;
export const degrees = radians => radians/Math.PI*180;

export const doVector = (v, w, fn) => v.slice(0).map((v,i) => fn(v,w.length ? w[i] : w));
export const vMul = (v, w) => doVector(v,w,(v,w) => v * s, v, w);
export const vSub = (v, w) => doVector(v,w,(v,w) => v - w, v, w);
export const vAdd = (v, w) => doVector(v,w,(v,w) => v + w, v, w);
export const vDiv = (v, w) => doVector(v,w,(v,w) => v / w, v, w);

export const distance = (ptArray1, ptArray2) => {
	let squareSum = 0;
	for (var i = 0, ii = ptArray1.length; i < ii; ++i) 
		squareSum += Math.pow(ptArray2[i] - ptArray1[i], 2);
	return Math.sqrt(squareSum);
}
export const squareDistance2d = (p0x, p0y, p1x, p1y) => Math.pow(p1x - p0x, 2) + Math.pow(p1y - p0y, 2);
export const distance2d = (p0x, p0y, p1x, p1y) => Math.sqrt(squareDistance2d(p0x, p0y, p1x, p1y));

export function dotProduct(v1, v2) {
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
export function getCubicPoints (input, nSteps, nComponents, output) {
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

export const lerp = (t, p0, p1) => (1 - t) * p0 + t * p1;
export function getLerpedCubicPoints2d (input, nSteps, minDistance) {
	const output = [];

	const p0x = input[0], p0y = input[1];
	const p1x = input[2], p1y = input[3];
	const p2x = input[4], p2y = input[5];
	const p3x = input[6], p3y = input[7];

	let lastX = p1x, lastY = p1y;
	let currX, currY, dist;
	for (let s = 1; s <= nSteps; ++s) {
		currX = cubicComponent(s/nSteps, p0x, p1x, p2x, p3x);
		currY = cubicComponent(s/nSteps, p0y, p1y, p2y, p3y);
		dist = Math.sqrt(squareDistance2d(lastX, lastY, currX, currY));
		for (let l = 0; l < dist; l+=minDistance) {
			output.push(
				lerp(l/dist, lastX, currX),
				lerp(l/dist, lastY, currY)
			);
		}
		lastX = currX;
		lastY = currY;
	}

	return output;
};

export function lerpMinDistance (pts, minDistance) {
	const output = [];

	for (var i = 0, ii = pts.length; i <= ii; i += 2) {
		const p0x = pts[i]  , p0y = pts[i+1];
		const p1x = pts[i+2], p1y = pts[i+3];
		for (let l = 0, ll = distance2d(p0x, p0y, p1x, p1y); l < ll; l+=minDistance) {
			output.push( lerp(l/ll, p0x, p1x), lerp(l/ll, p0y, p1y) );
		}
	}

	return output;
}


const centripetalCRComponent = (t, t1, t2, t3, p0, p1, p2, p3) => {
	const A1 = (t1-t)/(t1   )*p0 + (t   )/(t1   )*p1;
	const A2 = (t2-t)/(t2-t1)*p1 + (t-t1)/(t2-t1)*p2;
	const A3 = (t3-t)/(t3-t2)*p2 + (t-t2)/(t3-t2)*p3;
	
	const B1 = (t2-t)/(t2   )*A1 + (t   )/(t2   )*A2;
	const B2 = (t3-t)/(t3-t1)*A2 + (t-t1)/(t3-t1)*A3;
	
	return (t2-t)/(t2-t1)*B1 + (t-t1)/(t2-t1)*B2;
};
const getCatmullRomT = (t, p0x, p0y, p1x, p1y) => Math.pow(squareDistance2d(p0x, p0y, p1x, p1y), 0.25) + t;
const getCentripetalCRPoints2d = function (input, nSteps) {
	const p0x = input[0], p0y = input[1];
	const p1x = input[2], p1y = input[3];
	const p2x = input[4], p2y = input[5];
	const p3x = input[6], p3y = input[7];

	//todo: statically size the array with inputs x nSteps?
	const pts = [p1x, p1y];

	const t1 = getCatmullRomT(0,  p0x, p0y, p1x, p1y);
	const t2 = getCatmullRomT(t1, p1x, p1y, p2x, p2y);
	const t3 = getCatmullRomT(t2, p2x, p2y, p3x, p3y);

	for(let t=t1; t<t2; t+=(t2-t1)/nSteps) {
		pts.push(
			centripetalCRComponent(t, t1, t2, t3, p0x, p1x, p2x, p3x),
			centripetalCRComponent(t, t1, t2, t3, p0y, p1y, p2y, p3y)
		);
	}

	return pts;
};


export function getLerpedCentripetalCRPoints2d (input, nSteps, minDistance) {
	//todo: statically size the array with inputs x nSteps?
	const p0x = input[0], p0y = input[1];
	const p1x = input[2], p1y = input[3];
	const p2x = input[4], p2y = input[5];
	const p3x = input[6], p3y = input[7];

	const pts = [];

	const t1 = getCatmullRomT(0,  p0x, p0y, p1x, p1y);
	const t2 = getCatmullRomT(t1, p1x, p1y, p2x, p2y);
	const t3 = getCatmullRomT(t2, p2x, p2y, p3x, p3y);

	let lastX = p1x, lastY = p1y;
	let currX, currY, dist;
	for (let t=t1 + (t2-t1)/nSteps; t<t2; t+=(t2-t1)/nSteps) {


		currX = centripetalCRComponent(t, t1, t2, t3, p0x, p1x, p2x, p3x);
		currY = centripetalCRComponent(t, t1, t2, t3, p0y, p1y, p2y, p3y);
		dist = distance2d(lastX, lastY, currX, currY);
		for (let l = 0; l < dist; l+=minDistance) {
			pts.push(
				lerp(l/dist, lastX, currX),
				lerp(l/dist, lastY, currY)
			);
		}

		// finish the stroke
		dist = distance2d(lastX, lastY, p2x, p2y);
		for (let l = 0; l < dist; l+=minDistance) {
			pts.push(
				lerp(l/dist, currX, p2x),
				lerp(l/dist, currY, p2y)
			);
		}

		lastX = currX;
		lastY = currY;
	}

	return pts;
};

export const getLerpedCubicHermitePoints2d = function (input, nSteps, minDistance) {
	const output = [];

	// todo: fork function to accept input buffer directly.
	const p0 = [input[0], input[1]];
	const p1 = [input[2], input[3]];
	const p2 = [input[4], input[5]];
	const p3 = [input[6], input[7]];

	const startVel = vSub(p1, p0);
	const endVel = vSub(p3, p2);

	// console.log(startVel);
	// console.log(endVel);

	let lastPos = p1;
	let currPos, dist;
	for (let s = 1; s <= nSteps; ++s) {
		currPos = cubicHermite(p1, startVel, p2, endVel, s/nSteps);
		dist = Math.sqrt(squareDistance2d(lastPos[0], lastPos[1], currPos[0], currPos[1]));
		for (let l = 0; l < dist; l+=minDistance) {
			output.push(
				lerp(l/dist, lastPos[0], currPos[0]),
				lerp(l/dist, lastPos[1], currPos[1])
			);
		}
		lastPos = currPos;
	}

	return output;
};


export function getSinePoints2d (width, amplitude, nPts, xOffset, yOffset, output) {
	output = output || new Array(nPts * 2);

	for (let i = 0; i < nPts; i++) {
		output[2 * i]     = xOffset + width*i/nPts
		output[2 * i + 1] = yOffset + amplitude * Math.sin(i/nPts*2*Math.PI);
	}

	return output;
}

export function getSinePoints1d (amplitude, nPts, output) {
	output = output || new Array(nPts);

	for (let i = 0; i < nPts; i++)
		output[i] = amplitude * i/nPts

	return output;
}