$common_globals
$hsl_2_rgb
$sigmoidBlend

uniform float hue;

void main() {
	$common_variables

	vec3 irisHSL = vec3 (
		  hue
		, cos(theta - PI)	    * 0.5 + 0.5
		, cos(theta + PI/2.0) * 0.5 + 0.5
	);
	
	gl_FragColor = vec4(
		sigmoidBlend( 
			HSL2RGB(irisHSL),
			HSL2RGB(vec3(hue, 1.0, 0.5)), 
			max(0.0, (dist - indicator_radius) * (1.0 - blend_focus) * (1.0 + indicator_radius)) + PLATEAU ,
			indicator_radius + PLATEAU,
			1.0 - PLATEAU
		),
		1.0
	);
}