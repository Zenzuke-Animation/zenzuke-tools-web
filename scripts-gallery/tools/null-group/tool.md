---
id: null-group
hosts:
- After Effects
tags:
- Rigging
- Timeline
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/sosql103z38jichzmcks1/NullGroup.jsx?rlkey=s8g1d2wjvq1wzhpq61vh3akd1&dl=1
page: null
en:
  name: Null Group
  description: Creates a null at the average center of the selected layers (only those without a parent),
    adjusts its duration to cover from the earliest start to the latest end of those layers, and then
    parents them to the null.
  instructions: '1. Select multiple layers in your comp.

    2. Run the script.

    3. A null automatically appears at the center of all of them, with synchronized duration, and the
    layers become children.'
  timelineCreation: Generates a new null layer, calculates average position and time range (in/out), and
    reassigns the hierarchy of selected layers to that null.
  limitations: Ignores layers that already have a parent. If all are parented, it does nothing. Works
    in 2D and 3D (also sums Z if it exists).
  typicalUses: Quickly grouping multiple layers to move or animate them together, creating a centralized
    control for a group, or keeping a rig organized without needing to pre-compose
es:
  name: Null Group
  description: Crea un *null* en el centro promedio de las capas seleccionadas (solo las que no tienen
    padre), ajusta su duración para cubrir desde el inicio más temprano hasta el final más tarde de esas
    capas, y luego las emparenta al null.
  instructions: Selecciona varias capas en tu comp y ejecuta el script. Automáticamente aparecerá un null
    en el centro de todas, con la duración sincronizada, y las capas quedarán vinculadas como hijos.
  timelineCreation: Genera un nuevo null, calcula posición media (`averagePosition`) y rango de tiempo
    (in/out), y reasigna la jerarquía de las capas seleccionadas a ese null.
  limitations: Ignora capas que ya tienen padre. Si todas están parentadas, no hará nada. Funciona en
    2D y 3D (suma también la Z si existe).
  typicalUses: Agrupar rápidamente varias capas para moverlas o animarlas juntas, crear un control centralizado
    para un grupo, o mantener organizado un rig sin necesidad de precomponer.
---
