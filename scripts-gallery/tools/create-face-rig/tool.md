---
id: create-face-rig
hosts:
- After Effects
tags:
- Rigging
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/22a72nvgnf2hl5xkq1fgy/CreateFaceRig.jsx?rlkey=l80v4u1w03f62grbz1zxdde2p&dl=1
page: null
en:
  name: Create Face Rig
  description: Opens a 'Face Rig Creator' panel that creates two control nulls (Head_Control and Look_Control)
    and applies a parallax expression (based on a 0–1 multiplier) to the position of selected layers,
    using Look_Control as the driver.
  instructions: '1. Run the script to open the panel.

    2. Select a reference layer in the comp and click ''Create Control Nulls'' (creates the nulls and
    parents the layer to Head_Control).

    3. Select the layers to affect (avoid the nulls), adjust the multiplier with the slider/input box,
    and click ''Apply to Selected Layers'' to add the parallax expression.'
  timelineCreation: 'Creates two null layers: Head_Control (at the reference layer''s position) and Look_Control
    (child of Head, at [0,0] relative with 50% scale). Adds position expressions to selected layers.'
  limitations: Only affects 2D position and should not be applied to Head_Control/Look_Control themselves.
    Changing the null names breaks the expression. Does not manage real 3D depth; it's faux-parallax based
    on 2D offset.
  typicalUses: 'Quick 2D facial rigs: move Look_Control to simulate eye movement, brow lift, cheek, nose
    displacement, etc., with different multipliers per layer for depth sensation and subtle head-turn
    response'
es:
  name: Create Face Rig
  description: Abre un panel “Face Rig Creator” que crea dos nulls de control (`Head_Control` y `Look_Control`)
    y aplica una expresión de *parallax* (según un multiplicador 0–1) a la **posición** de las capas seleccionadas,
    usando la posición de `Look_Control` como driver.
  instructions: Ejecuta el script para abrir el panel, selecciona en la comp una capa “referencia” y pulsa
    **Create Control Nulls** (crea los nulls y parenta la capa al `Head_Control`). Luego selecciona las
    capas a afectar (evita los nulls), ajusta el **multiplier** con el slider/caja, y pulsa **Apply to
    Selected Layers** para añadir la expresión de parallax.
  timelineCreation: '`Head_Control` (en la posición de la capa referencia) y `Look_Control` (hijo del
    Head, en [0,0] relativo con escala 50%). A las capas seleccionadas les añade en **Position**: `value
    + thisComp.layer(''Look_Control'').transform.position * multiplier;`.'
  limitations: Solo afecta **posición 2D** y no debe aplicarse a los propios `Head_Control`/`Look_Control`.
    Si cambias los nombres de los nulls, la expresión se rompe. No gestiona depth 3D real; es un faux-parallax
    basado en offset 2D.
  typicalUses: 'Rigs faciales 2D rápidos: mover `Look_Control` para simular mirada, desplazamiento de
    cejas, mofletes, nariz, etc., con distintos multiplicadores por capa para sensación de profundidad
    y respuesta sutil al *head turn*.'
---
