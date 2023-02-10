/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];

// Array de número de cartas
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// let numeros = [9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes				
let tapeteInicial = document.getElementById("inicial");
let tapeteSobrantes = document.getElementById("sobrantes");
let tapeteReceptor1 = document.getElementById("receptor1");
let tapeteReceptor2 = document.getElementById("receptor2");
let tapeteReceptor3 = document.getElementById("receptor3");
let tapeteReceptor4 = document.getElementById("receptor4");

// Mazos
let mazoInicial = [];
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas
let contInicial = document.getElementById("contador_inicial");
let contSobrantes = document.getElementById("contador_sobrantes");
let contReceptor1 = document.getElementById("contador_receptor1");
let contReceptor2 = document.getElementById("contador_receptor2");
let contReceptor3 = document.getElementById("contador_receptor3");
let contReceptor4 = document.getElementById("contador_receptor4");
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


// El juego comienza al cargar la página
comenzarJuego();


function comenzarJuego() {
	/* Crear baraja con elementos HTML <img>, donde cada uno de ellos es una carta, barrajar
	el mazo de forma aleatoria, cargar las cartas en el tapete inicial e inicializar los contadores
	y el cronómetro .
	*/
	// Crear la baraja de elementos HTML <img> y definir sus atributos
	for (i in palos) {
		for (j in numeros) {
			let carta = document.createElement("img");
			let source = "./imagenes/baraja/" + numeros[j] + "-" + palos[i] + ".png"
			carta.src = source;
			carta.id = numeros[j] + "-" + palos[i];
			carta.setAttribute("data-numero", numeros[j]);
			carta.setAttribute("data-palo", palos[i]);
			carta.ondragstart = dragStart;
			mazoInicial.push(carta);
		}
	}
	// Barajar el mazo inicial
	barajar(mazoInicial);
	// Cargar el mazo inicial en el tapete inicial
	cargarTapeteInicial(mazoInicial);
	// Inicializar los contadores de mazos y movimientos
	setContador(contInicial, mazoInicial.length);
	setContador(contSobrantes, 0);
	setContador(contReceptor1, 0);
	setContador(contReceptor2, 0);
	setContador(contReceptor3, 0);
	setContador(contReceptor4, 0);
	setContador(contMovimientos, 0);
	// Arrancar el conteo de tiempo
	arrancarTiempo()
}


function reset() {
	/* Inicializar los mazos y limpiar los tapetes para comenzar el juego
	nuevamente con el botón de reiniciar. El reinicio de los contadores y 
	el cronómetro se realiza en la función comenzarJuego.
	*/
	mazoInicial = [];
	mazoSobrantes = [];
	mazoReceptor1 = [];
	mazoReceptor2 = [];
	mazoReceptor3 = [];
	mazoReceptor4 = [];

	limpiarTapete(tapeteInicial);
	limpiarTapete(tapeteSobrantes);
	limpiarTapete(tapeteReceptor1);
	limpiarTapete(tapeteReceptor2);
	limpiarTapete(tapeteReceptor3);
	limpiarTapete(tapeteReceptor4);

	comenzarJuego();
}


function dragStart(event) {
	/* Establecer el conjunto de datos para el evento ondragstart al arrastrar una
	carta.
	*/
	event.dataTransfer.setData("text/plain/idCarta", event.target.id);
	event.dataTransfer.setData("text/plain/numero", event.target.dataset["numero"]);
	event.dataTransfer.setData("text/plain/palo", event.target.dataset["palo"]);
	event.dataTransfer.setData("text/plain/idTapete", event.target.dataset["tapete"]);
}


function allowDrop(event) {
	/* Desactivar el comportamiento por defecto del evento ondragover.
	*/
	event.preventDefault();
}


