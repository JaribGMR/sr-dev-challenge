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


