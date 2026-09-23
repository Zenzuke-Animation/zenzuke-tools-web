---
id: freeze-property
hosts:
- After Effects
tags:
- Utility
- Timeline
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/2iq4o4acakzgrulgvy2wk/FreezeProperty.jsx?rlkey=mymdwhuhvk7x8dzav6mln2zf1&dl=1
page: null
en:
  name: Freeze Property
  description: Freezes selected properties by converting their current value into a fixed expression,
    rounded to two decimal places. This lets you lock animated positions, scales, opacities, etc., cleanly
    without having to set keyframes.
  instructions: '1. Select the properties you want to freeze in your comp (position, scale, rotation,
    opacity, effect points, etc.).

    2. Run the script.

    3. Each property''s value is replaced with an expression returning that same (rounded) number.'
  timelineCreation: 'Replaces property values with fixed expressions: multidimensional (e.g. position)
    becomes value = [x, y]; single values become value = n;.'
  limitations: Only works on properties that accept expressions (canSetExpression = true). If you select
    something that doesn't support it, it's skipped. Does not add keyframes, only replaces with a constant
    value via expression.
  typicalUses: Locking animated positions/opacities at a point that works better for you to modify them
    later
es:
  name: Freeze Property
  description: “Congela” propiedades seleccionadas convirtiendo su valor actual en una expresión fija,
    redondeada a dos decimales. Así puedes bloquear posiciones animadas, escalas, opacidades, etc., de
    forma limpia sin tener que escribir keyframes.
  instructions: Selecciona en tu comp las propiedades que quieras congelar (posición, escala, rotación,
    opacidad, puntos de efecto…) y ejecuta el script. Sustituirá su valor por una expresión que devuelve
    ese mismo número (ya redondeado).
  timelineCreation: 'En cada propiedad añade una expresión simple:


    - Si es multidimensional (ej. posición), `value = [x, y];` con valores redondeados.

    - Si es un valor único, `value = n;`.

    - Además muestra un resumen de cuántas propiedades procesó y cuántas no pudo tocar.'
  limitations: Solo funciona en propiedades que aceptan expresiones (`canSetExpression = true`). Si seleccionas
    algo que no admite, lo salta. No añade keyframes, solo reemplaza por un valor constante vía expresión.
  typicalUses: Bloquear posiciones/opacidades animadas en un sitio que nos venga mejor para modificarlas.
---