function drop(tapete, event) {
	/* Revisar las condiciones para que una carta pueda ser movida de un mazo a otro
	y en caso de ser correcto realizar el movimiento de la misma. Se ejecuta con el 
	evento ondrop de los tapetes al soltar una carta con la intención de moverla.
	Recibe como parámetro el elemento HTML del tapete receptor y el respectivo evento.
	*/

	// Desactivar el comportamiento por defecto del evento ondrop
	event.preventDefault();

	// Recuperar las variables del evento
	let idCarta = event.dataTransfer.getData("text/plain/idCarta");
	let numero = parseInt(event.dataTransfer.getData("text/plain/numero"));
	let palo = event.dataTransfer.getData("text/plain/palo");
	let idTapete = event.dataTransfer.getData("text/plain/idTapete");

	// Recuperar el elemento HTML de la carta
	let carta = document.getElementById(idCarta);

	// Diccionario con los elementos HTML relevantes en el movimiento de la carta
	let elementosHTML = {
		"emisor": {
			'tapete': {
				"inicial": tapeteInicial,
				"sobrantes": tapeteSobrantes
			},
			'mazo': {
				"inicial": mazoInicial,
				"sobrantes": mazoSobrantes
			}
		},
		'receptor': {
			'tapete': {
				"sobrantes": tapeteSobrantes,
				"receptor1": tapeteReceptor1,
				"receptor2": tapeteReceptor2,
				"receptor3": tapeteReceptor3,
				"receptor4": tapeteReceptor4
			},
			'mazo': {
				"sobrantes": mazoSobrantes,
				"receptor1": mazoReceptor1,
				"receptor2": mazoReceptor2,
				"receptor3": mazoReceptor3,
				"receptor4": mazoReceptor4
			},
		},
		'contador': {
			"inicial": contInicial,
			"receptor1": contReceptor1,
			"receptor2": contReceptor2,
			"receptor3": contReceptor3,
			"receptor4": contReceptor4,
			"sobrantes": contSobrantes
		}
	};

	// Definir los elementos HTML involucrados en el movimiento de la carta
	let tapeteEmisor = elementosHTML.emisor.tapete[idTapete];
	let tapeteReceptor = elementosHTML.receptor.tapete[tapete.id];
	let mazoEmisor = elementosHTML.emisor.mazo[tapeteEmisor.id]
	let mazoReceptor = elementosHTML.receptor.mazo[tapeteReceptor.id];
	let contEmisor = elementosHTML.contador[tapeteEmisor.id];
	let contReceptor = elementosHTML.contador[tapeteReceptor.id];

	// Revisar las condiciones necesarias para realizar el movimiento de la carta de un mazo a otro
	if ((tapeteReceptor.id == 'sobrantes') || (tapeteReceptor.id != 'sobrantes' && mazoReceptor.length == 0 && numero == 12)) {
		agregarCarta(mazoEmisor, mazoReceptor, tapeteEmisor, tapeteReceptor, contEmisor, contReceptor, carta);
	} else if (tapeteReceptor.id != 'sobrantes' && mazoReceptor.length > 0) {
		let numeroReceptor = mazoReceptor[mazoReceptor.length - 1].dataset["numero"];
		let paloReceptor = mazoReceptor[mazoReceptor.length - 1].dataset["palo"];
		let condicionColor = false;

		if ((['cir', 'hex'].includes(paloReceptor) && ['cua', 'viu'].includes(palo))
			|| (['cua', 'viu'].includes(paloReceptor) && ['cir', 'hex'].includes(palo))) {
			condicionColor = true
		}

		if (numero + 1 == numeroReceptor && condicionColor == true) {
			agregarCarta(mazoEmisor, mazoReceptor, tapeteEmisor, tapeteReceptor, contEmisor, contReceptor, carta);
		}
	}
}


function agregarCarta(mazoEmisor, mazoReceptor, tapeteEmisor, tapeteReceptor, contEmisor, contReceptor, carta) {
	/* Mover una carta de un mazo a otro eliminandola del mazo de origen
	y agregandola al mazo de destino. También ajusta los contadores de
	los mazos involucrados y el contador de movimientos.
	*/
	if (tapeteReceptor.id == 'sobrantes') {
		carta.draggable = true;
	} else {
		carta.draggable = false;
	}
	carta.style.top = "50%";
	carta.style.left = "50%";
	carta.style.transform = "translate(-50%, -50%)";
	carta.setAttribute("data-tapete", tapeteReceptor.id);
	carta.ondblclick = "";
	mazoEmisor.pop();
	mazoReceptor.push(carta);
	tapeteReceptor.appendChild(carta);
	if (['inicial', 'sobrantes'].includes(tapeteEmisor.id) && mazoEmisor.length > 0) {
		let cartaSuperior = mazoEmisor[mazoEmisor.length - 1];
		cartaSuperior.draggable = true;

		if (tapeteEmisor.id == 'inicial') {
			cartaSuperior.ondblclick = dobleClick;
		}
	}
	decContador(contEmisor);
	incContador(contReceptor);
	incContador(contMovimientos);
	revisarFinJuego();
}


