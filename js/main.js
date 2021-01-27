// JavaScript source code

import * as THREE from '../build/three.module.js';

import { TWEEN } from '../jsm/libs/tween.module.min.js';
import { TrackballControls } from '../jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from '../jsm/renderers/CSS3DRenderer.js';

const coloresPorCategoriaDelElemento = {
	"diatomic nonmetal": "rgba(0,255,127,0.90)",	// 0.75 para que se vea mas tranqui
	"noble gas": "rgba(127,255,212,0.90)",
	"alkali metal": "rgba(255,165,0,0.90)",
	"alkaline earth metal": "rgba(255,215,0,0.90)",
	"metalloid": "rgba(255,0,255,0.90)",
	"polyatomic nonmetal": "rgba(230,200,100,0.90)",
	"post-transition metal": "rgba(0, 145, 155, 0.90)",
	"transition metal": "rgba(255,105,180,0.90)",
	"actinide": "rgba(255,150,100,0.90)",
	"lanthanide": "rgba(100,20,100,0.90)",
	"categoria-desconocida": "rgba(112, 0, 255, 0.90)"
}
/*	
1-no metales
2-gases nobles
3-metales alcalinos
4-metales alcalinoterreos
5-metaloides
6-halogenos
7-metales postransicionales
8-metales de transicion
9-actinidos
10-lantanidos
*/

const colorPorEstadoDelElemento = {
	"Solid": "rgba(255, 255, 255, 0.60)",  //   "rgba(0, 255, 13, 0.75)
	"Liquid": "rgba(229, 255, 0, 0.60)",
	"Gas": "rgba(255, 3, 3, 0.60)"
}

let camera, scene, renderer;
let controls;
const posicionInicialCamara = {
	x: 0,
	y: 0,
	z: 2800
}

const modal = document.querySelector('#my-modal');
const closeBtn = document.querySelector('.close');

let targets = { table: [], esfera: [], simple: [] };

obtenerDatosDeElementos().then(elementos => {
	init(elementos);
	animate();
});

function init(elementos) {

	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = posicionInicialCamara["z"];

	scene = new THREE.Scene();
	crearObjetoCSS3D(elementos);
	crearGrupo();
	crearPeriodo();
	agregarReferenciaParaElementosConNumAtomicos();
	targets.simple = targets.simple.splice(0, targets.simple.length);

	generarEsfera();

	renderer = new CSS3DRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('container').appendChild(renderer.domElement);

	//

	controls = new TrackballControls(camera, renderer.domElement);
	controls.minDistance = 500;
	controls.maxDistance = 6000;
	controls.addEventListener('change', render);

	//No se usa, pero sirve como ejemplo para poder usar el evento con el elemento.

	agregarEventosDeClickABotones();
	transform(targets.table, 2000);

	//
	closeBtn.addEventListener('click', cerrarModal);

	window.addEventListener('click', sacarModalPorClickAfuera);	 // PARA MODAL
	window.addEventListener('resize', onWindowResize, false);
}

function obtenerDatosDeElementos(){
	return fetch("../datosDeElementosConExtra.json")
		.then(respuesta => respuesta.json())
		.then(datosElementosTabla => datosElementosTabla.elements);
}

function posicionarElementosEnTabla(elemento) {

	let object = new THREE.Object3D();
	object.position.x = elemento.xpos * 140 - 1330;	  //1-18
	object.position.y = -elemento.ypos * 180 + 990;	  //1-7
	targets.table.push(object);

}

