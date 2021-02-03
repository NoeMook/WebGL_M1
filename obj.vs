attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float alpha;

varying float alphafs;



void main(void) {
	alphafs = alpha;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
