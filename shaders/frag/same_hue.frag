$common_globals
$hsl_2_rgb
// hsluv
$sigmoidBlend

uniform float hue;

void main() {
	$common_variables

	vec3 irisHSL = vec3 (
		  hue
		, cos(theta - PI)	    * .5 + .5
		, cos(theta + PI/2.0) * .5 + .5
	);

	gl_FragColor = vec4(
		mix( 
			HSL2RGB(vec3(hue, 1, .5)), 
			HSL2RGB(irisHSL),
			max(0.0, (dist - indicator_radius) * (1.0 - blend_focus) * (1.0 + indicator_radius)) * 1.05
		),
		1.0
	);
}