function agregarReferenciaParaElementosConNumAtomicos() { // cambiar nombre
	let posicionX = 3;
	let indiceDatosParaRef = 0;
	let simbolosParaReferencia = ["La-Lu", "Ac-Lr"];
	let numAtomicosParaReferencia = ["57-71", "89-103"];
	for (let posY = 6; posY <= 7; posY++) {

		let elementoRef = document.createElement('div');
		elementoRef.className = 'element';
		elementoRef.style.backgroundColor = "rgba(255, 255, 255, 1)";

		let symbol = document.createElement('div');
		symbol.className = 'symbol';
		symbol.title = 'Rango de simbolos';
		symbol.style.fontSize = "40px";
		symbol.style.width = "120px";
		symbol.style.top = "60px";
		symbol.textContent = simbolosParaReferencia[indiceDatosParaRef];
		elementoRef.appendChild(symbol);

		let number = document.createElement('div');
		number.className = 'number';
		number.textContent = numAtomicosParaReferencia[indiceDatosParaRef++];
		number.title = "Rango numeros atomicos";
		number.style.fontSize = "18px";
		elementoRef.appendChild(number);

		let object = new CSS3DObject(elementoRef);
		object.position.x = Math.random() * 10 - 2000;
		object.position.y = Math.random() * 10 - 2000;
		object.position.z = Math.random() * 10 - 2000;
		scene.add(object);
		targets.simple.push(object);

		let objectb = new THREE.Object3D();
		objectb.position.x = posicionX * 140 - 1330;	  //1-18
		objectb.position.y = -posY * 180 + 990;	  //1-7
		targets.table.push(objectb);
	}
}

function crearGrupo() {
	let posicionesEnXGrupo = [0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 0];
	for (let i = 1; i <= 18; i++) {
		let grupo = document.createElement('div');
		grupo.className = 'grupo-periodo';
		grupo.style.height = "30px";

		let numeroGP = document.createElement('div');
		numeroGP.className = 'numeroGP';
		numeroGP.title = 'Grupo';
		numeroGP.textContent = i;
		grupo.appendChild(numeroGP);

		let object = new CSS3DObject(grupo);
		object.position.x = Math.random() * 10 - 2000;
		object.position.y = Math.random() * 10 - 2000;
		object.position.z = Math.random() * 10 - 2000;
		scene.add(object);
		targets.simple.push(object);

		let objectb = new THREE.Object3D();
		objectb.position.x = i * 140 - 1330;	  //1-18
		objectb.position.y = -posicionesEnXGrupo[i] * 180 + 990;	  //1-7
		targets.table.push(objectb);
	}
}

function crearPeriodo() {
	for (let i = 1; i <= 8; i++) {
		let periodo = document.createElement('div');
		periodo.className = 'grupo-periodo';
		periodo.style.height = '165px';

		let numeroGP = document.createElement('div');
		numeroGP.className = 'numeroGP';
		numeroGP.title = 'Periodo';
		numeroGP.style.textAlign = 'right';
		numeroGP.textContent = i;
		periodo.appendChild(numeroGP);

		let object = new CSS3DObject(periodo);
		object.position.x = Math.random() * 10 - 2000;
		object.position.y = Math.random() * 10 - 2000;
		object.position.z = Math.random() * 10 - 2000;
		scene.add(object);
		targets.simple.push(object);

		let objectb = new THREE.Object3D();
		objectb.position.x = 0 - 1330;	  //1-18
		objectb.position.y = -i * 180 + 990;	  //1-7
		targets.table.push(objectb);
	}
}

function crearObjetoCSS3D(elementos) {
	elementos.forEach((elemento,indice)=> { // modularizar
		let object = new CSS3DObject(crearElementoHTMLYSuEvento(indice, elemento));
		object.position.x = Math.random() * 10 - 2000;
		object.position.y = Math.random() * 10 - 2000;
		object.position.z = Math.random() * 10 - 2000;
		scene.add(object);
		targets.simple.push(object);
		posicionarElementosEnTabla(elemento);
	});
}

