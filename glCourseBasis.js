
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var deplacement = mat4.create(); // matrice deplacement de l'objet dans l'espace.
var distCENTER;
// =====================================================
var PLANE = null;
var colbuf = null;
var outputColor;

var scene; //tableau des obj à afficher


// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

class objmesh {

	// --------------------------------------------
	constructor(name,objFname,col,coords) {
		this.name = name;
		this.objName = objFname;
		this.loaded = -1;
		this.mesh = null;
		this.alpha = 0.7;
		this.col = col;
		this.vecD = coords;
		this.N = 50.0;

		scene.push(this);
		
		loadObjFile(this);

		this.shader1={shaderName:'lambert',active:true};
		loadShadersNEW(this.shader1);

		this.shader2={shaderName:'wireframe',active:true};
		loadShadersNEW(this.shader2);
	}

	// --------------------------------------------
	setShadersParams() {

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		mat4.identity(deplacement);
		mat4.translate(deplacement, this.vecD);

		gl.useProgram(this.shader1.shader);

		//vAttrib and nAttrib for Shader1
		this.shader1.vAttrib = gl.getAttribLocation(this.shader1.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader1.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader1.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader1.nAttrib = gl.getAttribLocation(this.shader1.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader1.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader1.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader1.rMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uRMatrix");
		this.shader1.mvMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uMVMatrix");
		this.shader1.pMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uPMatrix");
		this.shader1.deplacementMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uDeplacement");

		this.shader1.locationAlpha = gl.getUniformLocation(this.shader1.shader,"alpha");
		this.shader1.locationColor = gl.getUniformLocation(this.shader1.shader,"colorimp");
		this.shader1.locationN = gl.getUniformLocation(this.shader1.shader,"n");
		gl.uniformMatrix4fv(this.shader1.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader1.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader1.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader1.deplacementMatrixUniform, false, deplacement);

		gl.uniform1f(this.shader1.locationAlpha, this.alpha);
		gl.uniform3fv(this.shader1.locationColor, this.col);
		gl.uniform1f(this.shader1.locationN, this.N);
	}
	setShadersParams2() {

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		mat4.identity(deplacement);
		mat4.translate(deplacement, this.vecD);

		gl.useProgram(this.shader2.shader);
		//vAttrib and nAttrib for Shader2
		this.shader2.vAttrib = gl.getAttribLocation(this.shader2.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader2.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader2.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);



		this.shader2.rMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uRMatrix");
		this.shader2.mvMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uMVMatrix");
		this.shader2.pMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uPMatrix");
		this.shader2.deplacementMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uDeplacement");

		gl.uniformMatrix4fv(this.shader2.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader2.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader2.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader2.deplacementMatrixUniform, false, deplacement);

	}
	
	// --------------------------------------------
	draw() {

		 if(this.shader1.shader && this.mesh != null && this.shader1.active) {
		 	this.setShadersParams();
		 	//this.setMatrixUniforms(); => spread in setShadersParams
		 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
		 	gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
		if (this.shader2.shader && this.mesh != null && this.shader2.active) {
			this.setShadersParams2();
			//this.setMatrixUniforms(); => spread in setShadersParams
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBufferFil);
			gl.drawElements(gl.LINES, this.mesh.indexBufferFil.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
	//---------------------------------------------
	// set the alpha of the object (0 < a < 1)
	setAlpha(alpha){
		this.alpha = alpha;
	}
	// return the alpha 
	getAlpha(){
		return this.alpha;
	}
	// set the color of the object
	// in : [r,v,b] r,v,b values between 0 et 1
	setColor(col){
		this.col = vec3.create(col);
	}
	//set the coords of the object
	setCoord(xyz){
		this.vecD = vec3.create(xyz);
	}
	// set the shininess of the object
	setN(n){
		this.N = n;
	}
	//return the shininess of the object
	getN(){
		return this.N;
	}
	//set the shader status
	setShader(numShader, activity){
		if (numShader==1) {
			this.shader1.active=activity;
		} else if (numShader==2){
			this.shader2.active=activity;
		}
	}
	// return the states of the object's shaders
	getActiveShader(){
		return [this.shader1.active,
				this.shader2.active];
	}

}



// =====================================================
// PLAN 3D, Support géométrique
// =====================================================

class plane {
	
	// --------------------------------------------
	constructor() {
		this.shaderName='plane';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}
	// --------------------------------------------
	initAll() {
		var size=1.0;
		var vertices = [
			-size, -size, 0.0,
			 size, -size, 0.0,
			 size, size, 0.0,
			-size, size, 0.0
		];

		var texcoords = [
			0.0,0.0,
			0.0,1.0,
			1.0,1.0,
			1.0,0.0
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 4;

		this.tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		this.tBuffer.itemSize = 2;
		this.tBuffer.numItems = 4;

		loadShaders(this);
	}
	
	
	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
		gl.enableVertexAttribArray(this.shader.tAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
	}


	// --------------------------------------------
	setMatrixUniforms() {
			mat4.identity(mvMatrix);
			mat4.translate(mvMatrix, distCENTER);
			mat4.multiply(mvMatrix, rotMatrix);
			gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
			gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
	}

	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			this.setMatrixUniforms(this);
			
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
		}
	}
}


// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================



// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.06, 0.06, 0.06, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK); 
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

// =====================================================
loadObjFile = function(OBJ3D)
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			OBJ.initMeshBuffers(gl,tmpMesh);
			OBJ3D.mesh=tmpMesh;
			
			OBJ3D.mesh.indicesFil = [];

			for (let i = 0; i < tmpMesh.indices.length; i+=3) {
				OBJ3D.mesh.indicesFil.push(tmpMesh.indices[i],tmpMesh.indices[i+1]);
				OBJ3D.mesh.indicesFil.push(tmpMesh.indices[i+1],tmpMesh.indices[i+2]);
				OBJ3D.mesh.indicesFil.push(tmpMesh.indices[i+2],tmpMesh.indices[i]);
			}
			
			OBJ3D.mesh.indexBufferFil = gl.createBuffer();
    		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ3D.mesh.indexBufferFil);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(OBJ3D.mesh.indicesFil), gl.STATIC_DRAW);
			OBJ3D.mesh.indexBufferFil.itemSize = 1;
			OBJ3D.mesh.indexBufferFil.numItems = OBJ3D.mesh.indicesFil.length;

		}
	}

	xhttp.open("GET", OBJ3D.objName, true);
	xhttp.send();
}

