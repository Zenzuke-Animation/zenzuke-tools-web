---
id: delete-if-no-children-or-matte
hosts:
- After Effects
tags:
- Utility
- Timeline
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/4eu4d2jfyotz5r9pn4tz9/DeleteIfNoChildrenOrMatte.jsx?rlkey=b7nyy38duv1r20cfcr5tju9dx&dl=1
page: null
en:
  name: Delete If No Children Or Matte
  description: Acts as a 'safety filter' for timeline cleanup. Analyzes selected layers and only deletes
    those that have no active dependency function. Specifically, it protects and does NOT delete any layer
    that serves as a 'Parent' of another or is used as a 'Track Matte' by another layer in the project.
  instructions: '1. Select a group of layers you believe are redundant or ''garbage'' in your composition.

    2. Run the script.

    3. The script processes the selection, deletes layers that truly do nothing, and shows an alert listing
    the names of layers it kept and the reason (whether because it''s a Parent or a Matte Source).'
  timelineCreation: Does not create new elements. Its function is exclusively intelligent cleanup of the
    timeline.
  limitations: Optimized for modern After Effects versions (23.0+). Only analyzes layers you have selected
    beforehand; does not scan the entire composition automatically to avoid deleting elements you might
    want to keep for other reasons.
  typicalUses: Deep cleanup in heavy projects without fear of breaking rigging or mattes, optimizing compositions
    with hundreds of layers where you're unsure which Null or solid is dispensable, ensuring that deleting
    reference layers doesn't orphan others that depend on their position or alpha channel
es:
  name: Delete If No Children Or Matte
  description: El script actúa como un "filtro de seguridad" para la limpieza de tu timeline. Analiza
    las capas seleccionadas y solo elimina aquellas que no tengan una función de dependencia activa. Específicamente,
    protege y **no borra** ninguna capa que esté sirviendo como "Padre" de otra o que esté siendo utilizada
    como "Track Matte" (Mate de seguimiento) por otra capa del proyecto.
  instructions: Selecciona un grupo de capas que creas que son redundantes o "basura" en tu composición
    y ejecuta el script. El script procesará la selección, eliminará las que realmente no hacen nada y
    te mostrará un cuadro de alerta listando los nombres de las capas que decidió conservar y el motivo
    (si es por ser Padre o por ser Fuente de Mate).
  timelineCreation: No crea ningún elemento nuevo. Su función es exclusivamente de **limpieza inteligente**.
    Al ejecutarse, realiza un escaneo inverso de tu selección para evitar errores de índice y verifica
    mediante código si cada capa tiene hijos vinculados o si es el motor visual de un mate de seguimiento
    en cualquier otra capa de la composición.
  limitations: El script está optimizado para versiones modernas de After Effects (23.0 en adelante) al
    utilizar la propiedad `trackMatteLayer`. Solo analiza las capas que tengas **seleccionadas previamente**;
    no escanea toda la composición automáticamente para evitar borrar elementos que podrías querer mantener
    por otras razones.
  typicalUses: Hacer limpieza profunda en proyectos pesados sin miedo a romper el "rigging" o los mates,
    optimizar composiciones con cientos de capas donde no estás seguro de qué Null o sólido es prescindible,
    y asegurar que al borrar capas de referencia no dejes huérfanas a otras que dependen de su posición
    o su canal alfa.
---
