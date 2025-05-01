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
class Game{
    constructor(canvasWidth, canvasHeight) {
        //CREAR TODOS LOS OBJETOS

        //Crear la pelota
        this.ball = new Ball(
            //Posicion
            new Vec(canvasWidth / 2, canvasHeight / 2),
            //Ancho
            20,
            //Alto
            20,
            //color
            "black"
        );

        //Crear el paddle
        this.paddle = new Paddle(
            //Posicion
            new Vec(canvasWidth / 2 - 50, canvasHeight - 30),
            //Ancho
            100,
            //Alto
            20,
            //Color
            "black"
        );

        //Crear bordes
        this.topBorder = new GameObject(new Vec(0, 0), canvasWidth, 10, "red", "barrier");
        this.leftBorder = new GameObject(
            //Comienza en la esquina superior izquierda
            new Vec(0, 0),
            //Ancho 
            10, 
            //Alto (de arriba a abajo)
            canvasHeight, 
            //<Color
            "red", 
            //tipo
            "barrier"
        );
        this.rightBorder = new GameObject(
            //Como el ancho es de 10, debe comenzar en 10pc antes que termine el canvas
            new Vec(canvasWidth - 10, 0),
            //Ancho 
            10,
            //Alto (de arriba a abajo)
            canvasHeight,
            //Color
            "red",
            //Tipo 
            "barrier"
        );

        this.lostLife = new GameObject(
            //Comienza en la esquina inferior izquierda
            new Vec(0, canvasHeight - 10),
            //Ancho
            canvasWidth,
            //Alto
            10,
            //Color
            "black",
            //Tipo
            "lostLifeBarrier"
        );

        //CREAR ETIQUETAS
        this.score = new TextLabel(
            //Posicion
            (new Vec(500, 570)),
            //Font
            "30px Arial",
            //Color
            "black"
        );

        this.announcement = new TextLabel(
            //Posicion
            (new Vec(500, 500)),
            //Font
            "30px Arial",
            //Color
            "black"
        );

        this.comboAnnouncement = new TextLabel(
            //Posicion
            (new Vec(500, 480)),
            //Font
            "30px Arial",
            //Color
            "black"
        );

        this.livesLabel = new TextLabel(
            //Posicion
            new Vec(100, 570),
            //Posicion 
            "30px Arial", 
            //Color
            "black"
        );

        this.pongSFX = document.createElement("audio");
        this.pongSFX.src = "../assets/sfx/pop1.wav";

        this.blockSFX = document.createElement("audio");
        this.blockSFX.src = "../assets/sfx/item_pickup.wav";

        this.missingSFX = document.createElement("audio");
        this.missingSFX.src = "../assets/sfx/lose.wav";

        this.wonSFX = document.createElement("audio");
        this.wonSFX.src = "../assets/sfx/Won!.wav";

        this.lostSFX = document.createElement("audio");
        this.lostSFX.src = "../assets/sfx/game_over_bad_chest.wav";

        this.music = document.createElement("audio");
        this.music.src = "../assets/music/music2.wav";
        this.music.addEventListener("ended", function(){
            this.currentTime = 0;
            this.play();
        })

        //Arreglo para crear los bloques
        this.blocks = [];
        this.createBlocks();

        this.points = 0;
        this.lives = 3;

        //Metodo para el movimiento de las teclas
        this.createEventListeners();

        this.checkpoint = 0;

        //COMBOS
        //Contador de bloques rotos
        this.comboCounter = 0;
        //Contador de tiempo para mantener combo 
        this.comboTimer = 0; 
        //Contador de tiempo del combo 
        this.comboDuration = 1500;
    }

    createBlocks(){
        //Como se van a acomodar los bloques
        const rows = 6;
        const cols = 9;

        //Medidas de los bloques
        const blockWidth = 70;
        const blockHeight = 30;

        //Espacio entre bloques
        const gapBetweenBlocks = 10;

        //Distancia entre el bloque y el borde de arriba
        const topStart = 50;
        
        //Distancia entre el bloque y el borde de la izquierda
        const leftStart = 40;

        //Arreglo de colores
        const colors = ["red", "green", "blue", "orange", "purple", "yellow", "pink", "cyan", "lime", "magenta", "lila"];

        //Filas
        for(let r = 0; r < rows; r++){
            //Columnas, por cada fila se van creando las columnas
            for (let c = 0; c < cols; c++){
                //Calcula la posicion del bloque
                const t = topStart + r * (blockHeight + gapBetweenBlocks);
                const l = leftStart + c * (blockWidth + gapBetweenBlocks);

                const color = colors[(r * cols + c) % colors.length];
                
                //Crear el bloque
                this.blocks.push(new Block(
                    //Posicion
                    new Vec(l, t),
                    //Ancho 
                    blockWidth,
                    //Alto
                    blockHeight,
                    //Color 
                    color
                    ));
            }
        }
    }

