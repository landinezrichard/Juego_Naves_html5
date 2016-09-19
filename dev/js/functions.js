window.addEventListener('load',init);

function init(){
	var canvas = document.getElementById('micanvas');

	var ctx = canvas.getContext('2d');

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
	*/

	/*Canvas con trazos unidos*/

	ctx.arc(50,50,10,toRadianes(0),toRadianes(360),true);	

	ctx.arc(50,50,30,toRadianes(90),toRadianes(180),true);	

	ctx.arc(150,50,10,toRadianes(0),toRadianes(360),true);	

	ctx.arc(150,50,30,toRadianes(90),toRadianes(360),false);

	ctx.stroke();	

	ctx.arc(90,110,30,toRadianes(0),toRadianes(180));

	ctx.stroke();

	/*Canvas Con las nuevas funciones*/

	var canvas2 = document.getElementById('canvas2');

	var ctx2 = canvas2.getContext('2d');

	ctx2.beginPath();

	ctx2.arc(50,50,10,toRadianes(0),toRadianes(360),true);

	ctx2.moveTo(50,80);

	ctx2.arc(50,50,30,toRadianes(90),toRadianes(180),true);

	ctx2.moveTo(160,50);

	ctx2.arc(150,50,10,toRadianes(0),toRadianes(360),true);

	ctx2.moveTo(150,80);

	ctx2.arc(150,50,30,toRadianes(90),toRadianes(360),false);

	ctx2.stroke();

	ctx2.beginPath();

	ctx2.arc(90,110,30,toRadianes(0),toRadianes(180));

	ctx2.stroke();
}


function erase(canvas, ctx){

	/*
	Dibuja un rectangulo transparente, usado para borrar.

	En este caso borra todo el lienzo o canvas.
	*/
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

function toRadianes(grados){
	return (grados * Math.PI) / 180;
}