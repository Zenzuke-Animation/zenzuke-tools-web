---
id: simple-parent
hosts:
- After Effects
tags:
- Rigging
- Timeline
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/54oae1yw27u7kdp4wx50t/SimpleParent.jsx?rlkey=fyy26lcg6n7vvpyr7tfcchjqd&dl=1
page: null
en:
  name: Simple Parent
  description: Parents all selected layers to the last layer in the selection. This way you can quickly
    choose a 'parent' without going layer by layer to the Parent & Link menu.
  instructions: '1. Select at least two layers in the comp (the last one you mark will be the parent).

    2. Run the script.

    3. All other selected layers become children of that one.'
  timelineCreation: 'Does not create anything new: only assigns the parent property of each selected layer
    to the last layer in the selection.'
  limitations: Needs a minimum of two layers; if you select only one or none, it does nothing. Does not
    differentiate between 2D/3D layers nor preserves offsets, simply parents directly.
  typicalUses: Organizing quick hierarchies (e.g. multiple elements to a control null), saving time in
    rigs, or linking multiple assets to a camera/light/guide layer with one click
es:
  name: Simple Parent
  description: Emparenta todas las capas seleccionadas al último layer de la selección. De esta forma
    puedes elegir rápidamente un “padre” sin ir capa por capa al menú de *Parent & Link*.
  instructions: Selecciona al menos dos capas en la comp (la última que marques será el padre) y ejecuta
    el script. Todas las demás capas seleccionadas quedarán vinculadas a esa.
  timelineCreation: 'No crea nada nuevo: solo asigna la propiedad `parent` de cada capa seleccionada al
    último layer de la selección.'
  limitations: Necesita mínimo dos capas; si seleccionas solo una o ninguna, no hace nada. No diferencia
    entre capas 2D/3D ni preserva offsets, simplemente parenta directo.
  typicalUses: Organizar jerarquías rápidas (p. ej. varios elementos a un null de control), ahorrar tiempo
    en rigs, o vincular varios assets a una cámara/luz/capa guía con un clic.
---
