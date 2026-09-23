# Motion Curves Lab — copia propia

Editor de curvas de easing (cubic-bezier) con vista previa animada y exportación a GIF.

- **URL pública:** https://2a3aab5e29e8625e3135.agent37.app
- **Código:** `/home/node/motion-curves-lab` (servidor propio en Agent37, puerto 8123)
- **Original:** hecho con Gemini / Google AI Studio, alojado en Google Cloud Run.

## Arranque

```bash
cd /home/node/motion-curves-lab
python3 -m http.server 8123 --bind 0.0.0.0
agent37 expose 8123 --label "Motion Curves Lab"
```

Ya está añadido a `~/.agent37/hooks/post-restart.sh`, así que se levanta solo al reiniciar el contenedor.

## Ficheros

| Fichero | Qué es |
|---|---|
| `index.html` | Marcado + estilos (CSS escrito a mano) |
| `app.js` | Toda la lógica: matemática de la curva, animación, presets, panel de tema y exportación GIF |
| `vendor/gif.js` | gif.js 0.2.0 (librería de codificación GIF) |
| `vendor/gif.worker.js` | Worker del original, byte a byte |
| `backup/motion-curves-lab.zip` | Copia de seguridad de esta versión |
| `backup/original-ai-studio/` | Ficheros tal cual se servían desde Google (referencia) |

## Qué se ha simplificado respecto al original

- **Fuera React, framer-motion y el runtime de Tailwind** (345 KB de JS + 14 KB de CSS compilado) → JavaScript plano y CSS a mano. El proyecto entero son ~35 KB en 4 ficheros.
- **Fuera el andamiaje de Google AI Studio**: registro del service worker, `_websocket-interceptor.js` (proxy de `generativelanguage.googleapis.com`) y el `manifest` de su hosting. No aportan nada a la herramienta: la app no llama a ninguna API.
- **La animación ya no re-renderiza el árbol de componentes 60 veces por segundo**: se actualizan directamente la bola, la línea y el punto.
- Se mantienen tal cual: la matemática de la curva (Newton-Raphson, 8 iteraciones), los presets, el panel de tema, el formato de los controles y la exportación GIF (600×600, 30 fps, 60 fotogramas, `quality: 5`, 2 workers).

## Qué se ha añadido

- **Adaptación a móvil** (`@media` en `index.html` + la función `fit()` en `app.js`):
  - La composición pista+curva se escala **en bloque y con las mismas proporciones**: ocupa todo el ancho disponible y la rejilla siempre queda cuadrada (nunca se deforma ni se encoge).
  - Solo se reduce por debajo de eso si el alto no da (móvil en horizontal, ventanas bajas en escritorio).
  - ≤600 px: el input de la curva pasa a línea completa y los botones GIF/ajustes van debajo, centrados.
  - El escritorio no cambia: a partir de ~626 px de ancho y ~660 px de alto el factor de escala es 1.
- Título de pestaña `Motion Curves Lab` (el original decía `My Google AI Studio App`).

## Verificación

- **GIF byte a byte idéntico** al del original: mismo SHA-256
  `c5703b9dfee1c5670368db6df2dbafe6bcf10da31f37e0c2ee82b26dad7aa4f3` y mismos 667.909 bytes.
- **Geometría de escritorio idéntica**: comparadas pista, rejilla, bola, input, botón GIF, botón ajustes, presets y panel de tema (x/y/ancho/alto) contra el original en el mismo navegador → coinciden todas.
- **Sin errores de consola**, sin desbordes horizontales ni verticales, rejilla cuadrada y composición a todo el ancho a 320/360/390/412/430 px, en móvil horizontal (740x380) y en escritorio (1440x900).

## Detalles de fábrica del original (sin tocar)

- El GIF se dibuja con su propia composición 600×600, algo más pequeña en proporción que la vista web (pista de 60×400 y bola de 50 px frente a 80×450 y 60 px).
- El panel de tema acepta cualquier texto en los campos de color (no valida el hex): los colores se usan concatenando el alfa (`#RRGGBB` + `14`/`1A`/`33`), exactamente igual que el original.

## Tiempos del GIF (arreglados a petición de Carlos)

El original exportaba 60 fotogramas con 33,33 ms pedidos, que el formato GIF redondeaba a 30 ms:
total 1,8 s en vez de los 2 s de la vista previa, y sin el fotograma final (el ciclo se quedaba en t = 59/60).

Ahora:
- **Todos los fotogramas duran exactamente lo mismo**: 30 ms (`FRAME_MS`), 3 centésimas en el GIF, sin repartos irregulares.
- **El número de fotogramas se calcula desde la duración**: 2000 ms / 30 ms = 66,67 → 67 fotogramas. Total **2,01 s** (10 ms de desvío, 0,5%).
- **Se recorre el ciclo completo, de t = 0 a t = 1**: el último fotograma es el estado final (la bola arriba del todo), así que la animación se ve entera antes de volver a empezar.
- Verificado sobre el GIF exportado: 67 fotogramas, todos con 3 cs (suma 2,01 s), bola en el extremo inferior en el primer fotograma y en el superior en el último (color muestreado en los píxeles), y con la curva LINEAR la bola pasa exactamente por la mitad en el fotograma central.
- El GIF ya **no es byte a byte idéntico al original**: este cambio es intencionado.

## Ajustes rápidos

En `app.js`, arriba del todo:

```js
var DURATION = 2;    // segundos por ciclo
var FRAME_MS = 30;   // duración de cada fotograma del GIF (todos iguales)
var GIF_SIZE = 600;  // lado del lienzo del GIF
var PRESETS = {...}  // atajos de curvas
var DEFAULT_THEME = {...} // colores de arranque
```
