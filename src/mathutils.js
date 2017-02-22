// input should be a buffer of four positions. output size should be a mutliple of 2.
module.exports.getCubicPoints = function getCubicPoints(input, output) {
  var a0,a1,a2;
  function component (t, y0, y1, y2, y3) {
    a0 = y3 - y2 - y0 + y1;
    a1 = y0 - y1 - a0;
    a2 = y2 - y0;
    return(a0*t*t*t + a1*t*t + a2*t + y1);
  }
   
  for(var i=0, ii = output.length; i < ii; i+=2) {
    var t = (i * .5 +.25) / (ii/2);
    output[i]   = component(t, input[0], input[2], input[4], input[6]);
    output[i+1] = component(t, input[1], input[3], input[5], input[7]);
  }
  return output;
}