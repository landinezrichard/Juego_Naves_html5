window.addEventListener('load',init);

var canvas = document.getElementById('micanvas');

var ctx = canvas.getContext('2d');

var fondo;

var nave = {
	x: 100,
	y: canvas.height-60,
	width: 50,
	height: 50,
	velocidad: 6
}

var juego ={
	estado: 'iniciando'
};

var teclado = {};

var proyectiles = [];

var enemigos = [];

function init(){
	eventosTeclado();	
	loadMedia();
}

function loadMedia(){
	fondo = new Image();
	fondo.src = '../images/space.jpg';
	fondo.onload = function (){
		var intervalo = window.setInterval(frameLoop, 1000/55);
	}
}

function erase(canvas, ctx){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawBackground(){
	ctx.drawImage(fondo,0,0);
}

function drawNave(){
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.fillRect(nave.x,nave.y,nave.width,nave.height);
	ctx.restore();
}

function eventosTeclado(){
	document.addEventListener('keydown',function(e){		
			teclado[e.keyCode] = true;
		},
	false);

	document.addEventListener('keyup',function(e){
			teclado[e.keyCode] = false;
		},
	false);
}

function moverNave(){
	//tecla flecha izq = 37
	if(teclado[37]){
		nave.x -= nave.velocidad;
		if (nave.x < 0) {
			nave.x = 0;
		}
	}
	//tecla flecha der = 39
	if(teclado[39]){
		var limite = canvas.width - nave.width;
		nave.x += nave.velocidad;
		if (nave.x > limite) {
			nave.x = limite;
		}
	}
	//Tecla barra espaciadora = 32
	if(teclado[32]){
		/*
		Restrinjimos los diparos, para que no salgan muchos al mismo tiempo (si el usuario deja presionada la barra espaciadora), esto lo hacemos con una variable booleana teclado.fire
		*/
		if(teclado.fire){
			crearProyectil();
			teclado.fire = false;
		}
	}else{
		teclado.fire = true;
	}
}

function crearProyectil(){
	proyectiles.push({
		x: nave.x + 20,
		y: nave.y -10,
		width: 10,
		height: 30
	});
}

function moverProyectiles(){
	for (var i in proyectiles) {
		var bala = proyectiles[i];
		bala.y -= 2;
	}

	/*
	Filtramos los proyectiles, eliminando los que salen fuera del canvas
	*/
	proyectiles = proyectiles.filter(function(bala){
			return bala.y > 0;
	});
}

function drawProyectiles(){
	ctx.save();

	ctx.fillStyle = 'white';

	for (var i in proyectiles) {
		
		var bala = proyectiles[i];

		ctx.fillRect(bala.x,bala.y,bala.width,bala.height);
	}

	ctx.restore();
}

function drawEnemigos(){
	ctx.save();
	
	for (var i in enemigos) {
		
		var enemigo = enemigos[i];

		if(enemigo.estado == 'vivo'){
			ctx.fillStyle = 'red';
		}
		if(enemigo.estado == 'muerto'){
			ctx.fillStyle = 'black';
		}
		ctx.fillRect(enemigo.x,enemigo.y,enemigo.width,enemigo.height);
	}

	ctx.restore();
}

function actualizaEnemigos(){
	if(juego.estado == 'iniciando'){
		for(var i = 0;i<10;i++){
			enemigos.push({
				x: 10 + (i*50),
				y: 10,
				height: 40,
				width: 40,
				estado: 'vivo',
				contador: 0
			});
		}
		juego.estado = 'jugando';
	}

	/*
	utilizamos la función trigonometrica seno, porque nos permite obtener valores positivos y negativos, esto para que los enemigos se muevan de izquierda a derecha, sin salirse de la pantalla.
	*/

	for (var i in enemigos){
		var enemigo = enemigos[i];
		if(!enemigo){
			continue;
		}
		if(enemigo && enemigo.estado == 'vivo'){
			enemigo.contador++;
			enemigo.x += Math.sin(enemigo.contador * Math.PI / 90)*5;
		}
	};
}

function frameLoop(){
	moverNave();
	moverProyectiles();
	actualizaEnemigos();
	drawBackground();
	drawProyectiles();
	drawEnemigos();
	drawNave();
}


/*
- Cambia el alpha global del color
	(recibe valores entre el 0 al 1)
	
	ctx.globalAlpha = 0.5;

- Cambia el color de relleno

	ctx.fillStyle = 'red';

- Traza y dibuja un rectangulo relleno
	ctx.fillRect(coordX,coordY,ancho,alto);

	ctx.fillRect(20,10,50,60);

- Cambia el color del borde

	ctx.strokeStyle = "blue";

- Modifica el ancho de línea (default = 1)

	ctx.lineWidth = 10;

- Traza y dibuja un rectangulo sin relleno

	ctx.strokeRect(90,90,50,50);

- Borra, en forma de rectangulo:

	ctx.clearRect(x,y,ancho.alto);

- Genera el trazo de un arco (se usa para circulos)

	ctx.arc(x,y,radio,anguloInicial,anguloFinal,antiReloj);

	Los angulos se dan en radianes.

	El valor "antiReloj" es un booleano(default = false).

	Si lo dejamos sin: "ctx.stroke()" ó "ctx.fill()", no dibuja nada

- Dibuja el trazo de la figura:

	ctx.stroke();

- Rellena el trazo:

	ctx.fill();

- Empieza un nuevo camino o trazo, es decir, no continua dibujando desde donde iva.

	ctx.beginPath();

- Se mueve hacia un nuevo punto, sin trazar.

	ctx.moveTo(x,y);

- Dibujar Imagen:

	ctx.drawImage(imagen,x,y,ancho,alto);

- Guardar estado del contexto:

	ctx.save();

	Sirve para guardar, por ejemplo el color del borde, antes de que sea modificado.

- Restaurar el estado del contexto:

	ctx.restore();

	Sirve para retaurar al ultimo estado del contexto, es decir, al punto en donde se guardo con "ctx.save()". 
*/