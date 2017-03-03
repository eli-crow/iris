$common_globals
$hsl_2_rgb

uniform float hue;

void main() {
	$common_variables

	vec3 irisHSL = vec3 ( 
		  hue
		, smoothstep(PI/2.0, PI, abs(theta - PI))
		, smoothstep(PI, 0.0, abs(atan(norm_frag.x, norm_frag.y)))
	);

	gl_FragColor = vec4(
		mix( 
			HSL2RGB(vec3(hue, 1.0, 0.5)), 
			HSL2RGB(irisHSL),
			smoothstep(indicator_radius, 1.0, dist * (1.0 - blend_focus))
		),
		1.0
	);
}