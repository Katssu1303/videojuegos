//Clase para el manejo de posiciones, velocidades, direcciones, etc a traves de vectores
class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //Sumar un vector con otro
    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    //Restar un vector con otro
    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    //Multiplicar un vector por un escalar -> cambia su tamaño pero no su direccion (manipular velocidad)
    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    //Magnitud de un vector usando pitagoras -> que tan lejos esta o usar en normalizacion
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    //Vector unitario -> trabajar solo con la direccion sin importar la distancia
    normalize() {
        const mag = this.magnitude();
        if (mag == 0) {
            return new Vec(0, 0);
        }
        return new Vec(this.x / mag, this.y / mag);
    }
}
