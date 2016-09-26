window.addEventListener('load',init);

var canvas = document.getElementById('micanvas');

var ctx = canvas.getContext('2d');

var fondo;

var nave = {
	x: 100,
	y: canvas.height-60,
	width: 50,
	height: 50,
	velocidad: 6,
	contador: 0
}

var juego ={
	estado: 'iniciando'
};

var teclado = {};

var proyectiles = [];

var enemigos = [];

var disparosEnemigos = [];

var textoRespuesta ={
	contador: -1,
	titulo: "",
	subtitulo: ""
}

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
	//Verificamos cuando la nave es golpeada (pierde)
	if( nave.estado == 'hit' ){
		nave.contador++;
		//Se pone "20" para dar un poco de tiempo en que aparezca el mensaje game over
		if ( nave.contador >= 20){
			nave.contador = 0;
			nave.estado = 'muerto';
			juego.estado = 'perdido';
			textoRespuesta.titulo = 'Game Over';
			textoRespuesta.subtitulo = 'Presiona la tecla R para continuar';
			textoRespuesta.contador = 0;
		} 
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
		if(enemigo.estado == 'hit'){
			ctx.fillStyle = '#14B036';
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

			//Crea el disparo enemigo
			//igual a 4 para limitar los disparos y sea mas dificl que quede en 4.
			if( aleatorio(0,enemigos.length*10) == 4){
				disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
			}
		}
		if(enemigo && enemigo.estado == 'hit'){
			enemigo.contador++;
			if(enemigo.contador >= 20){
				enemigo.estado = 'muerto';
				enemigo.contador = 0;
			}
		}
	}

	/* Eliminamos los enemigos muertos*/
	enemigos = enemigos.filter(function(enemigo){
		if(enemigo && enemigo.estado != 'muerto'){
			return true;
		}
		return false;
	});
}

function colisiones(a,b){
	var hit = false;
	if(b.x + b.width >= a.x && b.x < a.x+ a.width){
		if(b.y + b.height >= a.y && b.y < a.y + a.height){
			hit = true;
		}
	}
	if(b.x <= a.x && b.x + b.width >= a.x + a.width){
		if(b.y <= a.y && b.y + b.height >= a.y + a.height){
			hit = true;
		}
	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width){
		if(a.y <= b.y && a.y + a.height >= b.y + b.height){
			hit = true;
		}
	}
	return hit;
}

function verificarColision(){
	for(var i in proyectiles){
		var bala = proyectiles[i];
		for(j in enemigos){
			var enemigo = enemigos[j];
			if( colisiones(bala,enemigo) ){
				enemigo.estado = "hit";
				enemigo.contador = 0;
			}
		}
	}

	//Verificamos si los disparos enemigos tocan la nave

	if(nave.estado == 'hit' || nave.estado == 'muerto'){
		return;
	}
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		if( colisiones(disparo,nave) ){
			nave.estado = 'hit';
			console.log('nave golpeada');
		}
	}
}

function drawDisparosEnemigos(){
	ctx.save();
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		ctx.fillStyle = 'yellow';
		ctx.fillRect(disparo.x,disparo.y,disparo.width,disparo.height);
	}
	ctx.restore();
}

function moverDisparosEnemigos(){
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		disparo.y += 3;
	}
	disparosEnemigos = disparosEnemigos.filter(function(disparo){
			return disparo.y < canvas.height;
	});
}

function agregarDisparosEnemigos(enemigo){
	return {
		x: enemigo.x,
		y: enemigo.y,
		width: 10,
		height: 10,
		contador: 0
	};
}

function aleatorio(inferior, superior){
	var posibilidades = superior - inferior;
	var aleatorio = Math.random() * posibilidades;

	aleatorio = Math.floor(aleatorio);
	return parseInt(inferior) + aleatorio;
}

function actualizarEstadoJuego(){
	if(juego.estado == 'jugando' && enemigos.length == 0){
		juego.estado = 'victoria';
		textoRespuesta.titulo = 'Derrotaste a los enemigos';
		textoRespuesta.subtitulo = 'Presiona la tecla R para reiniciar';
		textoRespuesta.contador = 0;
	}
	if( textoRespuesta.contador >= 0 ){
		textoRespuesta.contador++;
	}
}

function drawTexto(){
	if(textoRespuesta.contador == -1){
		return;
	}

	/*
	Creamos una variable alpha, para que el texto aparezca con una transparencia y se vuelva solido (efecto como fade)
	*/
	var alpha = textoRespuesta.contador/50.0;

	if(alpha > 1){
		for(var i in enemigos){
			delete enemigos[i];
		}
	}
	ctx.save();
	ctx.globalAlpha = alpha;
	if(juego.estado == 'perdido'){
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo,100,200);
		ctx.font = '14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo,190,250);
	}
	if(juego.estado == 'victoria'){
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo,80,200);
		ctx.font = '14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo,190,250);
	}
}

function frameLoop(){
	actualizarEstadoJuego();
	moverNave();
	moverProyectiles();
	actualizaEnemigos();
	moverDisparosEnemigos();
	verificarColision();
	drawBackground();
	drawProyectiles();	
	drawDisparosEnemigos();
	drawEnemigos();
	drawNave();
	drawTexto();
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

- Dibujar texto en el canvas:

	var texto = 'Hola';

	ctx.font = 'Bold 40pt Arial';

	ctx.fillText(texto,x,y);
*/