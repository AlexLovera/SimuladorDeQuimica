// JavaScript source code

import * as THREE from '../build/three.module.js';

import { TWEEN } from '../jsm/libs/tween.module.min.js';
import { TrackballControls } from '../jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from '../jsm/renderers/CSS3DRenderer.js';
//alcanlinos-->"rgba(255,165,0",
//alcalinoterreneos-->"rgba(255,215,0",
//metales de transicion-->"rgba(255,105,180",
//lantanidos-->"rgba(245,222,179",
//actinidos-->"rgba(255,0,255",
//metales de bloque p-->"rgba("0,145,155",
//no metales-->"rgba(0,255,127",
//gases nobles-->"rgba(127,255,212",
//no se "rgba(240,255,240",
const table = [
	"H", "Hydrogen", "1.00794", 1, 1, "128,128,128",
	"He", "Helium", "4.002602", 18, 1, "127,255,212",
	"Li", "Lithium", "6.941", 1, 2, "255,165,0",
	"Be", "Beryllium", "9.012182", 2, 2, "255,215,0",
	"B", "Boron", "10.811", 13, 2, "50,205,50",
	"C", "Carbon", "12.0107", 14, 2, "0,255,127",
	"N", "Nitrogen", "14.0067", 15, 2, "0,255,127",
	"O", "Oxygen", "15.9994", 16, 2, "0,255,127",
	"F", "Fluorine", "18.9984032", 17, 2, "0,255,127",
	"Ne", "Neon", "20.1797", 18, 2, "127,255,212",
	"Na", "Sodium", "22.98976...", 1, 3, "255,165,0",
	"Mg", "Magnesium", "24.305", 2, 3, "255,215,0",
	"Al", "Aluminium", "26.9815386", 13, 3, "0,145,155",
	"Si", "Silicon", "28.0855", 14, 3, "0,255,127",
	"P", "Phosphorus", "30.973762", 15, 3, "0,255,127",
	"S", "Sulfur", "32.065", 16, 3, "0,255,127",
	"Cl", "Chlorine", "35.453", 17, 3, "0,255,127",
	"Ar", "Argon", "39.948", 18, 3, "127,255,212",
	"K", "Potassium", "39.948", 1, 4, "255,165,0",
	"Ca", "Calcium", "40.078", 2, 4, "255,215,0",
	"Sc", "Scandium", "44.955912", 3, 4, "255,105,180",
	"Ti", "Titanium", "47.867", 4, 4, "255,105,180",
	"V", "Vanadium", "50.9415", 5, 4, "255,105,180",
	"Cr", "Chromium", "51.9961", 6, 4, "255,105,180",
	"Mn", "Manganese", "54.938045", 7, 4, "255,105,180",
	"Fe", "Iron", "55.845", 8, 4, "255,105,180",
	"Co", "Cobalt", "58.933195", 9, 4, "255,105,180",
	"Ni", "Nickel", "58.6934", 10, 4, "255,105,180",
	"Cu", "Copper", "63.546", 11, 4, "255,105,180",
	"Zn", "Zinc", "65.38", 12, 4, "255,105,180",
	"Ga", "Gallium", "69.723", 13, 4, "0,145,155",
	"Ge", "Germanium", "72.63", 14, 4, "0,145,155",
	"As", "Arsenic", "74.9216", 15, 4, "0,255,127",
	"Se", "Selenium", "78.96", 16, 4, "0,255,127",
	"Br", "Bromine", "79.904", 17, 4, "0,255,127",
	"Kr", "Krypton", "83.798", 18, 4, "127,255,212",
	"Rb", "Rubidium", "85.4678", 1, 5, "255,165,0",
	"Sr", "Strontium", "87.62", 2, 5, "255,215,0",
	"Y", "Yttrium", "88.90585", 3, 5, "255,105,180",
	"Zr", "Zirconium", "91.224", 4, 5, "255,105,180",
	"Nb", "Niobium", "92.90628", 5, 5, "255,105,180",
	"Mo", "Molybdenum", "95.96", 6, 5, "255,105,180",
	"Tc", "Technetium", "(98)", 7, 5, "255,105,180",
	"Ru", "Ruthenium", "101.07", 8, 5, "255,105,180",
	"Rh", "Rhodium", "102.9055", 9, 5, "255,105,180",
	"Pd", "Palladium", "106.42", 10, 5, "255,105,180",
	"Ag", "Silver", "107.8682", 11, 5, "255,105,180",
	"Cd", "Cadmium", "112.411", 12, 5, "255,105,180",
	"In", "Indium", "114.818", 13, 5, "0,145,155",
	"Sn", "Tin", "118.71", 14, 5, "0,145,155",
	"Sb", "Antimony", "121.76", 15, 5, "0,145,155",
	"Te", "Tellurium", "127.6", 16, 5, "0,255,127",
	"I", "Iodine", "126.90447", 17, 5, "0,255,127",
	"Xe", "Xenon", "131.293", 18, 5, "127,255,212",
	"Cs", "Caesium", "132.9054", 1, 6, "255,165,0",
	"Ba", "Barium", "132.9054", 2, 6, "255,215,0",
	"La", "Lanthanum", "138.90547", 4, 9, "255,105,180",
	"Ce", "Cerium", "140.116", 5, 9, "245,222,179",
	"Pr", "Praseodymium", "140.90765", 6, 9, "245,222,179",
	"Nd", "Neodymium", "144.242", 7, 9, "245,222,179",
	"Pm", "Promethium", "(145)", 8, 9, "245,222,179",
	"Sm", "Samarium", "150.36", 9, 9, "245,222,179",
	"Eu", "Europium", "151.964", 10, 9, "245,222,179",
	"Gd", "Gadolinium", "157.25", 11, 9, "245,222,179",
	"Tb", "Terbium", "158.92535", 12, 9, "245,222,179",
	"Dy", "Dysprosium", "162.5", 13, 9, "245,222,179",
	"Ho", "Holmium", "164.93032", 14, 9, "245,222,179",
	"Er", "Erbium", "167.259", 15, 9, "245,222,179",
	"Tm", "Thulium", "168.93421", 16, 9, "245,222,179",
	"Yb", "Ytterbium", "173.054", 17, 9, "245,222,179",
	"Lu", "Lutetium", "174.9668", 18, 9, "245,222,179",
	"Hf", "Hafnium", "178.49", 4, 6, "255,105,180",
	"Ta", "Tantalum", "180.94788", 5, 6, "255,105,180",
	"W", "Tungsten", "183.84", 6, 6, "255,105,180",
	"Re", "Rhenium", "186.207", 7, 6, "255,105,180",
	"Os", "Osmium", "190.23", 8, 6, "255,105,180",
	"Ir", "Iridium", "192.217", 9, 6, "255,105,180",
	"Pt", "Platinum", "195.084", 10, 6, "255,105,180",
	"Au", "Gold", "196.966569", 11, 6, "255,105,180",
	"Hg", "Mercury", "200.59", 12, 6, "255,105,180",
	"Tl", "Thallium", "204.3833", 13, 6, "0,145,155",
	"Pb", "Lead", "207.2", 14, 6, "0,145,155",
	"Bi", "Bismuth", "208.9804", 15, 6, "0,145,155",
	"Po", "Polonium", "(209)", 16, 6, "0,145,155",
	"At", "Astatine", "(210)", 17, 6, "0,255,127",
	"Rn", "Radon", "(222)", 18, 6, "127,255,212",
	"Fr", "Francium", "(223)", 1, 7, "255,165,0",
	"Ra", "Radium", "(226)", 2, 7, "255,215,0",
	"Ac", "Actinium", "(227)", 4, 10, "255,105,180",
	"Th", "Thorium", "232.03806", 5, 10, "255,0,255",
	"Pa", "Protactinium", "231.0588", 6, 10, "255,0,255",
	"U", "Uranium", "238.02891", 7, 10, "255,0,255",
	"Np", "Neptunium", "(237)", 8, 10, "255,0,255",
	"Pu", "Plutonium", "(244)", 9, 10, "255,0,255",
	"Am", "Americium", "(243)", 10, 10, "255,0,255",
	"Cm", "Curium", "(247)", 11, 10, "255,0,255",
	"Bk", "Berkelium", "(247)", 12, 10, "255,0,255",
	"Cf", "Californium", "(251)", 13, 10, "255,0,255",
	"Es", "Einstenium", "(252)", 14, 10, "255,0,255",
	"Fm", "Fermium", "(257)", 15, 10, "255,0,255",
	"Md", "Mendelevium", "(258)", 16, 10, "255,0,255",
	"No", "Nobelium", "(259)", 17, 10, "255,0,255",
	"Lr", "Lawrencium", "(262)", 18, 10, "255,0,255",
	"Rf", "Rutherfordium", "(267)", 4, 7, "255,105,180",
	"Db", "Dubnium", "(268)", 5, 7, "255,105,180",
	"Sg", "Seaborgium", "(271)", 6, 7, "255,105,180",
	"Bh", "Bohrium", "(272)", 7, 7, "255,105,180",
	"Hs", "Hassium", "(270)", 8, 7, "255,105,180",
	"Mt", "Meitnerium", "(276)", 9, 7, "255,105,180",
	"Ds", "Darmstadium", "(281)", 10, 7, "255,105,180",
	"Rg", "Roentgenium", "(280)", 11, 7, "255,105,180",
	"Cn", "Copernicium", "(285)", 12, 7, "255,105,180",
	"Nh", "Nihonium", "(286)", 13, 7, "0,145,155",
	"Fl", "Flerovium", "(289)", 14, 7, "0,145,155",
	"Mc", "Moscovium", "(290)", 15, 7, "0,145,155",
	"Lv", "Livermorium", "(293)", 16, 7, "0,145,155",
	"Ts", "Tennessine", "(294)", 17, 7, "240,255,240",
	"Og", "Oganesson", "(294)", 18, 7, "240,255,240",
];

