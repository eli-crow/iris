precision lowp float;

uniform vec2 resolution;
uniform float lightness;

void main() {
	gl_FragColor = vec4(lightness, resolution, 1.0);
}