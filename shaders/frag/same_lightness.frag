$common_globals
$cie_conversions

uniform float lightness;

void main() {
	$common_variables

	float chroma = (dist - indicator_radius) * 1.4 * (1.0 - blend_focus);
	gl_FragColor = vec4(LCH2RGB(vec3(lightness, max(0.0,chroma), theta)), 1.0);
}