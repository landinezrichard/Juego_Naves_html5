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

	- Dibujar Imagen:

		ctx.drawImage(imagen,x,y,ancho,alto);

	- Guardar estado del contexto:

		ctx.save();

		Sirve para guardar, por ejemplo el color del borde, antes de que sea modificado.

	- Restaurar el estado del contexto:

		ctx.restore();

		Sirve para retaurar al ultimo estado del contexto, es decir, al punto en donde se guardo con "ctx.save()". 
	*/

	ctx.strokeStyle = 'black';
	dibujarCirculo(ctx,'red');
	ctx.strokeRect(0,0,20,30);

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

function dibujarCirculo(ctx,color){
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.arc(70,70,25,0,toRadianes(360));
	ctx.stroke();
	ctx.restore();
}