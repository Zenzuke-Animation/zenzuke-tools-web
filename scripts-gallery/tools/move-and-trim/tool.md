---
id: move-and-trim
hosts:
- After Effects
tags:
- Timeline
- Utility
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/07h4tmamqm9jnv1tgnh1s/MoveAndTrim.jsx?rlkey=jyzuzzh3gu7afrodp06p5uxr5&dl=1
page: null
en:
  name: Move And Trim
  description: 'Automatically adjusts selected layers so they align in time with the layer just below:
    moves their start to match and trims their duration to end at the same time.'
  instructions: '1. Select one or more layers in your comp.

    2. Run the script.

    3. Each layer is moved and trimmed taking the layer immediately below as the reference.'
  timelineCreation: Modifies startTime and outPoint of selected layers based on the layer below. Does
    not create new elements.
  limitations: Only works if there is a layer below (does not apply to the last layer of the comp). May
    overlap or shift layers if they already had keyframes outside the range.
  typicalUses: Very useful for assembling layers in sequence, synchronizing assets with placeholders,
    or quickly adjusting multiple elements to follow the timing of a reference
es:
  name: Move And Trim
  description: 'Ajusta automáticamente las capas seleccionadas para que se alineen en el tiempo con la
    capa justo debajo: mueve su inicio para que coincida y recorta su duración para que termine al mismo
    tiempo.'
  instructions: Selecciona una o varias capas en tu comp y ejecuta el script. Cada capa se moverá y recortará
    tomando como referencia la capa inmediatamente inferior en la pila.
  timelineCreation: Modifica `startTime` y `outPoint` de las capas seleccionadas, basándose en los valores
    de la capa inferior. No crea nada nuevo, solo ajusta tiempo y duración.
  limitations: Funciona solo si existe una capa debajo (no aplica a la última capa del comp). Puede solapar
    o desplazar capas si ya tenían keyframes fuera del rango.
  typicalUses: Muy útil para montar capas en secuencia, sincronizar assets con placeholders o ajustar
    rápidamente varios elementos para que sigan el timing de una referencia.
---
