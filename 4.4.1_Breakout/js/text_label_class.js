//Clase para agregar una etiqueta de texto a la pantalla -> mensajes, puntajes, etc
class TextLabel {
    constructor(position, font, color) {
        this.position = position;
        this.font = font;
        this.color = color;
    }

    //Metodo para dibujar la etiqueta, ctx -> contexto del canvas y text -> texto a agregar
    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        //Definir donde se va a dibujar
        ctx.fillText(text, this.position.x, this.position.y);
    }
}