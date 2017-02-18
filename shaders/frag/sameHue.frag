precision lowp float;

uniform float hue;

void main() {
	gl_FragColor = vec4(vec3(hue), 1.0);
}