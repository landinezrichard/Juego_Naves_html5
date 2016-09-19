window.addEventListener('load',init);

function init(){
	var canvas = document.getElementById('micanvas');

	var ctx = canvas.getContext('2d');

	/*
	Cambia el alpha global del color

	recibe valores entre el 0 al 1
	*/

	ctx.globalAlpha = 0.5;

	/*
	Cambia el color de relleno
	*/
	ctx.fillStyle = 'red';

	/*
	Dibuja un rectangulo relleno
	ctx.fillRect(coordX,coordY,ancho,alto);
	*/

	ctx.fillRect(20,10,50,60);

	/*
	Cambia el color del borde
	*/

	ctx.strokeStyle = "blue";

	/*
	Modifica el ancho de línea (default = 1)
	*/

	ctx.lineWidth = 10;

	/*
	Dibuja en rectangulo sin relleno
	*/

	ctx.strokeRect(90,90,50,50);
}