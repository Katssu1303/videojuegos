
# 4.4.1 Práctica Conceptos Básicos de Videojuegos (Breakout)

Práctica de conceptos básicos de desarrollo de videojuegos.

## Authors

- [@Katssu1303](https://github.com/Katssu1303)


## Objetivo

Romper todos los bloques: El jugador debe mover el paddle con los controles que se mencionan a continuación evitando que la pelota caiga y con ello dirigiendola a los bloques para romperlos.

## Instrucciones

Para comenzar se debe presionar la tabla espaciadora.

Cada bloque le sumara un punto y cada 6 puntos aumentará la velocidad. Así mismo esta la funcionalidad de combos cuando rompes bloques rápidamente, por cada bloque adicional en un combo, recibes 1 punto extra.

Ejemplo:
* Rompes 1 bloque: +1 punto

* Dentro de 1.5 segundos, rompes otro:

    * Combo = 2

    * Bonus = 1

    * +1 (normal) +1 (bonus) = 2 puntos

* Rompes otro antes de que se acabe el tiempo:

    * Combo = 3

    * Bonus = 2

    * +1 (normal) +2 (bonus) = 3 puntos

* Si pasa más de 1.5 segundos sin romper otro bloque:

    * El combo se reinicia a 0

Si la pelota cae por debajo de la paleta (y toca la barrera inferior), se pierde una vida.

## Controles

 * A: Dirigirse hacia la izquierda.
 * D: Dirigirse hacia la derecha.