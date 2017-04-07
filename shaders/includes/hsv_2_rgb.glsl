const vec4 HSV_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 HSV2RGB(vec3 c) {
  vec3 p = abs(fract(c.xxx + HSV_K.xyz) * 6.0 - HSV_K.www);
  return c.z * mix(HSV_K.xxx, clamp(p - HSV_K.xxx, 0.0, 1.0), c.y);
}