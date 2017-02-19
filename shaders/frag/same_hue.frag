precision lowp float;

$common_globals
uniform float hue;

$cie_conversions
$cos01
$sigmoidBlend

void main() {
	$common_variables

	vec3 irisLCH = vec3 ( 
		  clamp( cos01(theta + PI/2.0) * 2.0 - 1.0,  -1.0, 1.0)
		, clamp( cos01(theta - PI) * 2.0 - 1.0,       0.0, 1.0)
		, hue
	);

	gl_FragColor = vec4( 
		sigmoidBlend( 
			LCH2RGB(irisLCH),
			LCH2RGB(vec3(0.5, 1.0, hue)),
			max(0.0, (dist - indicator_radius - PLATEAU) * blend_reach),
			indicator_radius,
			1.0
		),
		1.0
	);
}