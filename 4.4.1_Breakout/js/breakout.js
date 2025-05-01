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

//Paddle

//Bloques

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