var camera, scene, renderer;
var controls;
const posicionInicialCamara = {
	x: 0,
	y: 0,
	z: 2800
}

var objects = [];
var targets = { table: [],esfera:[],simple:[]};

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = posicionInicialCamara["z"];

	scene = new THREE.Scene();

	crearObjetoCSS3D();
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

	window.addEventListener('resize', onWindowResize, false);
}

function posicionarElementosEnTabla(table, index) {

	let object = new THREE.Object3D();

	object.position.x = (table[index + 3] * 140) - 1330;
	object.position.y = -(table[index + 4] * 180) + 990;
	targets.table.push(object);

}

function crearObjetoCSS3D() {

	for (let i = 0; i < table.length; i += 6) {

		let object = new CSS3DObject(crearElementoHTMLYSuEvento(table, i));
		object.position.x = Math.random() * 10 - 2000;
		object.position.y = Math.random() * 10 - 2000;
		object.position.z = Math.random() * 10 - 2000;

		scene.add(object);
		objects.push(object);
		targets.simple.push(object);
		posicionarElementosEnTabla(table, i);

	}
}

function crearElementoHTMLYSuEvento(table, i) {
	let element = document.createElement('div');
	element.className = 'element';
	element.style.backgroundColor = 'rgba(' + table[i + 5] + (Math.random() * 0.5 + 0.25) + ')';

	let number = document.createElement('div');
	number.className = 'number';
	number.textContent = (i / 5) + 1;
	element.appendChild(number);

	let symbol = document.createElement('div');
	symbol.className = 'symbol';
	symbol.textContent = table[i];
	element.appendChild(symbol);

	let details = document.createElement('div');
	details.className = 'details';
	details.innerHTML = table[i + 1] + '<br>' + table[i + 2];
	element.appendChild(details);

	element.addEventListener('mouseover', () => elementClickHandler(i), false);//Agrego tween.removeall... para no cancelar lo de sphere
	element.addEventListener('mouseout', () => elementMouseOutHandler(), false);
	//NUEVO MOVER MOUSE
	//element.addEventListener('mousemove', onDocumentMouseMove, false);

	return element;
}

