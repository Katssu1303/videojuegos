/*
Katia Abigail Álvarez Contreras
A01781097
Clases necesarias para los juegos
 */


class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    //vector * escalar
    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag == 0) {
            return new Vec(0, 0);
        }
        return new Vec(this.x / mag, this.y / mag);
    }
}

//Rectángulo - región del sprite
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

//Objeto base del juego
class GameObject {
    constructor(position, width, height, color, type) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
    }

    //Ponerle imagen al objeto
    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        //Si se pasa rect, usa una parte específica del sprite sheet
        if (rect) {
            this.spriteRect = rect;
        }
    }

    draw(ctx) {

        //Si hay imagen se dibuja la parte indicada
        if (this.spriteImage) {
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.x * this.spriteRect.width,
                              this.spriteRect.y * this.spriteRect.height,
                              this.spriteRect.width, this.spriteRect.height,
                              this.position.x, this.position.y,
                              this.width, this.height);
            } else {
                ctx.drawImage(this.spriteImage,
                              this.position.x, this.position.y,
                              this.width, this.height);
                              //this.position.x * scale, this.position.y * scale,
                              //this.width * scale, this.height * scale);
            }

        //sino dibuja un rectángulo
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y,
                         this.width, this.height);
        }

        this.drawBoundingBox(ctx);
    }

    //Marco del objeto para distinguir o colisiones
    drawBoundingBox(ctx) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y,
                 this.width, this.height);
        ctx.stroke();
    }

    update() {

    }
}

class AnimatedObject extends GameObject {
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type);

        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        //Cunatas columnas hay en la sprite sheet
        this.sheetCols = sheetCols;

        this.repeat = true;

        //Delay entre los frames (ms)
        this.frameDuration = 100;
        this.totalTime = 0;
    }

    //Cambia la animación - define que se anima entre este frame, este otro y si se repite o no
    setAnimation(minFrame, maxFrame, repeat, duration) {

        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
    }

    //Usando el tiempo designa cuando cambiar los frames
    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        //Solo si ya paso el tiempo que dura una animacion
        if (this.totalTime > this.frameDuration) {
            //Si ya llegue al ultimo frame de mi animación a cual me voy a continuación
            //Voy a avanzar o me quedo donde estoy, repeat para cuando se mueve y es falso por ejemplo para muerte
            let restartFrame = (this.repeat ? this.minFrame : this.frame);
            //Reiniciarse - se reinicia cuando el frame es mayor a maxFrame (ya me pase), si es menor le sumo 1 al Frame
            this.frame = this.frame < this.maxFrame ? this.frame + 1 : restartFrame;
            this.spriteRect.x = this.frame % this.sheetCols;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols);
            this.totalTime = 0;
        }
    }
}

class TextLabel {
    constructor(x, y, font, color) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }

    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}

function boxOverlap(obj1, obj2) {
    return obj1.position.x + obj1.width > obj2.position.x &&
           obj1.position.x < obj2.position.x + obj2.width &&
           obj1.position.y + obj1.height > obj2.position.y &&
           obj1.position.y < obj2.position.y + obj2.height;
}
