precision lowp float;

uniform vec2 resolution;
uniform float hue;

void main() {
	gl_FragColor = vec4(hue, resolution, 1.0);
}