$common_globals
$hsluv

uniform float lightness;

void main() {
	$common_variables

	float chroma = (dist - indicator_radius) * (1.0 - blend_focus) / 66.666666;
	gl_FragColor = hsluvToRgb((theta - PI)/PI*180., max(0.0, chroma), lightness, 1.0);
}