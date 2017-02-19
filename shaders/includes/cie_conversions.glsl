vec3 LCH2LAB (vec3 lch) {
	return vec3( 
		lch.x,
		cos(lch.z) * lch.y,
		sin(lch.z) * lch.y
	);
}

//observer 2deg, illuminant d65
vec3 LAB2XYZ (vec3 lab) {
	float y = (lab.x + .16) / 1.16;
	return vec3(
		0.95047 * (y + lab.y / 5.0),
		y,
		1.08883 * (y - lab.z / 2.0)
	);
}

vec3 XYZ2RGB (vec3 xyz) {
	return vec3(
		xyz.x *  3.2406 + xyz.y * -1.5372 + xyz.z * -0.4986,
		xyz.x * -0.9689 + xyz.y *  1.8758 + xyz.z *  0.0415,
		xyz.x *  0.0557 + xyz.y * -0.2040 + xyz.z *  1.0570
	);
}

vec3 LAB2RGB (vec3 lab) { return XYZ2RGB(LAB2XYZ(lab)); }
vec3 LCH2RGB (vec3 lch) { return XYZ2RGB(LAB2XYZ(LCH2LAB(lch))); }