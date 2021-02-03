
precision mediump float;
varying float alphafs;





// ==============================================
void main(void)
{
	vec3 col = vec3(0.9,0.4,0.4);
	gl_FragColor = vec4(col,alphafs);
}




