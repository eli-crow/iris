module.exports.circle = function (radius, nPts, x=0, y=0) {
	const pts = new Float32Array(nPts*2+2);
	pts[0] = x; pts[1] = y;
	for (var i = 0, ii = pts.length; i < ii; i += 2) {
		pts[i+2] = x + radius * Math.cos(i/(ii-4) * 2*Math.PI);
		pts[i+3] = y + radius * Math.sin(i/(ii-4) * 2*Math.PI);
	}
	//finish the circle;
	pts[nPts*2] 		= pts[2];
	pts[nPts*2 + 1] = pts[3];
	return pts;
}

module.exports.rectangle = function (width, height, x=0, y=0) {
	return new Float32Array([
		x, y,
		x + width, y,   
		x + width, y + height, 
		x, y + height
	]);
} 