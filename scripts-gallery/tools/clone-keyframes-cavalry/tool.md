---
id: clone-keyframes-cavalry
hosts:
- Cavalry
tags:
- Timeline
version: '1.0'
status: active
updated: '2026-09-18'
license: MIT + Commons Clause
download: https://github.com/Zenzuke-Animation/cavalry-scripts/releases/latest/download/clone_keyframes.js
page: null
en:
  name: Clone Keyframes (one-shot)
  description: One-shot script that clones the selected keyframes and pastes them starting at the
    current playhead position, keeping their original spacing. Panel-free companion of the Keyframe
    Toolkit.
  instructions: |-
    1. Select the keyframes you want to clone.
    2. Move the playhead to the frame where the copy should start.
    3. Run the script — the clone lands from the playhead on, with the original relative timing.
  timelineCreation: Creates new keyframes with the captured values from the playhead onward. If a
    different layer is selected when running, the clone goes to that layer instead of the original
    one.
  limitations: Only keyed values are cloned (no in-between interpolation). Easing on the new keys
    uses Cavalry defaults. Needs at least one keyframe selected.
  typicalUses: Duplicating a timing pattern onto another layer or another attribute, repeating a
    move further down the timeline, and quick keyframe copies without opening a panel.
es:
  name: Clonar Keyframes (un disparo)
  description: Script de un solo uso que clona los keyframes seleccionados y los pega empezando en
    la posición actual del playhead, conservando su espaciado original. Compañero sin panel del
    Keyframe Toolkit.
  instructions: |-
    1. Selecciona los keyframes que quieras clonar.
    2. Coloca el playhead en el fotograma donde deba empezar la copia.
    3. Ejecuta el script — el clon aterriza desde el playhead en adelante, con el timing relativo original.
  timelineCreation: Crea keyframes nuevos con los valores capturados desde el playhead en adelante.
    Si al ejecutar hay otra capa seleccionada, el clon va a esa capa en lugar de a la original.
  limitations: Solo se clonan valores con key (sin interpolación intermedia). El easing de las
    claves nuevas usa los valores por defecto de Cavalry. Necesita al menos un keyframe
    seleccionado.
  typicalUses: Duplicar un patrón de timing sobre otra capa u otro atributo, repetir un movimiento
    más adelante en la timeline y copiar keyframes al vuelo sin abrir un panel.
---
