module.exports.distance = function (ptArray1, ptArray2) {
  let squareSum = 0;
  for (var i = 0, ii = ptArray1.length; i < ii; ++i) 
    squareSum += Math.pow(ptArray2[i] - ptArray1[i], 2);
  return Math.sqrt(squareSum);
}

function cubicComponent (t, y0, y1, y2, y3) {
  const a0 = y3 - y2 - y0 + y1;
  const a1 = y0 - y1 - a0;
  const a2 = y2 - y0;
  return(a0*t*t*t + a1*t*t + a2*t + y1);
}

/**
 * takes a 1d buffer of 4 consecutive points of nComponents dimensions, returns a buffer of points between 2nd and 3rd points in buffer, of length nSteps*nComponents.
 * @param  {array} input       flat buffer of 4 consecutive points of nComponents dimensions
 * @param  {number} nSteps      the number of steps to interpolate between y2 and y3
 * @param  {number} nComponents the number of components in each point
 * @param  {array} output      optional buffer to use, default behavior returns a new array.
 * @return {array}             a buffer of points interpolated between y2 and y3
 */
module.exports.getCubicPoints = function getCubicPoints(input, nSteps, nComponents, output) {
  output = output || new Array(nComponents * nSteps);

  for (let c = 0; c < nComponents; ++c) {
    const y0 = input[0*nComponents + c];
    const y1 = input[1*nComponents + c];
    const y2 = input[2*nComponents + c];
    const y3 = input[3*nComponents + c];
    for (let s = 0; s < nSteps; ++s) {
      output[s*nComponents + c] = cubicComponent(s/nSteps, y0, y1, y2, y3);
    }
  }

  return output;
};



module.exports.getCubicPointsEquidistant = function (input, nComponents, nIterations, output) {
  output = output || [];

  function iterate (pts) {
    for (var i = 0, ii = pts.length; i < ii; i++) {
      pts[i];
    }
  }

  let intermediatePts = [input.slice(0)];
  for (let i = 0; i < nIterations; i++) {
    intermediatePts = iterate(intermediatePts);
  } 

  return output;
};