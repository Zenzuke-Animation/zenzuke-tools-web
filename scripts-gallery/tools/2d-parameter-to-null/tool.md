---
id: 2d-parameter-to-null
hosts:
- After Effects
tags:
- Rigging
- Timeline
version: '1.0'
status: deprecated
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/adw07r94tsyqz414imq76/2DPrameterToNull.jsx?rlkey=jkwjy3i6euaz643cp0fhcrlkj&dl=1
page: null
en:
  name: 2D Parameter to Null
  description: Creates a null for each 2D (x,y) property of selected effects in your composition. The
    null is placed at the current position of the point and the property is linked to it via expression,
    so you can animate or move it from the null in the comp.
  instructions: '1. Open your comp and select one or more point properties of an effect (e.g. Center of
    Turbulent Displace).

    2. Run the script.

    3. Nulls with names like ''C_[Effect]_[Property]'' are created, already connected via expression.'
  timelineCreation: Creates null layers in the composition, one per selected point property, positioned
    at the current point location.
  limitations: Only works with 2D (x,y) properties. Does not work with 3D properties or non-point controls.
    Renaming or deleting the null breaks the link.
  typicalUses: Animating effect centers (Glow, Turbulent Displace, Lens Flare), syncing multiple points
    with easy-to-move nulls, creating cleaner rig controls inside the comp
es:
  name: 2D Parameter to Null
  description: 'El script crea un *null* por cada propiedad de punto (x,y) de efectos seleccionados en
    tu comp. Ese null se coloca en la posición actual del punto y la propiedad se vincula a él con una
    expresión, para que puedas animarla o moverla desde el null en el comp.


    **OBSOLETO / DEPRECATED**

    AFTER EFFECTS HA METIDO UNA COSA ASI POR DEFECTO CUANDO HACES BOTÓN DERECHO EN UNA PROPIEDAD'
  instructions: Abre tu comp, selecciona una o varias propiedades de punto de un efecto (por ejemplo *Center*
    de Turbulent Displace) y ejecuta el script. Automáticamente tendrás nulls con nombres tipo `C_[Efecto]_[Propiedad]`,
    ya conectados por expresión.
  timelineCreation: Cada propiedad seleccionada genera un null en la comp, con el nombre del efecto y
    la propiedad, y con una expresión que traduce bien las coordenadas (de comp a capa). Así el null controla
    directamente la posición del punto del efecto.
  limitations: Funciona solo con propiedades 2D (x,y). Si renombras o borras el null, la propiedad vuelve
    a su valor original. No sirve para propiedades 3D ni para controles que no sean puntos.
  typicalUses: Animar centros de efectos (Glow, Turbulent Displace, Lens Flare), sincronizar varios puntos
    con nulls fáciles de mover, o crear rigs de control más limpios y prácticos dentro de la comp.
---
