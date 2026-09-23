---
id: time-offset-cavalry
hosts:
- Cavalry
tags:
- Timeline
- Utility
version: '1.0'
status: active
updated: '2026-09-18'
license: MIT + Commons Clause
download: https://github.com/Zenzuke-Animation/cavalry-scripts/releases/latest/download/TimeOffset.js
page: null
en:
  name: Time Offset
  description: A panel for Cavalry that shifts the timing of your composition by N frames — layers,
    keyframes, or both — separately on each side of the playhead. Locked and hidden layers can be
    left out with two toggles.
  instructions: |-
    1. Run the script to open the Time Offset panel and set the number of frames to offset.
    2. Use the 'Right of Playhead' buttons to move everything after the playhead backward or forward in time.
    3. Use the 'Left of Playhead' buttons to do the same with everything before the playhead.
    4. Toggle 'Ignore Locked Layers' / 'Ignore Hidden Layers' to leave those layers untouched (both on by default).
  timelineCreation: Layers entirely on one side of the playhead are offset whole (bounds plus their
    animation); layers straddling the playhead only get their out or in point stretched. Keyframes
    on the chosen side of layers that were not fully offset are shifted one by one, sorted so keys
    never overwrite each other.
  limitations: Frame values are whole numbers (no sub-frame offsets). Straddling layers only get
    their bounds stretched, so animation inside them does not move until it is fully on one side
    of the playhead. Rendered caches may need a refresh after big shifts.
  typicalUses: Making room for a new shot in the middle of a comp, delaying or advancing the second
    half of an animation without touching the first, and re-timing reactions after a change in the
    main action.
es:
  name: Time Offset
  description: Panel para Cavalry que desplaza el timing de la composición N fotogramas — capas,
    keyframes o ambos — por separado a cada lado del playhead. Las capas bloqueadas y ocultas se
    pueden dejar fuera con dos conmutadores.
  instructions: |-
    1. Ejecuta el script para abrir el panel Time Offset y fija el número de fotogramas a desplazar.
    2. Usa los botones de 'Right of Playhead' para mover todo lo que está después del playhead hacia atrás o hacia delante en el tiempo.
    3. Usa los botones de 'Left of Playhead' para hacer lo mismo con todo lo anterior al playhead.
    4. Activa 'Ignore Locked Layers' / 'Ignore Hidden Layers' para dejar esas capas intactas (los dos vienen activados).
  timelineCreation: Las capas enteramente a un lado del playhead se desplazan completas (puntos de
    entrada/salida y animación); las capas que cruzan el playhead solo estiran su out o su in. Los
    keyframes del lado elegido de las capas no desplazadas enteras se mueven uno a uno, ordenados
    para que unas claves nunca pisen a otras.
  limitations: Los valores son fotogramas enteros (sin desplazamientos sub-frame). Las capas que
    cruzan el playhead solo estiran sus límites, así que su animación interior no se mueve hasta
    estar completa a un lado. Tras desplazamientos grandes puede convenir refrescar la caché de
    reproducción.
  typicalUses: Dejar hueco para un plano nuevo en medio de una comp, retrasar o adelantar la segunda
    mitad de una animación sin tocar la primera, y reajustar el timing de reacciones tras un cambio
    en la acción principal.
---