function elementClickHandler(i) {

	TWEEN.removeAll();

	transform(targets.table, 2000);

	// Adelanta el elemento hacia la camara
	new TWEEN.Tween(targets.simple[i / 6].position)
		.to({
			z: 100//2500 para el centro... con x e y en 0
		}, Math.random() * 2000 + 2000)
		.easing(TWEEN.Easing.Exponential.InOut)
		.start();

	new TWEEN.Tween(this)
		.to({}, 1000 * 2)
		.onUpdate(render)
		.start();
}

function elementMouseOutHandler() {

	TWEEN.removeAll();

	console.log("salio el mouse del elemento");
	transform(targets.table, 300);
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


	vectorDeEsfera.copy(object.position).multiplyScalar(2);

	object.lookAt(vectorDeEsfera);

	targets.esfera.push(object);
}

function agregarEventosDeClickABotones() {
	agregarClickListennerABoton(targets.table, 'tabla');
	agregarClickListennerABoton(targets.esfera, 'esfera');
}

function agregarClickListennerABoton(target, elementId) {

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

			/*var tweenE = new TWEEN.Tween(camera.position).to({
				x: 0,
				y: 0,
				z: 100//2500 para el centro... con x e y en 0
			}, 4000)
				.easing(TWEEN.Easing.Exponential.InOut)
				.start();
						  
            /*new TWEEN.Tween(this)
                .to({}, 1000 * 2)
                .onUpdate(render)
                .start();	*/

			//console.log(tweenE); 
			//transform(target, 2000);
		} else {
			agregarAnimacionALaCamara(camera.position, posicionInicialCamara);
        }
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

	for (var i = 0; i < objects.length; i++) {

		var object = objects[i];
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