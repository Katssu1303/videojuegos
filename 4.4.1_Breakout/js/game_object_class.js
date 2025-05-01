//Objeto generico 
class GameObject {
    //Propiedades
    constructor(position, width, height, color, type) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
    }

    //Metodo para dibujar el objeto, ctx -> es el contexto del canvas 2D (el que se usa para dibujar)
    draw(ctx) {
        //Para sprites:
        if (this.spriteImage) {
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.x, this.spriteRect.y,
                              this.spriteRect.width, this.spriteRect.height,
                              this.position.x, this.position.y,
                              this.width, this.height);
            } 
            //Dibujar imagen completa
            else {
                ctx.drawImage(this.spriteImage,
                              this.position.x, this.position.y,
                              this.width, this.height);
            }
        }
        //Si no tiene sprite se usa un rectangulo 
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        this.drawBoundingBox(ctx);
    }

    //Metodo para dibujar el marco y saber el limite 
   drawBoundingBox(ctx) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y,
                 this.width, this.height);
        ctx.stroke();
    }

    //Metodo para definir (en las clases hijas) como cambia en el tiempo
    update(deltaTime) {

    }

    //Asocia una imagen (sprite) al bjeto, parametros (ruta para llegar a la imagen, el recorte de la spritesheet)
    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

}

//Funcion para detectar colisiones, booleano si rect1 y rect2 se tocan, para ello compara si sus lados se tocan
function boxOverlap(rect1, rect2) {
    return rect1.position.x < rect2.position.x + rect2.width &&
           rect1.position.x + rect1.width > rect2.position.x &&
           rect1.position.y < rect2.position.y + rect2.height &&
           rect1.position.y + rect1.height > rect2.position.y;
}
