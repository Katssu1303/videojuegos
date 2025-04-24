/*
Katia Abigail Álvarez Contreras
A01781097
4.4.0 Práctica de sprites y animaciones 2D
 */

"use strict";

//Definición de variables
const canvasWidth = 800;
const canvasHeight = 600;

let ctx;

let game;

let oldTime;

let playerSpeed = 0.5;
let animationDelay = 200;

//Diccionario de que tecla coincide con que dirección
const keyDirections = {
    w: "up",
    s: "down",
    a: "left",
    d: "right",
}

//MODIFICAR FRAMES DEPENDIENDO LA SPRITESHEET
const playerMovement = {
    up: {
        axis: "y",
        direction: -1,
        frames: [0, 2],
        repeat: true,
        duration: animationDelay
    },
    down: {
        axis: "y",
        direction: 1,
        frames: [6, 8],
        repeat: true,
        duration: animationDelay
    },
    left: {
        axis: "x",
        direction: -1,
        frames: [9, 11],
        repeat: true,
        duration: animationDelay
    },
    right: {
        axis: "x",
        direction: 1,
        frames: [3, 5],
        repeat: true,
        duration: animationDelay
    },

    //sin movimiento
    idle: {
        axis: "y",
        direction: 0,
        frames: [7, 7],
        repeat: true,
        duration: animationDelay
    }
};

//Clase para el personaje principal
class Player extends AnimatedObject{
    //Para crear al jugador
    constructor(position, width, height, color, sheetCols) {
        //Llama al constructor de la clase AnimatedObject
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vec(0, 0);
        this.keys = []
        this.previousDirection = "down";
        this.currentDirection = "down";
    }


    update(deltaTime){
        //Calcula nueva velocidad según teclas presionadas
        this.setVelocity();

        //Elige a que animación corresponde
        this.setMovementAnimation();

        //Actualiza posición
        this.position = this.position.plus(this.velocity.times(deltaTime));

        //Delimita el movimiento dentro del canvas
        this.constrainToCanvas();

        //Actualiza el frame de la spritesheet
        this.updateFrame(deltaTime);
    }

    setVelocity() {
        this.velocity = new Vec(0, 0);
        for (const key of this.keys) {
            const move = playerMovement[key];
            this.velocity[move.axis] += move.direction;
        }
        //Normaliza el vector para mantener velocidad constante al moverse en diagonal
        this.velocity = this.velocity.normalize().times(playerSpeed);
    }

    //Cambia la animación si la dirección cambió desde la última actualización dependiendo si es derecha, izquierda o no hay movimiento
    setMovementAnimation() {
        //Movimientos actuales
        if (Math.abs(this.velocity.y) > Math.abs(this.velocity.x)) {
            if (this.velocity.y > 0) {
                this.currentDirection = "down";
            } else if (this.velocity.y < 0) {
                this.currentDirection = "up";
            } else {
                this.currentDirection = "idle";
            }
        } else {
            if (this.velocity.x > 0) {
                this.currentDirection = "right";
            } else if (this.velocity.x < 0) {
                this.currentDirection = "left";
            } else {
                this.currentDirection = "idle";
            }
        }

        //Selecciona la animación
        if (this.currentDirection != this.previousDirection) {
            const anim = playerMovement[this.currentDirection];
            this.setAnimation(...anim.frames, anim.repeat, anim.duration);
        }

        //Actualiza la dirección
        this.previousDirection = this.currentDirection;
    }

    constrainToCanvas(){
        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > canvasHeight) {
            this.position.y = canvasHeight - this.height;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }
}

class GoldCoin extends AnimatedObject{
    constructor(position, width, height, sheetCols){
        super(position, width, height, "yellow", "coin", sheetCols);
        this.setSprite('../assets/coin_gold.png', new Rect(0, 0, 32, 32));
        this.setAnimation(0, 7, true, animationDelay);
    }

    update(deltaTime) {
        this.updateFrame(deltaTime);
    }
}

class SilverCoin extends AnimatedObject{
    constructor(position, width, height, sheetCols){
        super(position, width, height, "gray", "coin", sheetCols);
        this.setSprite('../assets/coin_silver.png', new Rect(0, 0, 32, 32));
        this.setAnimation(0, 7, true, animationDelay);
    }

    update(deltaTime) {
        this.updateFrame(deltaTime);
    }
}

class Game {
    constructor() {
        this.actors = [];
        this.createEventListeners();
        this.initObjects();
    }

    //Crea el jugador, asigna su spritesheet y el frame con el que comienza
    initObjects() {
        //Inicializa jugador
        this.player = new Player(new Vec(canvasWidth / 2, canvasHeight / 2), 60, 60, "red", 3);
        //this.player.setSprite('../assets/link_front.png')
        this.player.setSprite('../assets/blordrough_quartermaster-NESW.png',
                              new Rect(48, 128, 48, 64));
        this.player.setAnimation(7, 7, false, animationDelay);

        for (let i = 0; i < 5; i++) {
            let x = Math.random() * (canvasWidth - 32);
            let y = Math.random() * (canvasHeight - 32);
            this.actors.push(new GoldCoin(new Vec(x, y), 32, 32, 8));
        }

        for (let i = 0; i < 5; i++) {
            let x = Math.random() * (canvasWidth - 32);
            let y = Math.random() * (canvasHeight - 32);
            this.actors.push(new SilverCoin(new Vec(x, y), 32, 32, 8));
        }

        // this.actors.push(new GoldCoin(new Vec(200, 200), 32, 32, 8);
        // this.actors.push(new GoldCoin(new Vec(400, 300), 32, 32, 8);

        // this.actors.push(new SilverCoin(new Vec(300, 400), 32, 32, 8);
        // this.actors.push(new SilverCoin(new Vec(600, 250), 32, 32, 8);

    }

    checkCollisions() {
        this.actors = this.actors.filter(actor => {
            if (boxOverlap(this.player, actor)) {
                //Eliminar la moneda si hay colisión
                return false; 
            }
            return true;
        });
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        this.player.draw(ctx);
    }

    update(deltaTime) {
        for (let actor of this.actors) {
            actor.update(deltaTime);
        }
        this.player.update(deltaTime);

        this.checkCollisions();
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (Object.keys(keyDirections).includes(event.key)) {
                this.add_key(keyDirections[event.key]);
            }
        });

        window.addEventListener('keyup', (event) => {
            if (Object.keys(keyDirections).includes(event.key)) {
                this.del_key(keyDirections[event.key]);
            }
        });
    }

    add_key(direction) {
        if (!this.player.keys.includes(direction)) {
            this.player.keys.push(direction);
        }
    }

    del_key(direction) {
        let index = this.player.keys.indexOf(direction);
        if (index != -1) {
            this.player.keys.splice(index, 1);
        }
    }
}

//Called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}


// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.draw(ctx);
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}