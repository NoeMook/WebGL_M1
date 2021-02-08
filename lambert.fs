
precision mediump float;

varying vec4 pos3D; //point de l'objet traite
varying vec3 N;
uniform float alpha;
varying vec3 color; //couleur de l'objet

vec3 Li = vec3(3.0); // puissance de la source lumineuse
float Ks = 0.3; //aspect brillant

const float pi = 3.1415;

// ==============================================
float checkAngle(vec3 v1,vec3 v2){
	float r = max(dot(v1,v2),0.0); 
	return r;
}

// ==============================================
void main(void)
{
	vec3 Lpos = vec3(0.0,1.0,0.0); // position de la source de lumiere

	vec3 Vi = normalize(vec3(Lpos+vec3(-pos3D))); // vecteur vers la source de lumière
	vec3 Vo = normalize(-vec3(pos3D)); // vecteur vers la camera

	vec3 nN = normalize(N); // normale normalisée ( norme = 1 )
	float cosTheta = checkAngle(nN,Vi); // vu que les deux vecteurs sont normalisés alors le produit scalaire = cos(theta)
	vec3 Kd = color; //couleur de reflection de l'objet (aspect diffus)

	float n = 100.0; //taille du lobe

	vec3 R = reflect(Vi,nN); // vecteur refléchi de la lumière
	float cosAlpha = checkAngle(normalize(R),Vo); //cosinus de l'angle alpha (entre le vecteur réfléchi et le vecteur de vision)
	float cosAlphaN = pow(cosAlpha,n); // cosAlpha a la puissance n

	vec3 Fr = (1.0-Ks) * Kd / pi + (n+2.0)/(2.0*pi) * Ks * cosAlphaN; //calcul de phong

	vec3 Lo = Li * Fr * cosTheta;
	gl_FragColor = vec4(Lo,alpha);
}