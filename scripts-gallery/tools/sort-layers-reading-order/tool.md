---
id: sort-layers-reading-order
hosts:
- Illustrator
tags:
- Utility
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/atv1mwizhj4ept8qnnmpy/Sort_Layers_ReadingOrder.jsx?rlkey=twvomxaf82mfn0sw5f7jym5xe&dl=1
page: null
en:
  name: Sort Layers Reading Order (Illustrator)
  description: 'Orders the objects of the active layer following a more natural reading order: from top
    to bottom, and within each ''line'' (by Y proximity) from right to left. This simulates how you would
    traverse text or elements in blocks.'
  instructions: '1. Activate the layer you want to order and run the script.

    2. It detects all objects, calculates their center, organizes them by the reading logic (lines and
    columns), and reorders their position in the layer panel.'
  timelineCreation: Does not create anything new, only reorders objects. Uses the center of each object
    to calculate position. If two objects are on the same 'line' (Y difference less than epsilon = 50
    px), then decides order using X.
  limitations: 'The tolerance range (epsilon) defines what is considered the same ''line'': if too low,
    aligned objects may fall into different rows; if too high, multiple levels may merge. Only works on
    the active layer, without distinguishing sublayers.'
  typicalUses: 'Ideal for ordering items as if they were paragraphs or grids: icons, checkboxes, numbers
    or letters that should follow a coherent reading order (top–bottom, right–left). Very useful before
    exporting sequences or preparing material for motion'
es:
  name: Sort Layers Reading Order
  description: 'Ordena los objetos de la capa activa siguiendo un orden de lectura más natural: de arriba
    a abajo, y dentro de cada “línea” (según cercanía en Y) de derecha a izquierda. Esto simula cómo recorrerías
    texto o elementos en bloques.'
  instructions: Activa la capa que quieras ordenar y ejecuta el script. Detecta todos los objetos, calcula
    su centro, los organiza según la lógica de lectura (líneas y columnas) y reordena su posición en el
    panel de capas.
  timelineCreation: No crea nada nuevo, solo reordena los objetos. Usa el centro de cada objeto para calcular
    la posición. Si dos objetos están en la misma “línea” (diferencia en Y menor a `epsilon` = 50 px),
    entonces decide el orden usando X.
  limitations: 'El rango de tolerancia (`epsilon`) define qué se considera “misma línea”: si es muy bajo,
    objetos alineados pueden caer en distintas filas; si es muy alto, varios niveles pueden mezclarse.
    Funciona solo en la capa activa, sin distinguir subcapas.'
  typicalUses: 'Ideal para ordenar ítems como si fueran párrafos o grids: iconos, casillas, números o
    letras que deban seguir un orden de lectura coherente (arriba–abajo, derecha–izquierda). Muy útil
    antes de exportar secuencias o preparar material para motion.'
---
