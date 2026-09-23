---
id: clone-reversed-cavalry
hosts:
- Cavalry
tags:
- Timeline
version: '1.0'
status: active
updated: '2026-09-18'
license: MIT + Commons Clause
download: https://github.com/Zenzuke-Animation/cavalry-scripts/releases/latest/download/clone_reversed.js
page: null
en:
  name: Clone Reversed (one-shot)
  description: One-shot script that clones the selected keyframes and pastes them at the playhead
    in mirrored chronological order — the quick way to a ping-pong move.
  instructions: |-
    1. Select the keyframes of the move you want to bounce back.
    2. Move the playhead to the frame where the reversed copy should start.
    3. Run the script — the mirrored sequence lands from the playhead on, with the same total duration.
  timelineCreation: Creates new keyframes with mirrored timing relative to the copied selection's
    duration. If a different layer is selected when running, the clone goes to that layer instead
    of the original one.
  limitations: Only keyed values are cloned (no in-between interpolation). The original keyframes
    stay untouched — this adds a mirrored copy, it does not reverse the source. Easing on the new
    keys uses Cavalry defaults.
  typicalUses: Ping-pong animations, a shape or bounce that returns to its start, echoing a move
    in the opposite direction on another layer.
es:
  name: Clonar invertidos (un disparo)
  description: Script de un solo uso que clona los keyframes seleccionados y los pega en el playhead
    en orden cronológico invertido — el camino rápido a un movimiento ping-pong.
  instructions: |-
    1. Selecciona los keyframes del movimiento que quieras hacer rebotar.
    2. Coloca el playhead en el fotograma donde deba empezar la copia invertida.
    3. Ejecuta el script — la secuencia en espejo aterriza desde el playhead en adelante, con la misma duración total.
  timelineCreation: Crea keyframes nuevos con el timing en espejo respecto a la duración de la
    selección copiada. Si al ejecutar hay otra capa seleccionada, el clon va a esa capa en lugar de
    a la original.
  limitations: Solo se clonan valores con key (sin interpolación intermedia). Los keyframes
    originales quedan intactos — esto añade una copia en espejo, no invierte el origen. El easing
    de las claves nuevas usa los valores por defecto de Cavalry.
  typicalUses: Animaciones ping-pong, una forma o rebote que vuelve a su punto de partida, replicar
    un movimiento en dirección contraria en otra capa.
---
