$common_globals
$cie_conversions
$sigmoidBlend

uniform float lightness;

void main() {
	$common_variables

	float chroma = max(0.0, (dist - indicator_radius) * blend_reach) * 0.97;
	// float chroma = sigmoidBlend( 
	// 	1.0, 
	// 	0.0,
	// 	max(0.0, (dist - indicator_radius) * blend_reach),
	// 	indicator_radius + PLATEAU,
	// 	1.0 - PLATEAU
	// );

	gl_FragColor = vec4(LCH2RGB(vec3(lightness, chroma, theta)), 1.0);
}