attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 pos3D;
varying vec3 N;

uniform float alpha;
uniform vec3 colorimp;

varying float alphafs;
varying vec3 color;

void main(void) {
	color = colorimp;
	alphafs = alpha;
	pos3D = uMVMatrix * vec4(aVertexPosition,1.0);
	N = vec3(uRMatrix * vec4(aVertexNormal,1.0));
	gl_Position = uPMatrix * pos3D;
}
