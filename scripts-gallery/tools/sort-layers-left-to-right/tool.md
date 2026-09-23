---
id: sort-layers-left-to-right
hosts:
- Illustrator
tags:
- Utility
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/uvvaefw5rz1gycpnnd3q5/Sort_Layers_LeftToRight.jsx?rlkey=mqgp4f54mhvoqevjfm1xrktpa&dl=1
page: null
en:
  name: Sort Layers Left to Right (Illustrator)
  description: Orders all objects in the active layer from left to right, and if two share the same X
    position, from top to bottom. At the end it changes their stacking order (z-order) in the layer panel
    to reflect that order.
  instructions: '1. Select the layer where you have the objects you want to order and run the script.

    2. It shows how many elements it found, then automatically reorders them.

    3. You don''t need to select the objects; the script uses all elements of the active layer.'
  timelineCreation: 'Does not generate new elements: simply changes the order in the layer panel. Uses
    the left coordinate as X reference and top as Y reference. For lines (PathItem with 2 points) calculates
    the center so the order is more logical.'
  limitations: 'Affects only objects in the active layer. Does not discriminate by groups or sublayers:
    everything in the layer is included. ''top'' in Illustrator increases downward, so the calculation
    is inverted to order correctly from top to bottom.'
  typicalUses: Preparing layers for exporting ordered sequences, organizing elements before renaming or
    numbering, or having the logical reading order (left to right, top to bottom) when generating assets
    for animation or development
es:
  name: Sort Layers Left to right
  description: Ordena todos los objetos de la capa activa de izquierda a derecha, y si dos comparten la
    misma posición en X, de arriba hacia abajo. Al final cambia su orden de apilado (*z-order*) en la
    capa para reflejar ese orden.
  instructions: Selecciona la capa donde tengas los objetos que quieres ordenar y ejecuta el script. Te
    mostrará cuántos elementos encontró, luego los reordena automáticamente. No necesitas seleccionar
    los objetos, el script usa **todos los elementos de la capa activa**.
  timelineCreation: 'No genera elementos nuevos: simplemente cambia el orden en el panel de capas. Usa
    la coordenada `left` como referencia de X y `top` como referencia de Y. Para líneas (PathItem con
    2 puntos) calcula el centro para que el orden sea más lógico.'
  limitations: 'Afecta solo a objetos en la **capa activa**. No discrimina por grupos o subcapas: todo
    lo que haya en la capa se incluye. Y ten en cuenta que “top” en Illustrator aumenta hacia abajo, por
    eso el cálculo se invierte para ordenar correctamente de arriba a abajo.'
  typicalUses: Preparar capas para exportar secuencias en orden visual, organizar elementos antes de renombrar
    o numerar, o tener el orden lógico de lectura (de izquierda a derecha, arriba abajo) al generar assets
    para animación o desarrollo.
---
