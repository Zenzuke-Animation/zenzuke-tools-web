---
id: puppet-pin-null-creator
hosts:
- After Effects
tags:
- Rigging
- Timeline
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/b0t7bz9kyo7xdu5lrlf8u/PupperPin_NullCreator.jsx?rlkey=7518l66okrvn1wr1h02fff0nc&dl=1
page: null
en:
  name: PuppetPin Null Creator
  description: Creates a null for each Puppet Pin on the mesh of the selected layer, places them on each
    pin, gives them the same in/out range as the layer, and chains the nulls in hierarchy (each new null
    parents to the previous) to facilitate articulated rigs; additionally, applies an expression to each
    pin so it follows the corresponding null.
  instructions: '1. Select the layer with Puppet in your comp and run the script.

    2. It detects all meshes (Puppet > arap > Mesh > Deform) and generates the nulls automatically with
    names ''LayerName [MeshName] [PinName]'', already linked via expression and ready to animate.'
  timelineCreation: Adds null layers (50% scale, shy enabled, anchor 50/50) chained in hierarchy. Sets
    pin.position.expression to 'p=thisComp.layer("NullName").transform.position; fromComp(p.toComp(p.anchorPoint));'
    to convert comp↔layer coordinates.
  limitations: Operates only on the first selected layer with Puppet; the chaining is strictly sequential
    (last pin to first by loop order); renaming a null breaks its link in the expression; designed for
    Puppet 2D (FreePin3/ARAP) on standard property paths.
  typicalUses: 'Quick limb and face rigs: move nulls to pose pins with clean control, create influence
    chains (bone→sub-bone), and prepare animation setups where you need tangible handles on timeline instead
    of manipulating pins directly'
es:
  name: PuppetPin Null Creator
  description: Crea un *null* por cada **Puppet Pin** de la malla en la capa seleccionada, los coloca
    sobre cada pin, les da el mismo rango de in/out que la capa y **encadena los nulls en jerarquía**
    (cada nuevo null se parenta al anterior) para facilitar rigs articulados; además, a cada pin le aplica
    una expresión para que siga al null correspondiente.
  instructions: Selecciona la **capa con Puppet** en tu comp y ejecuta el script; detecta todas las mallas
    (`Puppet > arap > Mesh > Deform`) y genera los nulls automáticamente con nombres `"\[NombreCapa\]
    [NombreMalla] [NombrePin]"`, ya vinculados por expresión y listos para animar.
  timelineCreation: Añade nulls (escala 50%, *shy* activado, ancla 50/50) parentados en cadena y ajusta
    `pin.position.expression` a `p=thisComp.layer("NombreNull"); fromComp(p.toComp(p.anchorPoint));` para
    convertir coordenadas comp↔capa y hacer que el pin siga al null.
  limitations: Opera solo sobre la **primera capa seleccionada** con Puppet; el encadenado es estrictamente
    secuencial (del último pin al primero por el orden del bucle), renombrar un null rompe su vínculo
    en la expresión, y está pensado para Puppet **2D (FreePin3/ARAP)** en rutas de propiedades estándar.
  typicalUses: 'Rig rápido de extremidades y caras: mover nulls para posar pins con control limpio, crear
    cadenas de influencia (hueso→subhueso), y preparar setups de animación donde necesites *handles* tangibles
    en timeline en lugar de manipular directamente los pins.'
---
