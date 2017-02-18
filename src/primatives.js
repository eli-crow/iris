module.exports.circle = function (radius, nPts) {
	const pts = new Float32Array(nPts*2+2);
	pts[0] = 0; pts[1] = 0;
	for (var i = 2, ii = pts.length; i < ii; i += 2) {
		pts[i]   = radius * Math.cos(i/ii * 2*Math.PI);
		pts[i+1] = radius * Math.sin(i/ii * 2*Math.PI);
	}
	return pts;
}
module.exports.rectangle = function (width, height) {
	return new Float32Array([
		0, 0,
		width, 0,   
		width, height, 
		0, height
	]);
} 