---
id: dissolve-parent
hosts:
- After Effects
tags:
- Utility
- Timeline
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/q7v28brcm31fcvej1uio4/DissolveParent.jsx?rlkey=u7q9lxu7lobtv1y3xq229ikj9&dl=1
page: null
en:
  name: Dissolve Parent
  description: Eliminates a selected layer (parent) and automatically transfers all its 'children' to
    the next hierarchy level. If the deleted layer had a parent, the children link to that grandparent;
    if it had no parent, the children become free but maintain their current position in space.
  instructions: '1. Open your composition.

    2. Select exactly one layer that is acting as a parent to others.

    3. Run the script.

    4. The script reassigns the parenting links of all dependent layers and deletes the selected layer
    in a single step.'
  timelineCreation: Does not create new objects. It performs a restructuring of the hierarchy in the timeline.
    The script uses After Effects' internal logic so that when reassigning the parent, child layers don't
    jump position or change their transforms, maintaining the visual design.
  limitations: Only works if you have exactly one layer selected. If you try to run it without selecting
    anything or with multiple layers chosen, the script shows an alert and performs no action. Designed
    to clean the hierarchy one layer at a time.
  typicalUses: Cleaning unnecessary nulls in a rig, eliminating reference layers once they're no longer
    needed without breaking children animation, simplifying complex parentage structures (passing links
    from a 'parent' directly to the 'grandparent') to have a more organized timeline
es:
  name: Dissolve Parent
  description: El script elimina una capa seleccionada (padre) y transfiere automáticamente todos sus
    "hijos" al siguiente nivel de la jerarquía. Si la capa eliminada tenía a su vez un padre, los hijos
    se vinculan a ese abuelo; si no tenía padre, los hijos quedan libres, pero manteniendo su posición
    actual en el espacio.
  instructions: Abre tu composición, selecciona **exactamente una capa** que esté actuando como padre
    de otras y ejecuta el script. El script reasignará los vínculos de parentesco de todas las capas dependientes
    y borrará la capa seleccionada en un solo paso.
  timelineCreation: No crea objetos nuevos. Lo que hace es una **reestructuración de la jerarquía** en
    el timeline. El script utiliza la lógica interna de After Effects para que, al reasignar el padre,
    las capas "hijas" no salten de posición ni cambien sus transformaciones, manteniendo visualmente el
    diseño original.
  limitations: Solo funciona si tienes **una sola capa seleccionada**. Si intentas ejecutarlo sin seleccionar
    nada o con varias capas elegidas a la vez, el script mostrará un aviso y no realizará ninguna acción.
    Está diseñado para limpiar la jerarquía de una en una.
  typicalUses: Limpiar nulls innecesarios en un rig, eliminar capas de referencia una vez que ya no se
    necesitan sin romper la animación de los hijos, o simplificar estructuras de parentesco complejas
    (pasando los vínculos de un "padre" directamente al "abuelo") para tener un timeline más organizado.
---
