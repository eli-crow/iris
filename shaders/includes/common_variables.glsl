vec4 norm_frag = vec4( gl_FragCoord.xy / resolution * 2.0 - vec2(1.0), gl_FragCoord.zw);
float theta = atan(norm_frag.y, norm_frag.x) + PI;
float dist = length(norm_frag.xy);