function crearElementoHTMLYSuEvento(i, elemento) {
	let element = document.createElement('div');
	element.className = 'element';
	element.style.backgroundColor = coloresPorCategoriaDelElemento[elemento.category];

	let number = document.createElement('div');
	number.className = 'number';
	number.textContent = i + 1;
	number.title = "numero atomico(Z)=protones+=electrones-";
	//"numero atomico(Z)=protones+=electrones-/(ya que no tienen cargas, siendo neutros)";
	element.appendChild(number);   // numero atomico... protones

	if (elemento.electronegativity_pauling != null) { // algunos elementos no tienen electronegatividad
		let electroNegatividad = document.createElement('div');
		electroNegatividad.className = 'electro_negatividad';
		electroNegatividad.textContent = elemento.electronegativity_pauling;
		electroNegatividad.title = "electro negatividad pauling";
		element.appendChild(electroNegatividad);   // numero atomico... protones
	}


	let symbol = document.createElement('div');
	symbol.className = 'symbol';
	symbol.title = 'simbolo';
	symbol.style.color = colorPorEstadoDelElemento[elemento.phase];
	symbol.style.textShadow = "0 0 15px " + colorPorEstadoDelElemento[elemento.phase];
	symbol.textContent = elemento.symbol;
	element.appendChild(symbol);

	let details = document.createElement('div');
	details.className = 'details';
	details.innerHTML = elemento.name + '<br>' + elemento.atomic_mass;// separarlo? muy junto
	details.title = 'nombre\nmasa atomica';
	element.appendChild(details);

	//element.addEventListener('mouseover', () => elementMouseOverHandler(i), false);//Agrego tween.removeall... para no cancelar lo de sphere
	//element.addEventListener('mouseout', () => elementMouseOutHandler(), false);
	element.addEventListener('click', () => elementClickHandler(i, elemento), false);
	//NUEVO MOVER MOUSE
	//element.addEventListener('mousemove', onDocumentMouseMove, false);

	return element;
}

// Aca se tiene aplicar el modal
function elementClickHandler(i, elemento) {
	abrirModal(i, elemento);
}

// falta agregar la informacion
function elementMouseOverHandler(i) {

	TWEEN.removeAll();

	transform(targets.table, 1000);

	// Adelanta el elemento hacia la camara
	new TWEEN.Tween(targets.simple[i].position)
		.to({
			z: 100
		}, Math.random() * 2000 + 2000)
		.easing(TWEEN.Easing.Exponential.InOut)
		.start();

	new TWEEN.Tween(this)
		.to({}, 1000 * 2)
		.onUpdate(render)
		.start();
}

function abrirModal(i, elemento) {

	transform(targets.table, 1000);

	// Adelanta el elemento hacia la camara
	new TWEEN.Tween(targets.simple[i].position)
		.to({
			x: 300,
			y: 20,
			z: 2300
		}, Math.random() * 1000 + 2000)		// importante 1000 + 2000
		.easing(TWEEN.Easing.Exponential.InOut)
		.start();

	new TWEEN.Tween(this)
		.to({}, 900 * 2)
		.onUpdate(render)
		.start();						  // para usar la config elec sin efectos
	modal.style.display = 'block';
	agregarDatosAModal(i, elemento);

}

function agregarDatosAModal(i, elemento) {

	let parrafoConfiguracionElectronica = document.getElementById("configuracion-electronica");

	let configElectronicaExterna = manejarStringConfigElectronicaExterna(elemento.electron_configuration);
	parrafoConfiguracionElectronica.innerHTML = `<strong>Configuracion electronica:</strong> ${configElectronicaExterna}`;

	let parrafoInfoResumida = document.getElementById("informacion-resumida");
	parrafoInfoResumida.innerHTML = `<strong>Resumen de elemento:</strong> ${elemento.summary}`;

	let electroNegatividad = document.getElementById("electro-negatividad");
	//electroNegatividad.innerHTML = elemento.electronegativity_pauling != null ? `<strong>Electro negatividad:</strong> ${elemento.electronegativity_pauling}` : "";
	if (elemento.electronegativity_pauling != null) { // algunos elementos no tienen electronegatividad		
		electroNegatividad.innerHTML = `<strong>Electro negatividad:</strong> ${elemento.electronegativity_pauling}`;
	} else {
		electroNegatividad.innerHTML = "";
	}

	let parrafoDensidad = document.getElementById("densidad");
	if (elemento.density != null)
		parrafoDensidad.innerHTML = `<strong>Densidad del elemento:</strong> ${elemento.density}`;
	else
		parrafoDensidad.innerHTML = "";

	let grupo = document.getElementById("grupo");
	grupo.innerHTML = `<strong>Grupo: </strong> ${elemento.grupo}`;

	let periodo = document.getElementById("periodo");
	periodo.innerHTML = `<strong>Periodo: </strong> ${elemento.period}`;

	let bloque = document.getElementById("bloque");
	bloque.innerHTML = `<strong>Bloque: </strong> ${elemento.bloque}`;

	document.getElementById('link-wikipedia').setAttribute('href', elemento.source);

}

