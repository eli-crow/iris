$common_globals
$cie_conversions
$cos01
$sigmoidBlend

uniform float hue;

void main() {
	$common_variables

	vec3 irisLCH = vec3 ( 
		  clamp( cos(theta + PI/2.0),  -1.0, 1.0)
		, clamp( cos(theta - PI)    ,   0.0, 1.0)
		, hue
	);

	gl_FragColor = vec4( 
		sigmoidBlend( 
			LCH2RGB(irisLCH),
			LCH2RGB(vec3(0.5, 1.0, hue)),
			max(0.0, (dist - indicator_radius) * blend_reach),
			indicator_radius + PLATEAU,
			1.0 - PLATEAU
		),
		1.0
	);
}