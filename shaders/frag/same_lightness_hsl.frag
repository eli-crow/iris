$common_globals
$hsl_2_rgb

uniform float lightness;

void main() {
	$common_variables

	float chroma = (dist - indicator_radius) * (1.0 - blend_focus) * (1.0 + indicator_radius);
	gl_FragColor = vec4(HSL2RGB(vec3((theta - PI), max(0.0, chroma), lightness)), 1.0);
}