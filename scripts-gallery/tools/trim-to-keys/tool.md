---
id: trim-to-keys
hosts:
- After Effects
tags:
- Timeline
- Utility
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/l8xll9htuzofseoxrig6r/TrimToKeys.jsx?rlkey=5axv307jbxk84ta4y9qdfvqfn&dl=1
page: null
en:
  name: Trim To Keys
  description: Automatically trims selected layers so their duration goes from the first to the last keyframe
    they contain, removing extra time at the start and end.
  instructions: '1. Select one or more layers in your comp.

    2. Run the script.

    3. It analyzes all their parameters and adjusts inPoint and outPoint of each layer based on the earliest
    and latest keyframes.'
  timelineCreation: 'Does not create anything new: only modifies the entry and exit of layers to match
    the range of their animations.'
  limitations: If a layer has no keyframes, it is not trimmed. Does not distinguish between locked properties
    or effects without keyframes.
  typicalUses: Comp cleanup, automatically trimming animated assets, preparing optimized precomps, or
    eliminating empty stretches in long timelines
es:
  name: Trim To Keys
  description: Recorta automáticamente las capas seleccionadas para que su duración vaya desde el primer
    hasta el último keyframe que contengan, quitando tiempo sobrante al inicio y al final.
  instructions: Selecciona una o varias capas en tu comp y ejecuta el script. Analiza todos sus parámetros
    y ajusta `inPoint` y `outPoint` de cada capa según los keyframes más temprano y más tardío.
  timelineCreation: 'No crea nada nuevo: solo modifica la entrada y salida de las capas para que coincidan
    con el rango de sus animaciones.'
  limitations: Si una capa no tiene keyframes, no se recorta. No distingue propiedades bloqueadas ni efectos
    expresados sin keyframes.
  typicalUses: Limpieza de comps, recortar automáticamente assets animados, preparar precomps optimizadas
    o eliminar tramos vacíos en timelines largos.
---