function manejarStringConfigElectronicaExterna(configElectronica) {
	let indiceDeLinea = 1;
	let configElectronicaExterna = "<br>";
	let listaDeAlgo = configElectronica.split(" ");
	for (let subString of listaDeAlgo) {
		if (indiceDeLinea == subString[0]) {
			configElectronicaExterna += `${subString} `;
		} else {
			configElectronicaExterna += `<br>${subString} `;
			indiceDeLinea++;
		}
	}

	return configElectronicaExterna;
}


// cierra el modal
function cerrarModal() {
	modal.style.display = 'none';
}

// cierra el modal si se clickea afuera
function sacarModalPorClickAfuera(e) {
	if (e.target == modal) {
		modal.style.display = 'none';
	}
}

function elementMouseOutHandler() {

	TWEEN.removeAll();

	console.log("salio el mouse del elemento");
	transform(targets.table, 400);
}

function generarEsfera() {

	let vectorDeEsfera = new THREE.Vector3();

	for (let i = 0, length = targets.simple.length; i < length; i++) {
		agregarObjetoAEsfera(vectorDeEsfera, i, length);
	}
}

// acomoda la posicion por coordenadas esfericas y agrega a la lista
function agregarObjetoAEsfera(vectorDeEsfera, indice, length) {

	const phi = Math.acos(-1 + (2 * indice) / length);
	const theta = Math.sqrt(length * Math.PI) * phi;
	let object = new THREE.Object3D();

	object.position.setFromSphericalCoords(1000, phi, theta);//1000 r... dsde el centro, con 1000 queda la separacion justa
	object.rotation.y = Math.PI;

	vectorDeEsfera.copy(object.position).multiplyScalar(2);
	vectorDeEsfera.copy(object.rotation).multiplyScalar(2);

	object.lookAt(vectorDeEsfera);

	targets.esfera.push(object);
}

function agregarEventosDeClickABotones() {
	agregarEventoDeClickABoton(targets.table, 'tabla');
	agregarEventoDeClickABoton(targets.esfera, 'esfera');
}

function agregarEventoDeClickABoton(target, elementId) {

	const button = document.getElementById(elementId);

	button.addEventListener('click', function () {
		if ('esfera' == elementId) {

			//transform(target, 2000);
			let centroDeLaEsfera = {
				x: 0,
				y: 0,
				z: 100
			}
			agregarAnimacionALaCamara(camera.position, centroDeLaEsfera);

		} else {
			agregarAnimacionALaCamara(camera.position, posicionInicialCamara);
		}
		controls.reset(); // estado original centrado, function de trallbackcontrol 
		transform(target, 2000);
	}, false);

}

function agregarAnimacionALaCamara(posiscionDeLaCamara, posicionesFinales) {
	new TWEEN.Tween(posiscionDeLaCamara).to(
		posicionesFinales
		, 4000)
		.easing(TWEEN.Easing.Exponential.InOut)
		.start();
}

function transform(targett, duration) {
	//TWEEN.removeAll();
	/*
   console.log("Array objects", objects);
   console.log("Array simple", targets.simple);
   console.log("Entra a transform");
   console.log("Longitud de simple en transform", targets.simple.length);	  */

	for (let i = 0; i < targets.simple.length; i++) {
		let object = targets.simple[i];
		let target = targett[i];

		new TWEEN.Tween(object.position)
			.to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
			.easing(TWEEN.Easing.Back.Out)
			.start();

		new TWEEN.Tween(object.rotation)
			.to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();

	}

	new TWEEN.Tween(this)
		.to({}, duration * 2)
		.onUpdate(render)
		.start();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

	render();
}

function animate() {

	requestAnimationFrame(animate);

	TWEEN.update();

	controls.update();
}

function render() {

	renderer.render(scene, camera);

}