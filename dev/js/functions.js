window.addEventListener('load',init);

function init(){
	var canvas = document.getElementById('micanvas');

	var ctx = canvas.getContext('2d');

	/*
	Dibuja un rectangulo
	ctx.fillRect(coordX,coordY,ancho,alto);
	*/

	ctx.fillRect(20,10,50,60);
}