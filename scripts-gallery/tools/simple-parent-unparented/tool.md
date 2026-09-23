---
id: simple-parent-unparented
hosts:
- After Effects
tags:
- Rigging
- Timeline
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/2wqc1udgk6lwmf35xfenn/SimpleParent_Unparented.jsx?rlkey=gpg56z1fbjvy1b7midcs3uu5o&dl=1
page: null
en:
  name: Simple Parent (Unparented Only)
  description: Parents selected layers to the last selected layer, but only if they do not already have
    an assigned parent. This protects existing parent-child hierarchies from being broken.
  instructions: '1. Select multiple layers in your composition (the last selected layer will act as the
    parent).

    2. Run the script.

    3. Layers that had no parent are linked to the target layer. Layers that already had a parent remain
    unchanged.'
  timelineCreation: Does not create any layers; reassigns the parent property of selected layers in the
    timeline.
  limitations: Requires at least two selected layers. Does not affect layers that already have a parent.
  typicalUses: Quickly grouping unparented layers under a control null without disrupting custom rigging
    elsewhere on the timeline.
es:
  name: Simple Parent (Solo sin padre)
  description: Emparenta las capas seleccionadas al último layer de la selección, pero solo si no tienen
    ya un padre asignado. Esto protege las jerarquías ya existentes para que no se rompan.
  instructions: '1. Selecciona varias capas en la composición (la última capa seleccionada actuará como
    el padre).

    2. Ejecuta el script.

    3. Las capas que no tenían padre se vincularán al layer de destino. Las que ya tenían padre no sufrirán
    cambios.'
  timelineCreation: No crea nuevos elementos; reasigna la propiedad de padre (Parent) de las capas seleccionadas.
  limitations: Requiere al menos dos capas seleccionadas. No afecta a las capas que ya tienen un padre
    asignado.
  typicalUses: Vincular rápidamente capas sueltas a un null de control sin romper estructuras de rig personalizadas
    en la línea de tiempo.
---
