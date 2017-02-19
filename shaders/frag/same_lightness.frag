precision lowp float;

$common_globals
uniform float lightness;

$cie_conversions
$cos01
$sigmoidBlend

void main() {
	$common_variables

	float chroma = sigmoidBlend( 
		0.0, 
		1.0,
		max(0.0, (dist - indicator_radius) * blend_reach),
		indicator_radius + PLATEAU,
		1.0 - PLATEAU
	);

	gl_FragColor = vec4(chroma, chroma, chroma, 1.0);
	// gl_FragColor = vec4(LCH2RGB(vec3(lightness, chroma, theta)), 1.0);
}