Entendimiento del flujo ver diagramas:
![Visión general del sistema de pedidos](diagrams/flows-complete.excalidrawio.svg)
[Abrir en Excalidraw](https://excalidraw.com/#json=d-z1uSN3mValGtYLhV0h2,1pu9srmqkNi35VcSjiVD2g)

# Base de datos
- Postgresql: Es una de la que mejor conozco 
- typeOrm: Como ORM mejor conocido para mi 

## Sistema de módulos y framework de pruebas del backend
- CommonJS con Jest.

**Por qué:**
- Jest es el framework de pruebas con más documentación y ejemplos en NestJS, y es el que mejor domino.

## Versión de NestJS
- NestJS 11, no la 12 (última).

**Por qué:**
- NestJS 11 funciona con Node 22 sin configuración adicional, mientras que NestJS 12 con Jest sus pruebas requieren Node 24 y una opción experimental 


## Estructura del backend
- Cuatro capas en `src/`: domain, application, infrastructure, presentation.

**Por qué:**
- Sigue Clean Architecture: las dependencias apuntan hacia domain.
- Capas en el primer nivel y no módulos por funcionalidad, porque el dominio es pequeño (cuatro entidades) y así la arquitectura se ve completa al abrir `src/`.


## Transiciones de estado como tabla
- Las transiciones permitidas están en un solo objeto (`ALLOWED_TRANSITIONS`); lo que no aparece ahí está prohibido.

**Por qué:**
- El enunciado pide rechazar cualquier otra transición. Con una tabla no hay que escribir un `if` por cada caso prohibido.
- Cambiar una regla es modificar una línea y su prueba.

## Errores de negocio
- Todos heredan de `DomainError` y llevan un `code`.

**Por qué:**
- Permite que presentation distinga un error de negocio de un fallo inesperado y elija el código HTTP, sin que domain sepa de HTTP.

## Supuestos
- Los estados se guardan y viajan en inglés y mayúsculas (`PENDING`, `APPROVED`…).


## Entendimiento sobre req:
- El dinero se guarda en centavos, como número entero. RD$290.10 se representa como 29010. Con enteros, galones × precio da siempre un resultado exacto; con decimales de JavaScript aparecen errores como 0.1 + 0.2 = 0.30000000000000004. Esto reemplaza a decimal.js, que te había listado: es una dependencia menos y se explica en una frase. Asume que los precios tienen como máximo dos decimales.

- Los galones son enteros. No se piden 500.5 galones.

- La línea copia el precio, no apunta al producto. OrderLine guarda el productId y el precio de ese momento. Si el producto sube de precio mañana, el pedido no cambia. Es lo que pide la regla 6.

- La fecha de entrega lleva hora, y "domingo" se evalúa en hora de República Dominicana. Un pedido para el domingo a la 1:00 a. m. hora local ya es lunes en otras zonas; hay que fijar cuál manda.

- La hora actual entra como parámetro. Order.create(...) recibe "ahora" en vez de consultarlo por dentro. Así una prueba puede decir "hoy es viernes a las 10:00" y comprobar el caso de 23 h 59 min contra el de 24 h.


