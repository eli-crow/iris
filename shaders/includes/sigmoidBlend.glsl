float sigmoid(float x, float startX, float endX) {
  float scaledX = (x - startX) / (endX - startX);
  return 0.5 + scaledX * (1.0 - scaledX * 0.5);
}
float sigmoidBlend(float a, float b, float x, float x0, float x1) {
	float w1 = sigmoid(x, x0, x1);
	return a * w1 + b * (1.0 - w1);
}
vec3 sigmoidBlend(vec3 c1, vec3 c2, float x, float x0, float x1) {
	float w1 = sigmoid(x, x0, x1);
	return c1 * w1 + c2 * (1.0 - w1);
}