    update(deltaTime){
        this.paddle.update(deltaTime);
        this.ball.update(deltaTime);

        //Analizar tiempo del combo
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            if (this.comboTimer <= 0) {
                //Se vencio el combo
                this.comboCounter = 0;
            }
        }

        if(boxOverlap(this.ball, this.topBorder)){
            //
            this.ball.velocity.y *= -1;
            this.pongSFX.play();
        }

        if(boxOverlap(this.ball, this.leftBorder) || boxOverlap(this.ball, this.rightBorder)){
            //
            this.ball.velocity.x *= -1;
            this.pongSFX.play();
        }

        if(boxOverlap(this.ball, this.paddle)){
            //
            this.ball.velocity.y *= -1;
            this.pongSFX.play();
        }

        this.blocks.forEach(block => {
            //Si colisionan la pelota y un bloque
            if (!block.destroyed && boxOverlap(this.ball, block)) {
                //Se destruye
                block.destroyed = true;

                //Se suma un punto
                this.points += 1;
                console.log(`Score ${this.points}`)

                //La velocidad
                // Aumenta velocidad cada 6 puntos
                if (this.points >= this.checkpoint + 6) {
                    //Aumenta en un 5%
                    this.ball.velocity = this.ball.velocity.times(speedIncrease);
                    this.checkpoint = this.points;
                }

                if (this.comboTimer > 0) {
                    //Aumentar contador del combo
                    this.comboCounter += 1;
                } else {
                    this.comboCounter = 1;
                }
                //Reiniciar tiempo del combo
                this.comboTimer = this.comboDuration;
    
                if (this.comboCounter >= 2) {
                    const bonus = this.comboCounter - 1;
                    this.points += bonus;
                }

                // this.ball.velocity.y *= -1;
                //Reproduce efecto
                this.blockSFX.play();
            }
        });
        
        //Si toca el borde de abajo
        if (this.ball.position.y + this.ball.height >= canvasHeight) {
            //Se resta una vida
            this.lives -= 1;
            //Regresa la pelota a la posicion inicial
            this.ball.reset();
            this.missingSFX.play();
            //Se pierde el cpmbo
            this.comboCounter = 0;
            this.comboTimer = 0;
        }

        const remainingblocks = this.blocks.filter(block => !block.destroyed).length;

        //Si ya no hay bloques
        if (remainingblocks === 0) {
            this.ball.velocity = new Vec(0, 0);
            this.wonSFX.play();
        }
        
        //Si ya no tienes vidas
        if (this.lives === 0) {
            this.ball.velocity = new Vec(0, 0);
            this.lostSFX.play();
        }
    }

    draw(ctx){
        this.score.draw(ctx, `Score: ${this.points}`);
        this.livesLabel.draw(ctx, `Vidas: ${this.lives}`);
        this.blocks.forEach(block => block.draw(ctx));
        this.leftBorder.draw(ctx);
        this.rightBorder.draw(ctx);
        this.topBorder.draw(ctx);
        this.paddle.draw(ctx);
        this.ball.draw(ctx);

        if (this.lives === 0) {
            this.announcement.draw(ctx, "Game Over! T-T");
        } else if (this.blocks.every(b => b.destroyed)) {
            this.announcement.draw(ctx, "Winner! :3");
        }

        if (this.comboCounter >= 2 && this.comboTimer > 0) {
            this.comboAnnouncement.draw(ctx, `Combo x ${this.comboCounter}! >o<`);
        }
        
    }

    createEventListeners(){
        window.addEventListener('keydown', (event) =>{
            if(event.key === 'a'){
                this.paddle.velocity.x = -paddleVelocity;
            }

            if(event.key === 'd'){
                this.paddle.velocity.x = paddleVelocity;
            }
        });

        window.addEventListener('keyup', (event) =>{
            if(event.key === 'a' || event.key === 'd'){
                this.paddle.velocity.x = 0;
            }

            if (event.key === " ") {
                if (!this.ball.inPlay) {
                    this.ball.initVelocity();
                    this.music.play();
                }
            }
        });
    }
}

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