---
id: keyframe-toolkit-cavalry
hosts:
- Cavalry
tags:
- Timeline
- Utility
version: '1.0'
status: active
updated: '2026-09-18'
license: MIT + Commons Clause
download: https://github.com/Zenzuke-Animation/cavalry-scripts/releases/latest/download/KeyToolkit.js
page: null
en:
  name: Keyframe Toolkit
  description: A panel for Cavalry with three keyframe actions in one place — clone the selected
    keyframes at the playhead, clone them reversed in time (for ping-pong moves), or reverse them
    exactly where they sit on the timeline.
  instructions: |-
    1. Run the script to open the Keyframe Toolkit panel.
    2. Select the keyframes you want to work with and move the playhead where you want the copy to land.
    3. Click 'Clone Selected Keyframes' to copy them at the playhead, 'Clone Reversed' to copy them mirrored in time, or 'Reverse Keyframes' to flip the originals in place.
  timelineCreation: Reads the selected keyframes, captures their evaluated values, and creates new
    keyframes at the target times. 'Reverse Keyframes' deletes the originals and re-creates them
    mirrored around the start frame. No layers or attributes are created.
  limitations: Values are captured at each keyframe time, so only keyed attributes are cloned (not
    interpolated in-betweens). Reversing mirrors the timing span of the selection; easing curves
    are Cavalry defaults on the new keys.
  typicalUses: Ping-pong animations, building a mirrored second half of a move, duplicating timing
    from one attribute to another layer, and flipping a bounce or overshoot sequence without
    rebuilding keys by hand.
es:
  name: Keyframe Toolkit
  description: Panel para Cavalry con tres acciones de keyframes en un solo sitio — clona los
    keyframes seleccionados en el playhead, los clona invertidos en el tiempo (para movimientos
    ping-pong) o los invierte exactamente donde están en la timeline.
  instructions: |-
    1. Ejecuta el script para abrir el panel Keyframe Toolkit.
    2. Selecciona los keyframes que quieras tratar y coloca el playhead donde quieras que aterrice la copia.
    3. Pulsa 'Clone Selected Keyframes' para copiarlos en el playhead, 'Clone Reversed' para copiarlos en espejo temporal o 'Reverse Keyframes' para voltear los originales en su sitio.
  timelineCreation: Lee los keyframes seleccionados, captura sus valores evaluados y crea keyframes
    nuevos en los tiempos de destino. 'Reverse Keyframes' borra los originales y los vuelve a crear
    en espejo alrededor del fotograma inicial. No crea capas ni atributos.
  limitations: Los valores se capturan en el tiempo de cada keyframe, así que solo se clonan
    atributos con key (no los intermedios interpolados). La inversión refleja el tramo temporal de
    la selección; las curvas de easing de las claves nuevas son las de Cavalry por defecto.
  typicalUses: Animaciones ping-pong, construir la segunda mitad en espejo de un movimiento,
    duplicar un timing de un atributo a otra capa y voltear un rebote u overshoot sin rehacer las
    claves a mano.
---
