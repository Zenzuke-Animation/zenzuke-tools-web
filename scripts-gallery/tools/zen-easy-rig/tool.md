---
id: zen-easy-rig
hosts:
- After Effects
tags:
- Rigging
version: '1.0'
status: active
updated: '2026-10-19'
license: MIT + Commons Clause
download: https://github.com/Zenzuke-Animation/adobe-scripts/releases/latest/download/ZenEasyRig.jsx
page: null
guide: guide.html
en:
  name: Zen Easy Rig
  description: A dockable rigging panel with three tabs. IK builds two-bone IK on layers, 2D points
    (puppet pins, effect points) or a single path. Face creates Head and Look controls that drive face
    parts (move, squash, rotate, flip, show) and generates eyes with lids, pupils and lashes. Extras adds
    Delay, Ignore parent rotation, Fan rig, Morph sliders and Copy / paste controls. Every expression it
    writes is short and commented so you can edit it by hand. The full [Zen Easy Rig guide](zen-easy-rig/guide.html) covers every button.
  instructions: '1. Copy ZenEasyRig.jsx into Scripts/ScriptUI Panels, restart After Effects and open it
    from the Window menu. Dock it next to the Timeline; it scrolls when docked small.

    2. Pick the Controller type at the top (Null or guide Shape).

    3. IK: select 3 layers (upper, lower, end), 3 point properties or 1 path and click ''Create IK''.
    Put each anchor point on its joint first.

    4. Face: select the head and click ''Create Head + Look controls'', then select face parts, tick what
    each should do and click ''Apply''. Move CTRL Look to animate the look.

    5. Extras: select layers or properties and click the tool you need. Copy controls / Paste + link moves
    expression controls to another layer and links the old ones to the new.'
  timelineCreation: 'Creates controller layers (null or guide shape): the IK controller, CTRL Head, CTRL
    Look, CTRL Eyes or CTRL Morph, with sliders and checkboxes for the rig. Adds commented expressions
    (starting with // Zen Easy Rig) to the rigged properties. The eye generator adds shape groups for eye
    white, lid, pupil and lashes.'
  limitations: The IK is 2D only. Expressions find controllers by name, so renaming one breaks the link
    until you edit the name in the expression. Paths inside rotated or scaled groups can be offset. Dropdown
    menu controls are not copied. ScriptUI panels do not receive the mouse wheel on Windows, so scroll with
    the scrollbar.
  typicalUses: Arms and legs with IK/FK switch, soft IK and stretch; bending puppet pins or paths; 2D
    face rigs that turn and look around; blinking cartoon eyes; mouth pose sliders; overlap on tails and
    hair with Delay; moving a rig's controls onto a single hub layer.
es:
  name: Zen Easy Rig
  description: Un panel de rigging acoplable con tres pestañas. IK crea IK de dos huesos sobre capas,
    puntos 2D (pines de marioneta, puntos de efectos) o un solo trazado. Cara crea los controles Head y
    Look que manejan las partes de la cara (mover, squash, rotar, voltear, mostrar) y genera ojos con párpados,
    pupilas y pestañas. Extras añade Delay, Ignorar rotación del padre, Fan rig, deslizadores de Morph y
    Copiar / pegar controles. Cada expresión que escribe es corta y comentada para que puedas editarla a
    mano. La [guía completa de Zen Easy Rig](zen-easy-rig/guide.html) explica cada botón.
  instructions: '1. Copia ZenEasyRig.jsx en Scripts/ScriptUI Panels, reinicia After Effects y ábrelo desde
    el menú Ventana. Acóplalo junto a la Línea de tiempo; si queda pequeño tiene scroll.

    2. Elige arriba el tipo de Controller (Null o Shape guía).

    3. IK: selecciona 3 capas (superior, inferior, final), 3 propiedades de punto o 1 trazado y pulsa
    ''Create IK''. Antes pon cada punto de anclaje en su articulación.

    4. Cara: selecciona la cabeza y pulsa ''Create Head + Look controls''; luego selecciona las partes,
    marca lo que debe hacer cada una y pulsa ''Apply''. Mueve CTRL Look para animar la mirada.

    5. Extras: selecciona capas o propiedades y pulsa la herramienta que necesites. Copy controls / Paste
    + link lleva los controles de expresión a otra capa y enlaza los antiguos a los nuevos.'
  timelineCreation: 'Crea capas de control (null o forma guía): el controlador del IK, CTRL Head, CTRL
    Look, CTRL Eyes o CTRL Morph, con deslizadores y casillas para el rig. Añade expresiones comentadas
    (empiezan por // Zen Easy Rig) a las propiedades riggeadas. El generador de ojos añade grupos de forma
    para el blanco, el párpado, la pupila y las pestañas.'
  limitations: El IK es solo 2D. Las expresiones buscan los controladores por su nombre, así que si renombras
    uno se rompe el enlace hasta que edites el nombre en la expresión. Los trazados dentro de grupos rotados
    o escalados pueden desfasarse. Los menús desplegables no se copian. En Windows los paneles ScriptUI
    no reciben la rueda del ratón, así que se desplaza con la barra de scroll.
  typicalUses: Brazos y piernas con cambio IK/FK, soft IK y estiramiento; doblar pines de marioneta o trazados;
    rigs de cara 2D que giran y miran; ojos de dibujo que parpadean; deslizadores de poses de boca; overlap
    en colas y pelo con Delay; pasar los controles de un rig a una sola capa central.
---
