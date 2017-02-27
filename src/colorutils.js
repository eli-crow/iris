const mathutils = require('./mathutils.js');

//from hsluv.org
const hsluv_yToL = Y => Y <= 0.0088564516790356308 ? Y * 903.2962962962963 : 116 * Math.pow(Y, 1/3) - 16;
const hsluv_toLinearComponent = c => c > 0.04045 ? Math.pow((c+0.055) / 1.055, 2.4) : c / 12.92;
const xyzToLuv = xyzArr => {
	const X = xyzArr[0];
	const Y = xyzArr[1];
	const Z = xyzArr[2];

	const L = hsluv_yToL(Y);

	return [
		L,
		13.0 * L * ( (4.0 * X) / (X + (15.0 * Y) + (3.0 * Z)) - 0.19783000664283681),
		13.0 * L * ( (9.0 * Y) / (X + (15.0 * Y) + (3.0 * Z)) - 0.468319994938791  )
	];
};
const rgbToXyz = rgbArr => {
	const rgbl = new Array(3);
	for (var i = 0; i < 3; i++)
		rgbl[i] = hsluv_toLinearComponent(rgbArr[i] / 255);

	return [
		mathutils.dotProduct([0.41239079926595948 , 0.35758433938387796, 0.18048078840183429 ], rgbl),//x
		mathutils.dotProduct([0.21263900587151036 , 0.71516867876775593, 0.072192315360733715], rgbl),//y
		mathutils.dotProduct([0.019330818715591851, 0.11919477979462599, 0.95053215224966058 ], rgbl) //z
	];
}


module.exports.rgbToLuv = rgbArr => xyzToLuv(rgbToXyz(rgbArr));