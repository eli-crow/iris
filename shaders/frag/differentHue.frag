precision lowp float;

uniform float lightness;

void main() {
	gl_FragColor = vec4(vec3(lightness), 1.0);
}