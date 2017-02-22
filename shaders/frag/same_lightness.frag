$common_globals
$cie_conversions

uniform float lightness;

void main() {
	$common_variables

	float chroma = 2.0 * (dist - indicator_radius) * (1.0 - blend_focus);
	gl_FragColor = vec4(LCH2RGB(vec3(lightness, clamp(chroma, 0.0, 2.0), theta)), 1.0);
}