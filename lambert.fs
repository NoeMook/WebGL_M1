
precision mediump float;

varying vec4 pos3D;
varying vec3 N;
varying vec4 Lpos;
varying float alphafs;
varying vec3 color;




// ==============================================
void main(void)
{
	vec4 Lpos = vec4(1.0,1.0,1.0,1.0);
	vec3 col = color * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
	gl_FragColor = vec4(col,alphafs);
}




