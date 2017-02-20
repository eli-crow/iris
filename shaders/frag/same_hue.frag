$common_globals
$hsl_2_rgb
$cos01
$sigmoidBlend

uniform float hue;

void main() {
	$common_variables

	vec3 irisHSL = vec3 (hue, cos01(theta - PI), cos01(theta + PI/2.0));
	
	gl_FragColor = vec4(
		sigmoidBlend( 
			HSL2RGB(irisHSL),
			HSL2RGB(vec3(hue, 1.0, 0.5)), 
			max(0.0, (dist - indicator_radius) * blend_reach) * 4.0/3.0,
			indicator_radius + PLATEAU,
			1.0 - PLATEAU
		),
		1.0
	);
}
	// gl_FragColor = vec4( 
	// 	sigmoidBlend( 
	// 		LCH2RGB(irisLCH),
	// 		LCH2RGB(vec3(0.5, 1.0, hue)),
	// 		max(0.0, (dist - indicator_radius) * blend_reach),
	// 		indicator_radius + PLATEAU,
	// 		1.0 - PLATEAU
	// 	),
	// 	1.0
	// );
