attribute vec3 aVertexPosition;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uDeplacement;

void main(void) {
	gl_Position = uRMatrix * uPMatrix * uMVMatrix * uDeplacement * vec4(aVertexPosition,1.0);
}