// =====================================================
function loadShadersNEW(shader) {
	loadShaderTextNEW(shader,'.vs');
	loadShaderTextNEW(shader,'.fs');
}

// =====================================================
function loadShaderTextNEW(shader,ext) {   // lecture asynchrone...
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { shader.vsTxt = xhttp.responseText; shader.loaded ++; }
			if(ext=='.fs') { shader.fsTxt = xhttp.responseText; shader.loaded ++; }
			if(shader.loaded==2) {
				shader.loaded ++;
				compileShaders(shader);
				shader.loaded ++;
				console.log("Shader '"+shader.shaderName + "' COMPILED !");
			}
		}
	}

	shader.loaded = 0;
	xhttp.open("GET", shader.shaderName+ext, true);
	xhttp.send();
}



// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(Obj3D.loaded==2) {
			Obj3D.loaded ++;
			compileShaders(Obj3D);
			Obj3D.loaded ++;
		}
	}
  }
  
  Obj3D.loaded = 0;
  xhttp.open("GET", Obj3D.shaderName+ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.shaderName+".vs");
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.shaderName+".fs");
		console.log(gl.getShaderInfoLog(Obj3D.fshader));
	}

	Obj3D.shader = gl.createProgram();
	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);
	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(Obj3D.shader));
	}
}


// =====================================================
function webGLStart() {
	
	var canvas = document.getElementById("WebGL-test");

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;
	document.onkeydown = handleKeyPressed;

	initGL(canvas);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	distCENTER = vec3.create([0,-0.2,-4]);
	
	PLANE = new plane();

	scene = new Array();
	new objmesh('Bunny1','bunny.obj',[0.9,0.4,0.3],[-0.7,0.0,0.0]);
	new objmesh('Bunny2','bunny.obj',[0.2,0.8,0.3],[0.7,0.0,0.0]);

	// ==== Menu déroulant (sélection obj)
	var selectMenu = document.getElementById('selectobj');
	scene.forEach(function(el, i) {
		var opt = document.createElement("option");
		opt.innerText = el.name;
		opt.value = i;
		selectMenu.appendChild(opt);
	});
	tick();
}

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	PLANE.draw();
	scene.forEach(el => {
		el.draw();
	});
}
// =====================================================