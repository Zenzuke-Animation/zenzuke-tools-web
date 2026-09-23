---
id: reverse-in-place-cavalry
hosts:
- Cavalry
tags:
- Timeline
version: '1.0'
status: active
updated: '2026-09-18'
license: MIT + Commons Clause
download: https://github.com/Zenzuke-Animation/cavalry-scripts/releases/latest/download/reverse_in_place.js
page: null
en:
  name: Reverse Keyframes In Place (one-shot)
  description: One-shot script that reverses the selected keyframes chronologically exactly where
    they sit on the timeline — the first keyframe swaps with the last, with no overall time shift.
  instructions: |-
    1. Select the keyframes you want to reverse.
    2. Run the script — the selection flips in place, keeping the same start and end frames.
  timelineCreation: Deletes the original keyframes and re-creates them mirrored around the
    selection's own start frame, so nothing after or before the selection moves.
  limitations: Only keyed values are reversed (no in-between interpolation). Easing on the
    recreated keys uses Cavalry defaults, so hand-tuned per-key easing is lost. The operation
    replaces the originals — undo is your friend.
  typicalUses: Playing an entrance backwards as an exit, flipping a build-up into a break-down,
    and correcting a move that reads better in the opposite direction without re-timing anything.
es:
  name: Invertir keyframes en el sitio (un disparo)
  description: Script de un solo uso que invierte cronológicamente los keyframes seleccionados
    exactamente donde están en la timeline — el primer keyframe cambia de sitio con el último, sin
    desplazar el conjunto en el tiempo.
  instructions: |-
    1. Selecciona los keyframes que quieras invertir.
    2. Ejecuta el script — la selección se voltea en el sitio, conservando los mismos fotogramas de inicio y fin.
  timelineCreation: Borra los keyframes originales y los vuelve a crear en espejo alrededor del
    propio fotograma inicial de la selección, de modo que nada antes ni después de la selección se
    mueve.
  limitations: Solo se invierten valores con key (sin interpolación intermedia). El easing de las
    claves recreadas usa los valores por defecto de Cavalry, así que se pierde un easing afinado a
    mano por clave. La operación sustituye a los originales — el undo es tu amigo.
  typicalUses: Reproducir una entrada al revés como salida, convertir una construcción en una
    desmontaje y corregir un movimiento que se lee mejor en dirección contraria sin rehacer el
    timing.
---
