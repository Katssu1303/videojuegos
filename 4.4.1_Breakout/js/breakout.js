"use strict";

//VARIABLES Y CONSTANTES GLOBALES PARA EL JUEGO

//Tamaño del canvas
const canvasWidth = 800;
const canvasHeight = 600;
//Variable para almacenar los tiempos de los frames
let oldTime;
//Constantes para el manejo de velociadades
const paddleVelocity = 0.8;
const speedIncrease = 1;
const initialSpeed = 0.2;
//Contexto 2D para dibujar
let ctx;
//Objeto game
let game;

//CLASES PARA EL JUEGO
//Pelota
class Ball extends GameObject{
    constructor(position, width, height, color){
        //Llamar al constructor de la clase padre
        super(position, width, height, color, "ball");
        //Regresarla al centro
        this.reset();
    }

    update(deltaTime){
        //Cambia la velocidad dependiendo la velocidad -> d = v * t
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    initVelocity() {
        //Define un angulo que vaya hacia abajo o lados de manera random
        const angle = Math.random() * Math.PI / 2 + Math.PI / 4;
        //Obtiene la direccion ****
        this.velocity = new Vec(Math.cos(angle), Math.sin(angle)).times(initialSpeed);
        //Le da una direccion random derecha o izquierda
        this.velocity.x *= Math.random() > 0.5 ? 1 : -1;
        this.inPlay = true;
    }

    reset() {
        //Posiscion -> centro
        this.position = new Vec(canvasWidth / 2, canvasHeight / 2);
        //Velocidad = 0 -> no se mueve
        this.velocity = new Vec(0, 0);
        //No se mueve hasta presionar la barra
        this.inPlay = false;
    }
}

//Paddle
class Paddle extends GameObject{
    constructor(position, width, height, color) {
        //Llamar al constructor de la clase padre
        super(position, width, height, color, "paddle");
        //Velocidad = 0 -> no se mueve
        this.velocity = new Vec(0, 0);
    }

    update(deltaTime){
        //Cambia la velocidad dependiendo la velocidad -> d = v * t
        this.position = this.position.plus(this.velocity.times(deltaTime));

        //No deja que la paleta se salga del canvas (ni derecha ni izquierda por eso eje x)
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }
}

//Bloques
class Block extends GameObject {
    constructor(position, width, height, color) {
        //Llamar al constructor de la clase padre
        super(position, width, height, color, "block");
        //Empiezan completos
        this.destroyed = false;
    }

    //Los bloques se dibujan solo si no estan destruidos (destroyed == false)
    draw(ctx) {
        if (!this.destroyed) {
            super.draw(ctx);
        }
    }
}

//Game

//Funcion main
// Get a reference to the object with id 'canvas' in the page
const canvas = document.getElementById('canvas');
// Resize the element
canvas.width = canvasWidth;
canvas.height = canvasHeight;
// Get the context for drawing in 2D
ctx = canvas.getContext('2d');

game = new Game(canvasWidth, canvasHeight);

drawScene(0);

//Funcion drawScene
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;
    //console.log(`DeltaTime: ${deltaTime}`);

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update all game objects
    game.update(deltaTime);

    // Draw all game objects
    game.draw(ctx);

    // Update the time for the next frame
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}