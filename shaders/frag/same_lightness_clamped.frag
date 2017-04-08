$common_globals
$hsluv

uniform float lightness;

void main() {
	$common_variables

	float alpha = 1.0;
	float chroma = (dist - indicator_radius) * (1.0 - blend_focus);
	float hue = (theta - PI)/PI*180.0;
	float maxChroma = hsluv_maxChromaForLH(lightness, hue);
	chroma *= hsluv_highestChromaForL(lightness);

	float diffChroma = abs(maxChroma - chroma);
	if (diffChroma < 2.0) {
		alpha = smoothstep(diffChroma, 0.0, 1.0);
	}
	// gl_FragColor = hsluvToRgb((theta - PI)/PI*180.0, max(0.0, chroma), lightness, 1.0);
	vec3 col = lchToRgb(
		lightness, 
		clamp(chroma, 0.0, maxChroma), 
		hue
	);
	gl_FragColor = vec4(col, alpha);
}