function dobleClick() {
	/* Mover la carta superior del mazo inicial al mazo de sobrantes al hacer
	doble click sobre esta.
	*/
	carta = tapeteInicial.lastElementChild;
	agregarCarta(mazoInicial, mazoSobrantes, tapeteInicial, tapeteSobrantes, contInicial, contSobrantes, carta, true);
}


function revisarFinJuego() {
	/* Revisar si el mazo inicial se ha quedado sin cartas para barajar
	el mazo de sobrantes en caso de que este aún tenga cartas. En caso de que el
	jugador haya finalizado el juego muestra el mensaje respectivo mensaje.
	*/
	if (mazoInicial.length == 0 && mazoSobrantes.length > 0) {
		mazoInicial = mazoSobrantes;
		mazoSobrantes = [];
		limpiarTapete(tapeteSobrantes);
		barajar(mazoInicial);
		cargarTapeteInicial(mazoInicial);
		setContador(contInicial, mazoInicial.length);
		setContador(contSobrantes, 0);
	} else if (mazoInicial.length == 0 && mazoSobrantes.length == 0) {
		let mensaje = "Bien jugado! Has completado la partida en " + contTiempo.firstChild.data + " y " + contMovimientos.firstChild.data + " movimientos\n¿Quieres volver a jugar?";
		let reiniciarJuego = true;

		clearInterval(temporizador)
		reiniciarJuego = confirm(mensaje);

		if (reiniciarJuego == true) {
			reset();
		}
	}
}


function limpiarTapete(tapete) {
	/* Eliminar todos los nodos hijos tipo <img> de un tapete
	*/
	let nodos = [];
	for (i in tapete.children) {
		if (tapete.children[i].tagName == 'IMG') {
			nodos.push(tapete.children[i]);
		}
	}
	for (i in nodos) {
		tapete.removeChild(nodos[i])
	}
}


function arrancarTiempo() {
	/** Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el 
	format hh:mm:ss en el contador adecuado.
	
	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:
	
	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )
	
	donde % denota la operación módulo (resto de la división entre los operadores)
	
	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14
	
	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que 
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a clearInterval en su caso.   
	*/
	if (temporizador) clearInterval(temporizador);
	let hms = function () {
		let seg = Math.trunc(segundos % 60);
		let min = Math.trunc((segundos % 3600) / 60);
		let hor = Math.trunc((segundos % 86400) / 3600);
		let tiempo = ((hor < 10) ? "0" + hor : "" + hor)
			+ ":" + ((min < 10) ? "0" + min : "" + min)
			+ ":" + ((seg < 10) ? "0" + seg : "" + seg);
		setContador(contTiempo, tiempo);
		segundos++;
	}
	segundos = 0;
	hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);

}

function barajar(mazo) {
	/**	Ordenar aleatoriament un mazo.
	*/
	mazo.sort(function () {
		return Math.random() - 0.5;
	});
}


function cargarTapeteInicial(mazo) {
	/* Añadir al elemento HTML que representa el tapete inicial (variable tapeteInicial)
	los elementos <img> del array mazoInicial.
	*/
	let posicion = 0;

	for (i in mazo) {
		let carta = mazo[i];
		carta.style.width = "60px";
		carta.style.position = "absolute";
		carta.style.left = posicion + "px";
		carta.style.top = posicion + "px";
		carta.style.transform = "";
		carta.setAttribute("data-tapete", 'inicial');
		if (i == mazo.length - 1) {
			carta.draggable = true;
			carta.ondblclick = dobleClick;
		} else {
			carta.draggable = false;
		}
		tapeteInicial.appendChild(carta);
		posicion += paso;
	}
}



function incContador(contador) {
	/* Incrementar el número correspondiente al contenido textual
	del elemento que actúa de contador
	*/
	contador.firstChild.data = parseInt(contador.firstChild.data) + 1;
}


function decContador(contador) {
	/* Disminuir el número correspondiente al contenido textual
	del elemento que actúa de contador
	*/
	contador.firstChild.data = parseInt(contador.firstChild.data) - 1;
}


function setContador(contador, valor) {
	/* Establecer un valor determinado al contenido textual
	del elemento que actúa de contador
	*/
	if (contador.hasChildNodes()) {
		contador.firstChild.data = valor;
	} else {
		let textNode = document.createTextNode(valor)
		contador.appendChild(textNode)
	}
}