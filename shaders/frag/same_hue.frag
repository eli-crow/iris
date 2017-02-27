$common_globals
//hsl_2_rgb
$hsluv
$sigmoidBlend

uniform float hue;

void main() {
	$common_variables

	vec3 irisHSL = vec3 (
		  degrees(hue)
		, cos(theta - PI)	    * 50.0 + 50.0
		, cos(theta + PI/2.0) * 50.0 + 50.0
	);
	
	gl_FragColor = vec4(
		sigmoidBlend( 
			hsluvToRgb(irisHSL),
			hsluvToRgb(vec3(hue, 100.0, 50.0)), 
			max(0.0, (dist - indicator_radius) * (1.0 - blend_focus) * (1.0 + indicator_radius)),
			indicator_radius,
			1.0
		),
		1.0
	);
}