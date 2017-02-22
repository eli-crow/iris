/**
 * takes a 1d buffer of 4 consecutive points of nComponents dimensions, returns a buffer of points between 2nd and 3rd points in buffer, of length nSteps*nComponents.
 * @param  {array} input       flat buffer of 4 consecutive points of nComponents dimensions
 * @param  {number} nSteps      the number of steps to interpolate between y2 and y3
 * @param  {number} nComponents the number of components in each point
 * @param  {array} output      optional buffer to use, default behavior returns a new array.
 * @return {array}             a buffer of points interpolated between y2 and y3
 */
module.exports.getCubicPoints = function getCubicPoints(input, nSteps, nComponents, output) {
  let a0,a1,a2;
  function component (t, y0, y1, y2, y3) {
    a0 = y3 - y2 - y0 + y1;
    a1 = y0 - y1 - a0;
    a2 = y2 - y0;
    return(a0*t*t*t + a1*t*t + a2*t + y1);
  }

  output = output || [];
  for(let s = 0; s < nSteps; ++s) {
    const t = s/nSteps;
    for (let c = 0; c < nComponents; ++c) {
      output[s*nComponents+c] = component( t, 
        input[c + 0 * nComponents], 
        input[c + 1 * nComponents], 
        input[c + 2 * nComponents], 
        input[c + 3 * nComponents]
      );
    }
  }

  return output;
}