float modulus (float x, float n) {
   return mod(mod(x, n) + n, n);
}
float Hue2RGB( float v1, float v2, float vH ) {
   vH = modulus(vH, 1.0);
   if ( 6.0 * vH < 1.0 ) return v1 + (v2 - v1) * 6.0 * vH;
   if ( 2.0 * vH < 1.0 ) return v2;
   if ( 3.0 * vH < 2.0 ) return v1 + (v2 - v1) * (2.0/3.0 - vH) * 6.0;
   return v1;
}
vec3 HSL2RGB (vec3 hsl) {
   float h = hsl.x/PI/2.0;

   float v2 = hsl.z + hsl.y - hsl.y*hsl.z;
   if ( hsl.z < 0.5 ) v2 = hsl.z * (1.0 + hsl.y);

   float v1 = 2.0*hsl.z - v2;

   return vec3 (
      Hue2RGB( v1, v2, h + 1.0/3.0 ),
      Hue2RGB( v1, v2, h ),
      Hue2RGB( v1, v2, h - 1.0/3.0 )
   );
}