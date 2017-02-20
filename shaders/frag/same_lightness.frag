$common_globals
$cie_conversions

uniform float lightness;

void main() {
	$common_variables

	float chroma = max(0.0, (dist - indicator_radius) * blend_reach) * (1.0 + indicator_radius);
	gl_FragColor = vec4(LCH2RGB(vec3(lightness, chroma, theta)), 1.0);
}