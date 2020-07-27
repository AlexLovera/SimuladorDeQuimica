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
	"lanthanide":"rgba(100,20,100,0.90)"
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
	"Liquid":"rgba(229, 255, 0, 0.60)",
	"Gas":"rgba(255, 3, 3, 0.60)"
}

var camera, scene, renderer;
var controls;
const posicionInicialCamara = {
	x: 0,
	y: 0,
	z: 2800
}

const modal = document.querySelector('#my-modal');
const closeBtn = document.querySelector('.close');

var objects = [];
var targets = { table: [], esfera: [], simple: [] };

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = posicionInicialCamara["z"];

	scene = new THREE.Scene();

	crearObjetoCSS3D();
	targets.simple = targets.simple.splice(0, targets.simple.length);
	console.log("Asignacion tardia", targets.simple);

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
	console.log("Longitud de simple antes de transform", targets.simple.length);
	console.log("Longitud de table antes de transform", targets.table.length);

	agregarEventosDeClickABotones();
	transform(targets.table, 2000);

	//
	closeBtn.addEventListener('click', cerrarModal);

	window.addEventListener('click', sacarModalPorClickAfuera);	 // PARA MODAL
	window.addEventListener('resize', onWindowResize, false);
}

function posicionarElementosEnTabla(elemento) {

	let object = new THREE.Object3D();
	//console.log(typeof (elemento.xpos), elemento.xpos);
	object.position.x = elemento.xpos * 140 - 1330;	  //1-18
	object.position.y = -elemento.ypos * 180 + 990;	  //1-7
	targets.table.push(object);

}

function crearObjetoCSS3D() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var respuesta = JSON.parse(xhttp.responseText);
			var elemento = respuesta.elements;

			for (var i = 0; i < elemento.length; i++) {

				let object = new CSS3DObject(crearElementoHTMLYSuEvento(i, elemento[i]));
				object.position.x = Math.random() * 10 - 2000;
				object.position.y = Math.random() * 10 - 2000;
				object.position.z = Math.random() * 10 - 2000;
				//console.log(object);
				scene.add(object);
				//objects.push(object);
				//console.log("Array objects",objects);
				targets.simple.push(object);
				posicionarElementosEnTabla(elemento[i]);
			}
		}
	};
	xhttp.open("GET", "../datosDeElementos.json", false);// false para que no sea asincrono
	xhttp.send();
	//console.log(scene);
	console.log("tabla",targets.table);
	//targets.simple = targets.simple.splice(0,targets.simple.length);
}

function crearElementoHTMLYSuEvento(i, elemento) {
	let element = document.createElement('div');
	element.className = 'element';
	element.style.backgroundColor = coloresPorCategoriaDelElemento[elemento.category];

	let number = document.createElement('div');
	number.className = 'number';
	number.textContent = i+1;
	number.title = "numero atomico(Z)=protones+=electrones-";
	//"numero atomico(Z)=protones+=electrones-/(ya que no tienen cargas, siendo neutros)";
	element.appendChild(number);   // numero atomico... protones

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
	element.addEventListener('click', () => elementClickHandler(i,elemento), false);
	//NUEVO MOVER MOUSE
	//element.addEventListener('mousemove', onDocumentMouseMove, false);

	return element;
}

// Aca se tiene aplicar el modal
function elementClickHandler(i,elemento) {
	abrirModal(i,elemento);
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
	modal.style.display = 'block';
	agregarDatosAModal(i, elemento);

}

function agregarDatosAModal(i,elemento) {
	// pedir informacion desde el objeto
	//console.log(targets.simple[i].element.getElementsByClassName("symbol")[0].textContent);
	// o pasar datos directamente del json

	// cambio de textContent a innerHTML para negrita, ver problema a
	var parrafoConfiguracionElectronica = document.getElementById("configuracion-electronica");
	//parrafoConfiguracionElectronica.textContent = `Configuracion electronica: ${elemento.electron_configuration}`;
	var configElectronicaExterna = manejarStringConfigElectronicaExterna(elemento.electron_configuration);
	parrafoConfiguracionElectronica.innerHTML = `<strong>Configuracion electronica:</strong> ${configElectronicaExterna}`;

	var parrafoInfoResumida = document.getElementById("informacion-resumida");
	parrafoInfoResumida.innerHTML = `<strong>Resumen de elemento:</strong> ${elemento.summary}`;

	var parrafoDensidad = document.getElementById("densidad");
	parrafoDensidad.innerHTML = `<strong>Densidad del elemento:</strong> ${elemento.density}`;

	document.getElementById('link-wikipedia').setAttribute('href',elemento.source);

}

function manejarStringConfigElectronicaExterna(configElectronica) {
	var indiceDeLinea = 1;
	var configElectronicaExterna ="<br>";
	var listaDeAlgo = configElectronica.split(" ");
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
			var centroDeLaEsfera = {
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

	for (var i = 0; i < targets.simple.length; i++) {
		var object = targets.simple[i];
		var target = targett[i];

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