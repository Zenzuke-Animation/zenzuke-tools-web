/* Explorador de tamaños — textos en inglés.
   El español vive dentro de index.html y app.js (es el idioma original de la herramienta).
   Aquí va solo el inglés. Los números de proporción (16:9, 2.39:1, ×2) no se traducen; el
   separador decimal sí, y de eso se encarga el propio código según el idioma. */
window.MT_SIZES_EN = {
  'doc.title': 'Size explorer',
  'h1': 'Size explorer',
  'lede': 'Type the original size on the left: that is the anchor and it never changes. On the right you adjust width, height, ratio and scale, with locks to pin whichever you like while you move the rest.',

  'h2.original': 'Original',
  'h2.control': 'Transform',

  'rotulo.ancho': 'Width',
  'rotulo.alto': 'Height',
  'rotulo.ratio': 'Ratio',
  'rotulo.escala': 'Scale',
  'rotulo.escalaX': 'Scale X',
  'rotulo.escalaY': 'Scale Y',
  'unidad.px': 'px',

  'pista.soltar': 'Drop an image or a video here, or click to choose a file',
  'presets.titulo': 'Common values',
  'boton.aplicar': 'Apply',
  'boton.reset': 'Back to original',
  'boton.copiar': 'Copy',
  'boton.copiado': 'Copied',
  'atajo.original': 'Original',

  'dato.original': 'Original',
  'dato.ahora': 'Now',

  'nota.noUniforme': 'This is no longer the original ratio: on screen this is a stretch.',
  'nota.sinPar': 'This size has no simple two-number ratio.',
  'nota.aprox': 'Approximate ratio: the exact one is {exacta}.',

  'aviso.candadoAncho': 'The width is locked: it has been respected.',
  'aviso.candadoAlto': 'The height is locked: it has been respected.',
  'aviso.candadoEscala': 'The scale is locked: the size is set by it.',
  'aviso.descartado': 'A lock has prevented the change from being applied. Unlock whatever is in the way if you want that value.',
  'aviso.bloqueado': 'That control is locked.',
  'aviso.noEsMedia': 'That file is not an image or a video.',
  'aviso.sinTamano': 'Could not read the size of that file.',
  'aviso.redondeo': 'Pixels are whole numbers: the ratio ends up at {real} instead of {pedido}, a {desvio}% drift.',

  'aria.origenAncho': 'Original width',
  'aria.origenAlto': 'Original height',
  'aria.ratioA': 'Ratio, first number',
  'aria.ratioB': 'Ratio, second number',
  'aria.ratioDec': 'Ratio as a single number',
  'aria.candadoAncho': 'Lock width',
  'aria.candadoAlto': 'Lock height',
  'aria.candadoRatio': 'Lock ratio',
  'aria.candadoEscala': 'Lock scale',
  'aria.candadoEscalaY': 'Lock scale Y',
  'aria.cerrarCandado': 'Lock',
  'aria.abrirCandado': 'Unlock',
  'aria.atajo': 'Set ratio to',
};

if (window.MT_I18N && window.MT_I18N.dict) MT_I18N.dict({ en: window.MT_SIZES_EN });