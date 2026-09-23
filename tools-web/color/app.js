'use strict';
/* Conversor de color: sRGB -> perfiles de vídeo, cine, foto, modelos y espacios de referencia.
   Matemática escrita a mano, sin dependencias: matrices RGB->XYZ calculadas en carga desde
   las cromaticidades xy de cada estándar y adaptación cromática Bradford cuando el blanco
   de destino no es D65. Verificado contra colour-science 0.4.7 (ver PROYECTO.md). */

/* ---------------- álgebra de matrices 3x3 ---------------- */
const mul = (a, b) => {
  const o = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) o[i][j] += a[i][k] * b[k][j];
  return o;
};
const mulV = (m, v) => [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
                         m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
                         m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]];
const inv3 = (m) => {
  const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2];
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  if (Math.abs(det) < 1e-12) throw new Error('matriz singular');
  return [[A / det, -(b * i - c * h) / det, (b * f - c * e) / det],
          [B / det, (a * i - c * g) / det, -(a * f - c * d) / det],
          [C / det, -(a * h - b * g) / det, (a * e - b * d) / det]];
};
const xyToXyz = ([x, y]) => [x / y, 1, (1 - x - y) / y];

function rgbToXyzMatriz(prim, blanco) {
  const cols = [xyToXyz(prim.r), xyToXyz(prim.g), xyToXyz(prim.b)];
  const M = [[cols[0][0], cols[1][0], cols[2][0]],
             [cols[0][1], cols[1][1], cols[2][1]],
             [cols[0][2], cols[1][2], cols[2][2]]];
  const w = xyToXyz(blanco);
  const ww = [w[0] / w[1], 1, w[2] / w[1]];
  const S = mulV(inv3(M), ww);
  return [[M[0][0] * S[0], M[0][1] * S[1], M[0][2] * S[2]],
          [M[1][0] * S[0], M[1][1] * S[1], M[1][2] * S[2]],
          [M[2][0] * S[0], M[2][1] * S[1], M[2][2] * S[2]]];
}

const BRADFORD = [[0.8951, 0.2664, -0.1614], [-0.7502, 1.7135, 0.0367], [0.0389, -0.0685, 1.0296]];
const BRADFORD_INV = inv3(BRADFORD);
function bradford(blancoDesde, blancoHasta) {
  const a = xyToXyz(blancoDesde), b = xyToXyz(blancoHasta);
  const ws = mulV(BRADFORD, [a[0] / a[1], 1, a[2] / a[1]]);
  const wd = mulV(BRADFORD, [b[0] / b[1], 1, b[2] / b[1]]);
  const D = [[wd[0] / ws[0], 0, 0], [0, wd[1] / ws[1], 0], [0, 0, wd[2] / ws[2]]];
  return mul(BRADFORD_INV, mul(D, BRADFORD));
}

/* ---------------- blancos y primarias ---------------- */
const D65 = [0.3127, 0.3290];
const D50 = [0.34567, 0.35850];
const D60 = [0.32168, 0.33767];
const DCI = [0.314, 0.351];
const PRIM = {
  srgb: { r: [0.640, 0.330], g: [0.300, 0.600], b: [0.150, 0.060] },
  p3: { r: [0.680, 0.320], g: [0.265, 0.690], b: [0.150, 0.060] },
  bt2020: { r: [0.708, 0.292], g: [0.170, 0.797], b: [0.131, 0.046] },
  adobe: { r: [0.640, 0.330], g: [0.210, 0.710], b: [0.150, 0.060] },
  prophoto: { r: [0.7347, 0.2653], g: [0.1596, 0.8404], b: [0.0366, 0.0001] },
  smptec: { r: [0.630, 0.340], g: [0.310, 0.595], b: [0.155, 0.070] },
  ebu: { r: [0.640, 0.330], g: [0.290, 0.600], b: [0.150, 0.060] },
  ap0: { r: [0.7347, 0.2653], g: [0.0000, 1.0000], b: [0.0001, -0.0770] },
  ap1: { r: [0.713, 0.293], g: [0.165, 0.830], b: [0.128, 0.044] },
};

/* ---------------- funciones de transferencia ---------------- */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const TF = {
  srgb: {
    dec: (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)),
    enc: (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055),
  },
  gamma: (g) => ({ dec: (v) => Math.pow(v, g), enc: (v) => Math.pow(v, 1 / g) }),
  bt709oetf: {
    dec: (v) => (v < 0.081 ? v / 4.5 : Math.pow((v + 0.099) / 1.099, 1 / 0.45)),
    enc: (v) => (v < 0.018 ? v * 4.5 : 1.099 * Math.pow(v, 0.45) - 0.099),
  },
  bt1886: { dec: (v) => Math.pow(v, 2.4), enc: (v) => Math.pow(v, 1 / 2.4) },
  dci: { dec: (v) => Math.pow(v, 2.6), enc: (v) => Math.pow(v, 1 / 2.6) },
  adobe: { dec: (v) => Math.pow(v, 563 / 256), enc: (v) => Math.pow(v, 256 / 563) },
  prophoto: {
    dec: (v) => (v < 16 / 512 ? v / 16 : Math.pow(v, 1.8)),
    enc: (v) => (v < 1 / 512 ? v * 16 : Math.pow(v, 1 / 1.8)),
  },
  acescc: {
    enc: (v) => (v <= 0 ? (Math.log2(Math.pow(2, -16)) + 9.72) / 17.52
              : v < Math.pow(2, -15) ? (Math.log2(Math.pow(2, -16) + v * 0.5) + 9.72) / 17.52
              : (Math.log2(v) + 9.72) / 17.52),
  },
  acescct: {
    enc: (v) => (v <= 0.0078125 ? 10.5402377416545 * v + 0.0729055341958355
              : (Math.log2(v) + 9.72) / 17.52),
  },
};

/* ---------------- espacios ---------------- */
const M_SRGB = rgbToXyzMatriz(PRIM.srgb, D65);
const M_SRGB_INV = inv3(M_SRGB);
const XYZ_D50_BLANCO = [D50[0] / D50[1], 1, (1 - D50[0] - D50[1]) / D50[1]];
const BRAD_D65_D50 = bradford(D65, D50);

function espacio(id, nombre, grupo, opts) {
  const prim = opts.prim || PRIM.srgb;
  const blanco = opts.blanco || D65;
  const M = rgbToXyzMatriz(prim, blanco);
  const mismoBlanco = Math.abs(blanco[0] - D65[0]) < 1e-9 && Math.abs(blanco[1] - D65[1]) < 1e-9;
  // opts se copia entero: si no, campos como tipo o ficha se perdían por el camino
  return Object.assign({}, opts, {
    id, nombre, grupo, prim, blanco, M, Minv: inv3(M),
    adapt: mismoBlanco ? [[1, 0, 0], [0, 1, 0], [0, 0, 1]] : bradford(D65, blanco),
    codificado: opts.codificado !== false,
    tipo: opts.tipo || 'rgb',
    mismoBlanco,
  });
}

const ESPACIOS = [
  espacio('srgb', 'sRGB', 'Pantalla, web y vídeo', {
    tf: TF.srgb, prim: PRIM.srgb, blanco: D65,
    ficha: {
      texto: 'Es el espacio de partida y el que usan por defecto los navegadores, los programas de diseño y las pantallas de consumo. Sus primarias son exactamente las mismas que las del vídeo HD (Rec.709), así que el gamut coincide: lo que cambia frente al vídeo es la curva de codificación, no los colores que caben.',
      primarias: 'sRGB y Rec.709: rojo (0,640 · 0,330), verde (0,300 · 0,600), azul (0,150 · 0,060)',
      blanco: 'D65 (0,3127 · 0,3290), el mismo que el color original',
      curva: 'Función sRGB: tramo lineal por debajo de 0,04045 y exponente 2,4 por encima. La cifra que verás citada siempre es gamma 2,2, que es su comportamiento equivalente en los medios tonos, pero la curva real no es una potencia pura.',
      uso: 'Interfaces, web, CSS, fotografía doméstica, valores hex.',
      profundidad: '8 bit, 0 a 255, con tramo lineal en sombras para que los negros no se apelmacen.',
    },
  }),
  espacio('r709', 'Rec.709, display gamma 2.4', 'Pantalla, web y vídeo', {
    tf: TF.bt1886, prim: PRIM.srgb, blanco: D65,
    ficha: {
      texto: 'El estándar del vídeo HD. Comparte primarias y blanco con sRGB, así que aquí no hay diferencia de gamut: lo que cambia es la curva de display, y esa curva es un gamma puro de 2,4, la recomendación BT.1886 para monitores de referencia.',
      primarias: 'Rec.709 (idénticas a sRGB)',
      blanco: 'D65, igual que el original',
      curva: 'Gamma 2,4 de display. Al no tener tramo lineal, los medios tonos salen más claros que en sRGB: este gris 128 acabará en 135. Un negro 0 sigue siendo 0 y un blanco 255 sigue siendo 255.',
      uso: 'Vídeo HD, edición en monitor calibrado a 2,4, másteres y entregas de broadcast.',
      profundidad: '8 y 10 bit. Es el formato con el que se suele etiquetar un vídeo SDR de HD.',
      nota: 'No confundir con la curva de cámara del mismo estándar: son dos cosas distintas y se llaman igual.',
    },
  }),
  espacio('r709cam', 'Rec.709, curva de cámara', 'Pantalla, web y vídeo', {
    tf: TF.bt709oetf, prim: PRIM.srgb, blanco: D65,
    ficha: {
      texto: 'El mismo Rec.709 pero con la curva con la que se codifica la señal al capturarla, la OETF del estándar, no la del monitor. Es la que aparece en archivos de cámara y en material que todavía no está preparado para verse directo.',
      primarias: 'Rec.709',
      blanco: 'D65',
      curva: 'OETF de cámara: tramo lineal por debajo de 0,018 y por encima V = 1,099 · L^0,45 − 0,099. Compáralo con el gamma 2,4 de display: son curvas diferentes y por eso los valores no coinciden.',
      uso: 'Señal de captura, ProRes de cámara, cintas y archivos previos a la corrección de color.',
      profundidad: '8 y 10 bit.',
    },
  }),
  espacio('r2020', 'Rec.2020, display gamma 2.4', 'Pantalla, web y vídeo', {
    tf: TF.bt1886, prim: PRIM.bt2020, blanco: D65,
    ficha: {
      texto: 'El estándar de la televisión UHD. Sus primarias son bastante más amplias que las de sRGB y Rec.709, así que la mayoría de los colores saturados bajan de valor: el mismo rojo puro de sRGB ocupa solo el 82 % del rojo disponible aquí.',
      primarias: 'Rec.2020: rojo (0,708 · 0,292), verde (0,170 · 0,797), azul (0,131 · 0,046)',
      blanco: 'D65, igual que el original, así que no hay adaptación',
      curva: 'Gamma 2,4 de display, la misma convención que el HD.',
      uso: 'Emisiones 4K y 8K, monitores de referencia UHD, contenedores de HDR.',
      profundidad: '10 y 12 bit en la práctica; 8 bit se queda corto para este gamut.',
    },
  }),
  espacio('r2020cam', 'Rec.2020, curva de cámara', 'Pantalla, web y vídeo', {
    tf: TF.bt709oetf, prim: PRIM.bt2020, blanco: D65,
    ficha: {
      texto: 'Rec.2020 con la curva de captura en vez de la de display. Se usa en la señal de cámara UHD y en material HDR antes de la transformación de tono.',
      primarias: 'Rec.2020',
      blanco: 'D65',
      curva: 'Misma OETF de cámara que Rec.709 (1,099 y 0,45) pero sobre las primarias anchas de 2020.',
      uso: 'Señal de captura UHD, archivos de cámara de gama ancha.',
      profundidad: '10 y 12 bit.',
    },
  }),
  espacio('dcip3', 'DCI-P3, gamma 2.6 y blanco de cine', 'Pantalla, web y vídeo', {
    tf: TF.dci, prim: PRIM.p3, blanco: DCI,
    ficha: {
      texto: 'El espacio de la proyección de cine digital, el de los DCP. Tiene las primarias P3 y dos cosas que lo hacen distinto de todo lo demás: un gamma de 2,6, más contrastado que el de vídeo, y un blanco de proyección propio, más amarillento que D65.',
      primarias: 'P3: rojo (0,680 · 0,320), verde (0,265 · 0,690), azul (0,150 · 0,060)',
      blanco: 'Blanco de cine (0,314 · 0,351), distinto del original, así que aquí sí se hace adaptación cromática y lo notarás en los valores',
      curva: 'Gamma 2,6 de proyección. Es el gamma más alto de la lista: los medios tonos quedan más oscuros y el contraste sube.',
      uso: 'DCP, cabinas de proyección, máster de cine digital.',
      profundidad: '12 bit en la cadena de cine (XYZ codificado para DCP).',
      nota: 'Este no es el P3 de los monitores: ver Display P3.',
    },
  }),
  espacio('dp3', 'Display P3', 'Pantalla, web y vídeo', {
    tf: TF.srgb, prim: PRIM.p3, blanco: D65,
    ficha: {
      texto: 'El P3 que llevan los monitores y dispositivos de Apple y buena parte de las pantallas de gama alta. Usa las primarias de cine (P3) pero con la curva de sRGB y blanco D65, así que es más ancho que sRGB sin cambiar el contraste ni el blanco.',
      primarias: 'P3, más anchas que sRGB sobre todo en rojo y verde',
      blanco: 'D65, igual que el original',
      curva: 'La función sRGB, la del color original: misma gamma equivalente de 2,2 y mismo tramo lineal en sombras.',
      uso: 'iPhone, iPad, Mac, móviles y portátiles de gama alta, archivos de pantalla.',
      profundidad: '8 y 10 bit.',
    },
  }),
  espacio('r601ntsc', 'Rec.601 NTSC (SMPTE-C)', 'Pantalla, web y vídeo', {
    tf: TF.gamma(2.2), prim: PRIM.smptec, blanco: D65,
    ficha: {
      texto: 'El estándar del vídeo SD americano y japonés, el de 525 líneas. Sus primarias son un poco más estrechas que las de sRGB, así que los colores saturados se salen del gamut con facilidad y hay que recortarlos.',
      primarias: 'SMPTE-C: rojo (0,630 · 0,340), verde (0,310 · 0,595), azul (0,155 · 0,070)',
      blanco: 'D65',
      curva: 'Gamma 2,2, la convención clásica del vídeo de definición estándar.',
      uso: 'Material SD antiguo, DV NTSC, conversiones de cintas.',
      profundidad: '8 bit, normalmente en YCbCr y no en RGB.',
    },
  }),
  espacio('r601pal', 'Rec.601 PAL (EBU)', 'Pantalla, web y vídeo', {
    tf: TF.gamma(2.2), prim: PRIM.ebu, blanco: D65,
    ficha: {
      texto: 'El SD europeo, el de 625 líneas. Las primarias EBU son las mismas que las de sRGB en rojo y azul, con el verde algo distinto, así que el gamut es muy parecido al del original y los recortes son pequeños.',
      primarias: 'EBU: rojo (0,640 · 0,330), verde (0,290 · 0,600), azul (0,150 · 0,060)',
      blanco: 'D65',
      curva: 'Gamma 2,2, la del vídeo SD.',
      uso: 'DV PAL, material de archivo europeo, cintas Betacam.',
      profundidad: '8 bit, en YCbCr.',
    },
  }),
  espacio('adobe', 'Adobe RGB (1998)', 'Foto e imprenta', {
    tf: TF.adobe, prim: PRIM.adobe, blanco: D65,
    ficha: {
      texto: 'Espacio de fotografía pensado para imprenta: mantiene el rojo y el azul de sRGB y estira el verde, que es donde los colores de impresión se quedaban fuera. Los magentas y los verdes intensos caben mejor.',
      primarias: 'Adobe RGB: rojo (0,640 · 0,330), verde (0,210 · 0,710), azul (0,150 · 0,060)',
      blanco: 'D65',
      curva: 'Gamma 2,199, que en la norma se escribe como la fracción exacta 563/256, ligeramente distinta del 2,2 de vídeo.',
      uso: 'Fotografía, retoque, conversión a CMYK para imprenta.',
      profundidad: '8 y 16 bit.',
    },
  }),
  espacio('prophoto', 'ProPhoto (ROMM RGB)', 'Foto e imprenta', {
    tf: TF.prophoto, prim: PRIM.prophoto, blanco: D50,
    ficha: {
      texto: 'El espacio más amplio de la lista, pensado para revelar RAW sin perder información. Contiene colores que no existen en pantalla ni se pueden imprimir, así que los valores pueden salirse de 0 y 1 sin que eso sea un error.',
      primarias: 'ROMM: rojo (0,7347 · 0,2653), verde (0,1596 · 0,8404), azul (0,0366 · 0,0001)',
      blanco: 'D50 (0,3457 · 0,3585), el blanco de artes gráficas, distinto del original: aquí se adapta el color y los valores se desplazan',
      curva: 'Gamma 1,8 con un tramo lineal por debajo de 1/512. Es la curva más suave de la lista.',
      uso: 'Revelado de RAW, flujo de imprenta, archivos maestros de fotografía.',
      profundidad: '16 bit por norma.',
    },
  }),
  espacio('lin', 'sRGB lineal', 'Cine y VFX', {
    codificado: false, prim: PRIM.srgb, blanco: D65,
    ficha: {
      texto: 'El sRGB del que se ha quitado la curva. Aquí los números son proporcionales a la luz: el doble de valor es el doble de luz, algo que la curva de pantalla rompe. Es lo que quieren los cálculos de luz, las mezclas, los desenfoques y el render.',
      primarias: 'sRGB',
      blanco: 'D65',
      curva: 'Ninguna: sin gamma. Por eso un gris 128 de sRGB vale 0,2159 aquí en vez de 0,502.',
      uso: 'Composición, desenfoque de movimiento, mezclas, render 3D, iluminación.',
      profundidad: 'Flotante. En este espacio los enteros y el hex son solo una lectura, no un formato de archivo real.',
    },
  }),
  espacio('acescg', 'ACEScg (AP1 lineal)', 'Cine y VFX', {
    codificado: false, prim: PRIM.ap1, blanco: D60,
    ficha: {
      texto: 'El espacio de trabajo de ACES para efectos y animación 3D en lineal. Sus primarias son más amplias que las de cine y su blanco es el D60 de ACES, el mismo que usan todas las piezas de la cadena.',
      primarias: 'AP1: rojo (0,713 · 0,293), verde (0,165 · 0,830), azul (0,128 · 0,044)',
      blanco: 'D60 (0,3217 · 0,3377), el de ACES, distinto del original',
      curva: 'Ninguna: lineal, con valores proporcionales a la luz.',
      uso: 'Render, Nuke, Maya, composición con el flujo de trabajo ACES.',
      profundidad: 'Flotante, 16 bit o 32 bit por canal.',
    },
  }),
  espacio('aces2065', 'ACES2065-1 (AP0 lineal)', 'Cine y VFX', {
    codificado: false, prim: PRIM.ap0, blanco: D60,
    ficha: {
      texto: 'El espacio de intercambio y archivo de ACES. Sus primarias AP0 son tan amplias que cubren todo el espectro visible por dentro de valores positivos, y por eso es el que se usa para entregar y guardar, no para trabajar.',
      primarias: 'AP0: rojo (0,7347 · 0,2653), verde (0,0000 · 1,0000), azul (0,0001 · -0,0770)',
      blanco: 'D60, el de ACES',
      curva: 'Ninguna: lineal.',
      uso: 'Entrega y archivo de másteres ACES, OpenEXR de intercambio.',
      profundidad: 'Flotante, normalmente media float (16 bit por canal).',
    },
  }),
  espacio('acescc', 'ACEScc', 'Cine y VFX', {
    codificado: false, prim: PRIM.ap1, blanco: D60, tf: TF.acescc,
    ficha: {
      texto: 'Codificación logarítmica en base 2 de ACES, pensada para las ruedas de color de los programas de corrección. Al no tener tramo lineal, el negro queda en un valor alto y las sombras se corrigen con mucha suavidad.',
      primarias: 'AP1',
      blanco: 'D60',
      curva: 'Log en base 2: V = (log2(L) + 9,72) / 17,52 por encima de 2 elevado a −15, con una zona de transición por debajo. El negro absoluto cae en 0,0729 y el blanco en 0,5548.',
      uso: 'Corrección de color en el flujo ACES, sobre todo en las herramientas clásicas.',
      profundidad: 'Media float.',
      nota: 'Cuidado con el hex en este formato: los valores de ACEScc no son colores de pantalla, son una curva de gradación.',
    },
  }),
  espacio('acescct', 'ACEScct', 'Cine y VFX', {
    codificado: false, prim: PRIM.ap1, blanco: D60, tf: TF.acescct,
    ficha: {
      texto: 'Igual que ACEScc pero con un tramo lineal en las sombras, añadido a propósito para que el negro se comporte como en los programas tradicionales. Es la variante que hoy se usa por defecto en corrección de color.',
      primarias: 'AP1',
      blanco: 'D60',
      curva: 'Log en base 2 por encima de 0,0078125 y tramo lineal por debajo, con pendiente 10,54. Los negros se comportan como la vista espera.',
      uso: 'Grading en DaVinci Resolve, Baselight y compañía, dentro de ACES.',
      profundidad: 'Media float.',
    },
  }),
  espacio('xyz65', 'XYZ (CIE 1931, D65)', 'Medición y referencia', {
    codificado: false, tipo: 'modelo', prim: PRIM.srgb, blanco: D65,
    ficha: {
      texto: 'El espacio de la CIE de 1931, la referencia de la que salen todos los demás. No es un espacio de pantalla: describe el color tal cual, con independencia del dispositivo, por eso se usa como puente entre formatos.',
      primarias: 'No tiene primarias propias: es el sistema de referencia',
      blanco: 'D65',
      curva: 'Ninguna, y sus valores no se parecen a los de una pantalla: el blanco vale 0,9505 · 1,0000 · 1,0891.',
      uso: 'Cálculo, medición, conversión entre espacios, perfiles ICC.',
      profundidad: 'Flotante.',
    },
  }),
  espacio('xyz50', 'XYZ (CIE 1931, D50)', 'Medición y referencia', {
    codificado: false, tipo: 'modelo', prim: PRIM.srgb, blanco: D50,
    ficha: {
      texto: 'El mismo XYZ pero referido al blanco D50, el de artes gráficas. Es la etapa intermedia natural antes de Lab y de todo lo relacionado con imprenta y papel.',
      primarias: 'Sistema de referencia',
      blanco: 'D50, distinto del original: aquí se adapta el color',
      curva: 'Ninguna.',
      uso: 'Camino hacia Lab, perfiles de impresora, comparación de color.',
      profundidad: 'Flotante.',
    },
  }),
  espacio('lab', 'Lab (D50)', 'Medición y referencia', {
    codificado: false, tipo: 'modelo', prim: PRIM.srgb, blanco: D50,
    ficha: {
      texto: 'Espacio perceptivo diseñado para que distancias parecidas entre números se vean como diferencias parecidas. Separa la luz (L) del color: dos colores con la misma L tienen el mismo brillo percibido aunque sus valores RGB no se parezcan.',
      primarias: 'No aplica: es un modelo derivado de XYZ',
      blanco: 'D50',
      curva: 'No hay gamma: hay una función de compresión con exponente 1/3 y un escalón por debajo de 0,008856. L va de 0 a 100, a y b de alrededor de −128 a 127.',
      uso: 'Comparar colores, tolerancias de impresión, análisis de imágenes.',
      profundidad: 'Flotante.',
      nota: 'Aquí el hex y los enteros no tienen sentido: son tres números con otra escala.',
    },
  }),
  espacio('lch', 'LCh (D50)', 'Medición y referencia', {
    codificado: false, tipo: 'modelo', prim: PRIM.srgb, blanco: D50,
    ficha: {
      texto: 'El mismo Lab en coordenadas polares: en vez de a y b, croma y ángulo de tono. Es más cómodo para mover saturación y tono de forma independiente sin cambiar el brillo.',
      primarias: 'No aplica',
      blanco: 'D50',
      curva: 'No hay gamma. L de 0 a 100, C de 0 a ~130 y h en grados de 0 a 360.',
      uso: 'Ajustes de color por tono, paletas, selecciones.',
      profundidad: 'Flotante.',
    },
  }),
  espacio('hsl', 'HSL', 'Medición y referencia', {
    codificado: false, tipo: 'modelo', prim: PRIM.srgb, blanco: D65,
    ficha: {
      texto: 'No es un espacio de color, es otra forma de escribir el mismo sRGB: tono en grados, saturación y luminosidad en porcentaje. Cómodo para generar variaciones, pero no describe cómo se ve el color ni cómo lo trata la luz.',
      primarias: 'Las de sRGB, porque trabaja sobre sRGB',
      blanco: 'D65',
      curva: 'La de sRGB, ya aplicada antes de convertir.',
      uso: 'Paletas, valores de CSS, ajustes rápidos de tono y saturación.',
      profundidad: 'H, S y L con decimales.',
    },
  }),
  espacio('hsv', 'HSV', 'Medición y referencia', {
    codificado: false, tipo: 'modelo', prim: PRIM.srgb, blanco: D65,
    ficha: {
      texto: 'Primo de HSL: tono, saturación y valor. Es el modelo de los selectores de color clásicos y de los programas de pintura, porque con V al máximo y S al máximo se ve el color más vivo posible en pantalla.',
      primarias: 'Las de sRGB',
      blanco: 'D65',
      curva: 'La de sRGB.',
      uso: 'Selectores de color, pintura digital, generación de variantes.',
      profundidad: 'H, S y V con decimales.',
    },
  }),
];

/* YCbCr: luma y dos diferencias de color. No es un triplete RGB. */
const YCBCR = [
  { id: 'y601', nombre: 'YCbCr Rec.601 (rango legal)', grupo: 'Vídeo YCbCr', kr: 0.299, kb: 0.114, tf: TF.gamma(2.2), prim: PRIM.smptec, tipo: 'ycbcr',
    ficha: {
      texto: 'Formato del vídeo SD. En vez de tres colores guarda un valor de brillo y dos diferencias de color, que es lo que hacían los sistemas de televisión en color para seguir siendo compatibles con los receptores en blanco y negro. Con rango legal se reserva el margen de 16 y de 235 para el sincronismo, así que 16 es el negro y 235 el blanco.',
      primarias: 'SMPTE-C, las del SD americano',
      blanco: 'D65',
      curva: 'Codificado con gamma 2,2 antes de calcular la luma. Y = 0,299 R + 0,587 G + 0,114 B.',
      uso: 'Cintas SD, DV, capturadoras antiguas, material de archivo.',
      profundidad: '8 bit: Y de 16 a 235, Cb y Cr de 16 a 240, con el gris neutro en 128.',
      nota: 'Aquí no hay hexadecimal ni simulación de pantalla: Y, Cb y Cr no son rojo, verde y azul.',
    } },
  { id: 'y709', nombre: 'YCbCr Rec.709 (rango legal)', grupo: 'Vídeo YCbCr', kr: 0.2126, kb: 0.0722, tf: TF.bt709oetf, prim: PRIM.srgb, tipo: 'ycbcr',
    ficha: {
      texto: 'El formato en que viaja casi todo el vídeo HD: H.264, HEVC, ProRes y las señales de broadcast. Guarda luma y dos diferencias de color porque el ojo distingue mucho mejor el brillo que el detalle de color, y así se puede comprimir el color sin que se note.',
      primarias: 'Rec.709',
      blanco: 'D65',
      curva: 'Se calcula sobre los valores codificados con la OETF de cámara. Y = 0,2126 R + 0,7152 G + 0,0722 B.',
      uso: 'HD, H.264 y HEVC, ProRes, televisiones, tarjetas capturadoras.',
      profundidad: '8 y 10 bit. En rango legal: 16 a 235 para Y, 16 a 240 para Cb y Cr.',
      nota: 'Es el formato del que más se oye hablar cuando un vídeo se ve «con los negros lavados»: casi siempre es un archivo etiquetado como legal reproducido como full, o al contrario.',
    } },
  { id: 'y709f', nombre: 'YCbCr Rec.709 (rango full)', grupo: 'Vídeo YCbCr', kr: 0.2126, kb: 0.0722, tf: TF.bt709oetf, prim: PRIM.srgb, tipo: 'ycbcr', full: true,
    ficha: {
      texto: 'El mismo Rec.709 pero usando todo el recorrido disponible: 0 es negro y 255 es blanco, sin margen reservado. Es lo que traen muchos archivos domésticos, capturas de pantalla y grabaciones de móvil o de juegos.',
      primarias: 'Rec.709',
      blanco: 'D65',
      curva: 'OETF de cámara, igual que la variante legal. Y = 0,2126 R + 0,7152 G + 0,0722 B.',
      uso: 'Grabaciones domésticas, capturas de pantalla, móviles, consolas.',
      profundidad: '8 bit: Y de 0 a 255 y Cb y Cr de 0 a 255, con el gris neutro en 128.',
    } },
  { id: 'y2020', nombre: 'YCbCr Rec.2020 (rango legal)', grupo: 'Vídeo YCbCr', kr: 0.2627, kb: 0.0593, tf: TF.bt709oetf, prim: PRIM.bt2020, tipo: 'ycbcr',
    ficha: {
      texto: 'El formato de la televisión UHD. Misma idea de luma y diferencias de color, pero con las primarias anchas de Rec.2020 y otros coeficientes de luma, porque el verde pesa más en este gamut.',
      primarias: 'Rec.2020',
      blanco: 'D65',
      curva: 'OETF de cámara sobre las primarias de 2020. Y = 0,2627 R + 0,6780 G + 0,0593 B.',
      uso: 'UHD, contenidos HDR, entregas de broadcast 4K.',
      profundidad: '10 bit de norma; 12 bit en flujos de alta calidad.',
    } },
];

/* ---------------- conversiones ---------------- */
function hexDesdeRgb8(r, g, b) {
  const h = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b);
}

function xyzDesdeSrgb8(rgb8) {
  const lin = rgb8.map((v) => TF.srgb.dec(v / 255));
  return mulV(M_SRGB, lin);
}

/* XYZ D65 -> valores del espacio destino, con lineal, recorte y aviso de gamut */
function calcular(esp, xyzD65) {
  if (esp.id === 'xyz65') return { enc: xyzD65, lin: null, fuera: false, fueraDe: '', q: xyzD65 };
  if (esp.id === 'xyz50') {
    const x = mulV(BRAD_D65_D50, xyzD65);
    return { enc: x, lin: null, fuera: false, fueraDe: '', q: x };
  }
  const xyz = mulV(esp.adapt, xyzD65);
  const lin = mulV(esp.Minv, xyz);
  const fuera = lin.some((x) => x < -1e-6 || x > 1 + 1e-6);
  const fueraDe = lin.map((x) => (x < -1e-6 ? '<0' : x > 1 + 1e-6 ? '>1' : null))
                     .map((f, i) => (f ? 'RGB'[i] : null)).filter(Boolean).join(', ');
  const enc = lin.map((x) => {
    const e = esp.tf ? esp.tf.enc(x) : x;
    return Number.isFinite(e) ? e : esp.tf.enc(clamp01(x));
  });
  return { enc, lin, fuera, fueraDe, q: enc.map(clamp01) };
}
function encodar(esp, xyzD65) { return calcular(esp, xyzD65).enc; }

function labDesdeXyz50(xyz) {
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f(xyz[0] / XYZ_D50_BLANCO[0]), fy = f(xyz[1] / XYZ_D50_BLANCO[1]), fz = f(xyz[2] / XYZ_D50_BLANCO[2]);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function hslDesdeRgb8([r, g, b]) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === R) h = ((G - B) / d) % 6; else if (max === G) h = (B - R) / d + 2; else h = (R - G) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  return [h, (d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))) * 100, l * 100];
}

function hsvDesdeRgb8([r, g, b]) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === R) h = ((G - B) / d) % 6; else if (max === G) h = (B - R) / d + 2; else h = (R - G) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, (max === 0 ? 0 : d / max) * 100, max * 100];
}

function rgb8DesdeHsl(h, s, l) {
  h = ((h % 360) + 360) % 360; s = clamp01(s / 100); l = clamp01(l / 100);
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  let rgb;
  if (h < 60) rgb = [c, x, 0]; else if (h < 120) rgb = [x, c, 0]; else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c]; else if (h < 300) rgb = [x, 0, c]; else rgb = [c, 0, x];
  return rgb.map((v) => Math.round(clamp01(v + m) * 255));
}

function ycbcrDesde(esp, xyzD65) {
  const base = espacio('tmp', '', '', { prim: esp.prim, blanco: D65 });
  const xyz = mulV(base.adapt, xyzD65);
  const lin = mulV(base.Minv, xyz);
  const v = lin.map((x) => { const e = esp.tf.enc(x); return Number.isFinite(e) ? e : esp.tf.enc(clamp01(x)); });
  const kr = esp.kr, kb = esp.kb, kg = 1 - kr - kb;
  const Y = kr * v[0] + kg * v[1] + kb * v[2];
  const Cb = (v[2] - Y) / (2 * (1 - kb));
  const Cr = (v[0] - Y) / (2 * (1 - kr));
  if (esp.full) return [Y * 255, Cb * 255 + 128, Cr * 255 + 128];
  return [219 * Y + 16, 224 * Cb + 128, 224 * Cr + 128];
}

/* ---------------- vuelta al color: qué se ve de verdad ----------------
   No es una simulación. Se toma la señal ya codificada en el formato destino, se
   decodifica con SU curva y SUS primarias y se vuelve a codificar en sRGB para poder
   pintarla aquí. Si el color cabía en el gamut, esto devuelve exactamente el original;
   si no cabía, devuelve el color más cercano que ese formato sí puede mostrar. */
function srgb8DesdeXyzD65(xyz) {
  const lin = mulV(M_SRGB_INV, xyz);
  return lin.map((v) => Math.round(clamp01(TF.srgb.enc(clamp01(v))) * 255));
}

function srgb8DesdeEnc(esp, enc) {
  const v = enc.map(clamp01);
  if (esp.id === 'xyz65') return srgb8DesdeXyzD65(v);
  if (esp.id === 'xyz50') return srgb8DesdeXyzD65(mulV(inv3(BRAD_D65_D50), v));
  const lin = v.map((x) => (esp.tf ? esp.tf.dec(x) : x));
  const xyzDestino = mulV(esp.M, lin);              // XYZ en el blanco del formato
  return srgb8DesdeXyzD65(mulV(inv3(esp.adapt), xyzDestino));
}

function xyzDesdeLabD50(lab) {
  const fy = (lab[0] + 16) / 116, fx = fy + lab[1] / 500, fz = fy - lab[2] / 200;
  const f = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) * 27 / 24389);
  return [f(fx) * XYZ_D50_BLANCO[0], f(fy) * XYZ_D50_BLANCO[1], f(fz) * XYZ_D50_BLANCO[2]];
}

function srgb8DesdeYcbcr(esp, v8) {
  const kr = esp.kr, kb = esp.kb, kg = 1 - kr - kb;
  let Y, Cb, Cr;
  if (esp.full) { Y = v8[0] / 255; Cb = (v8[1] - 128) / 255; Cr = (v8[2] - 128) / 255; }
  else { Y = (v8[0] - 16) / 219; Cb = (v8[1] - 128) / 224; Cr = (v8[2] - 128) / 224; }
  const R = Y + 2 * (1 - kr) * Cr, B = Y + 2 * (1 - kb) * Cb, G = (Y - kr * R - kb * B) / kg;
  const lin = [R, G, B].map((x) => esp.tf.dec(clamp01(x)));
  const base = espacio('tmp', '', '', { prim: esp.prim, blanco: D65 });
  return srgb8DesdeXyzD65(mulV(base.M, lin));
}

/* ---------------- estado ---------------- */
let rgb8 = [62, 123, 250];
const $ = (id) => document.getElementById(id);
const fmt = (v, d) => (Number.isFinite(v) ? v.toFixed(d) : '—');

/* ---------------- idioma ----------------
   El español es el idioma original de esta herramienta y sigue escrito en su sitio, aquí
   dentro y en index.html. El inglés vive en color/i18n-en.js, que se carga antes que este
   fichero. Las funciones de abajo eligen uno u otro sin duplicar la matemática. */
const EN = window.MT_COLOR_EN || { espacios: {}, grupos: {}, fichaEtiquetas: {}, origen: { valores: {} }, ui: {} };
const en = () => !!(window.MT_I18N && MT_I18N.lang === 'en');
const T = (clave, es) => (en() && EN.ui[clave] !== undefined ? EN.ui[clave] : es);
const nombreDe = (esp) => (en() && EN.espacios[esp.id] && EN.espacios[esp.id].nombre) || esp.nombre;
const grupoDe = (g) => (en() && EN.grupos[g]) || g;
function fichaDe(esp) {
  const base = esp.ficha || {};
  if (!en()) return base;
  return Object.assign({}, base, (EN.espacios[esp.id] || {}).ficha || {});
}

/* ---------------- original ---------------- */
const ORIGEN_DATOS = [
  ['Espacio', 'sRGB (IEC 61966-2-1)'],
  ['Primarias', 'sRGB y Rec.709: rojo (0,640 · 0,330), verde (0,300 · 0,600), azul (0,150 · 0,060)'],
  ['Blanco', 'D65 (0,3127 · 0,3290)'],
  ['Curva', 'Función sRGB: tramo lineal por debajo de 0,04045 y exponente 2,4 encima, lo que equivale a un <b>gamma ≈ 2,2</b> en los medios tonos'],
  ['Profundidad', '8 bit, 0 a 255'],
  ['Nota', 'El blanco del original solo entra en juego cuando el formato de destino usa otro (D50 en ProPhoto y Lab, D60 en ACES, blanco de cine en DCI-P3): entonces el color se adapta con el método Bradford y los valores se desplazan. Si el destino también es D65, no hay adaptación ninguna.'],
];
const CLAVES_ORIGEN = ['espacio', 'primarias', 'blanco', 'curva', 'profundidad', 'nota'];

function filasOrigen() {
  return ORIGEN_DATOS.map(([nombre, valor], i) => {
    if (!en()) return [nombre, valor];
    const k = CLAVES_ORIGEN[i];
    return [EN.origen[k] || nombre, (EN.origen.valores || {})[k] || valor];
  });
}

function pintarOrigen(origen) {
  const hsl = hslDesdeRgb8(rgb8);
  $('sw-origen').style.backgroundColor = hexDesdeRgb8(...rgb8);
  if (origen !== 'hex') $('hex').value = hexDesdeRgb8(...rgb8).toUpperCase();
  ['r', 'g', 'b'].forEach((k, i) => { if (origen !== k) $(k).value = String(rgb8[i]); });
  if (origen !== 'h') $('h').value = fmt(hsl[0], 1);
  if (origen !== 's') $('s').value = fmt(hsl[1], 1);
  if (origen !== 'l') $('l').value = fmt(hsl[2], 1);
}

/* ---------------- ficha del formato ---------------- */
const ETIQUETAS = [
  ['primarias', 'Primarias'], ['blanco', 'Blanco'], ['curva', 'Curva y gamma'],
  ['uso', 'Uso'], ['profundidad', 'Profundidad'], ['nota', 'Aviso'],
];
const etiquetaFicha = (campo, es) => (en() && EN.fichaEtiquetas[campo] ? EN.fichaEtiquetas[campo] : es);

function pintarFicha(esp) {
  const f = fichaDe(esp);
  $('f-nombre').textContent = nombreDe(esp);
  $('f-grupo').textContent = grupoDe(esp.grupo);
  $('f-texto').textContent = f.texto || '';
  $('f-datos').innerHTML = ETIQUETAS
    .filter(([k]) => f[k])
    .map(([k, nombre]) => `<div${f[k].length > 130 ? ' class="largo"' : ''}><dt>${etiquetaFicha(k, nombre)}</dt><dd>${f[k]}</dd></div>`)
    .join('');
}

/* ---------------- conversión del formato elegido ---------------- */
function formatoSeleccionado() {
  const id = $('perfil').value;
  return ESPACIOS.find((e) => e.id === id) || YCBCR.find((e) => e.id === id);
}

function pintarConversion() {
  const esp = formatoSeleccionado();
  const xyz = xyzDesdeSrgb8(rgb8);
  const salida = $('salida');
  const swatch = $('sw-adaptado');
  const nota = $('nota-adaptado');
  const aviso = $('aviso-gamut');
  const filas = [];
  aviso.hidden = true;

  if (esp.tipo === 'ycbcr') {
    const v = ycbcrDesde(esp, xyz);
    // Y', Cb y Cr van en escala 0-255 (16-235 en legal), no en 0-1
    const vClamp = v.map((x) => Math.min(255, Math.max(0, x)));
    const fuera = v.some((x) => x < -1e-6 || x > 255.001);
    swatch.hidden = true;
    nota.textContent = T('nota.ycbcr', 'Y′, Cb y Cr no son rojo, verde y azul, así que aquí no hay recuadro ni hexadecimal: no habría nada que enseñar en pantalla.');
    filas.push([T('fila.01', '0 a 1'), v.map((x) => fmt(x / 255, 4)).join('   ')]);
    filas.push([T('fila.8', '8 bit'), v.map((x) => Math.round(x)).join('   ') + (fuera ? '   ' + T('recortado', '(recortado)') : '')]);
    filas.push([T('fila.16', '16 bit'), vClamp.map((x) => Math.round(x / 255 * 65535)).join('   ')]);
    aviso.hidden = false;
    aviso.textContent = (esp.full
      ? T('aviso.full', 'Rango full: 0 a 255, sin margen reservado, gris neutro en 128.')
      : T('aviso.legal', 'Rango legal: Y de 16 a 235, Cb y Cr de 16 a 240, gris neutro en 128.')) +
      (fuera ? T('aviso.recortado', ' El color se sale de esos valores, así que los números van recortados.') : '');
  } else if (esp.tipo === 'modelo') {
    swatch.hidden = true;
    nota.textContent = T('nota.modelo', 'Este formato no es un triplete RGB de pantalla, así que no hay recuadro ni enteros de 8 y 16 bit: sus números tienen otra escala y otra unidad.');
    if (esp.id === 'hsl' || esp.id === 'hsv') {
      const v = esp.id === 'hsl' ? hslDesdeRgb8(rgb8) : hsvDesdeRgb8(rgb8);
      const tercero = esp.id === 'hsl' ? 'L' : 'V';
      filas.push(['H', fmt(v[0], 1) + ' °']);
      filas.push(['S', fmt(v[1], 1) + ' %']);
      filas.push([tercero, fmt(v[2], 1) + ' %']);
    } else if (esp.id === 'lab' || esp.id === 'lch') {
      const lab = labDesdeXyz50(mulV(BRAD_D65_D50, xyz));
      if (esp.id === 'lab') {
        filas.push(['L*', fmt(lab[0], 2)]);
        filas.push(['a*', fmt(lab[1], 2)]);
        filas.push(['b*', fmt(lab[2], 2)]);
      } else {
        let h = Math.atan2(lab[2], lab[1]) * 180 / Math.PI;
        if (h < 0) h += 360;
        filas.push(['L*', fmt(lab[0], 2)]);
        filas.push(['C*', fmt(Math.hypot(lab[1], lab[2]), 2)]);
        filas.push(['h°', fmt(h, 1)]);
      }
    } else {
      const v = calcular(esp, xyz).enc;
      filas.push(['X', fmt(v[0], 4)]);
      filas.push(['Y', fmt(v[1], 4)]);
      filas.push(['Z', fmt(v[2], 4)]);
    }
  } else {
    const r = calcular(esp, xyz);
    const enc = r.q;
    const r8 = enc.map((x) => Math.round(x * 255));
    swatch.style.backgroundColor = hexDesdeRgb8(...r8);
    nota.textContent = T('nota.leido', `El recuadro muestra los valores codificados en ${esp.nombre} leídos como si fueran sRGB. Es la referencia para el cuentagotas de pantalla: lo que copias ahí es el valor de 8 bit que ves en la lista.`).replace('{nombre}', nombreDe(esp));
    filas.push([T('fila.01', '0 a 1'), r.enc.map((x) => (Number.isFinite(x) ? fmt(x, 4) : '—')).join('   ')]);
    filas.push([T('fila.8', '8 bit'), r8.join('   ') + (r.fuera ? '   ' + T('recortado', '(recortado)') : '')]);
    filas.push([T('fila.16', '16 bit'), enc.map((x) => Math.round(x * 65535)).join('   ')]);
    filas.push([T('fila.hex', 'hex'), hexDesdeRgb8(...r8).toUpperCase() + (r.fuera ? '   ' + T('recortado', '(recortado)') : '')]);
    if (!esp.codificado) {
      filas.push([T('fila.nota', 'nota'), T('nota.flotante', 'En este formato lo normal es trabajar en flotante: los enteros y el hex son una lectura de los valores, no un archivo habitual.')]);
    }
    if (r.fuera) {
      aviso.hidden = false;
      aviso.innerHTML = T('aviso.gamut', `El color no cabe en el gamut de ${esp.nombre} en ${r.fueraDe}. Los de 0 a 1 conservan el valor real; los enteros, el hex y el recuadro van recortados al color más cercano que ese formato sí puede representar.`)
        .replace('{nombre}', nombreDe(esp)).replace('{canales}', r.fueraDe);
    }
  }

  salida.innerHTML = filas.map(([et, valor]) => {
    const claseMarca = /recortado/.test(valor) ? ' class="recortado"' : '';
    return `<div class="dato"><span class="et">${et}</span><b${claseMarca}>${valor}</b></div>`;
  }).join('');
}

function pintar(origen) {
  pintarOrigen(origen);
  pintarFicha(formatoSeleccionado());
  pintarConversion();
}

/* ---------------- entrada ---------------- */
/* Al pegar suelen venir almohadillas de más (# + contenido, ##fff), espacios,
   comillas de CSS o el prefijo 0x. Se limpia todo antes de interpretar. */
function limpiarHex(txt) {
  return String(txt).replace(/#/g, '').replace(/^\s*0x/i, '').replace(/[\s'";,]/g, '');
}
function leerHex(txt) {
  const s = limpiarHex(txt);
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s)) return null;
  const h = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function leerInt(txt, min, max) {
  const n = Number(txt.trim().replace(',', '.'));
  if (txt.trim() === '' || !Number.isFinite(n)) return null;
  const v = Math.round(n);
  return v < min || v > max ? null : v;
}
function marcar(id, mal) { $(id).classList.toggle('mal', mal); }

$('hex').addEventListener('input', (e) => {
  const bruto = e.target.value;
  const v = leerHex(bruto);
  marcar('hex', !v);
  if (!v) return;
  rgb8 = v;
  // si venía con almohadilla repetida, espacios o minúsculas, se deja canónico
  const canonico = '#' + limpiarHex(bruto).toUpperCase();
  if (bruto !== canonico) e.target.value = canonico;
  pintar('hex');
});
/* Pegar encima del valor existente era el caso que rompía: se intercepta el pegado
   y se limpia el texto del portapapeles antes de aplicarlo. */
$('hex').addEventListener('paste', (e) => {
  const portapapeles = e.clipboardData || window.clipboardData;
  if (!portapapeles) return;
  const v = leerHex(portapapeles.getData('text'));
  if (!v) return;
  e.preventDefault();
  rgb8 = v;
  $('hex').value = hexDesdeRgb8(...v).toUpperCase();
  marcar('hex', false);
  pintar('hex');
});
['r', 'g', 'b'].forEach((k, i) => $(k).addEventListener('input', (e) => {
  const v = leerInt(e.target.value, 0, 255);
  marcar(k, v === null);
  if (v === null) return;
  rgb8[i] = v; pintar(k);
}));
['h', 's', 'l'].forEach((k, i) => $(k).addEventListener('input', (e) => {
  const max = i === 0 ? 360 : 100;
  const v = Number(e.target.value.trim().replace(',', '.'));
  marcar(k, !Number.isFinite(v) || v < 0 || v > max);
  if (!Number.isFinite(v) || v < 0 || v > max) return;
  const hsl = hslDesdeRgb8(rgb8); hsl[i] = v;
  rgb8 = rgb8DesdeHsl(hsl[0], hsl[1], hsl[2]); pintar(k);
}));
$('perfil').addEventListener('change', () => pintar());

/* selector agrupado por familias (se reconstruye al cambiar de idioma) */
function montarSelector() {
  const elegido = $('perfil').value || 'r709';
  const porGrupo = new Map();
  [...ESPACIOS, ...YCBCR].forEach((e) => {
    if (!porGrupo.has(e.grupo)) porGrupo.set(e.grupo, []);
    porGrupo.get(e.grupo).push(e);
  });
  $('perfil').innerHTML = '';
  porGrupo.forEach((lista, grupo) => {
    const og = document.createElement('optgroup');
    og.label = grupoDe(grupo);
    lista.forEach((e) => {
      const o = document.createElement('option');
      o.value = e.id; o.textContent = nombreDe(e);
      og.appendChild(o);
    });
    $('perfil').appendChild(og);
  });
  $('perfil').value = elegido;
}

function pintarDatosOrigen() {
  $('origen-datos').innerHTML = filasOrigen()
    .map(([nombre, valor]) => `<div${valor.length > 130 ? ' class="largo"' : ''}><dt>${nombre}</dt><dd>${valor}</dd></div>`).join('');
}

montarSelector();
$('perfil').value = 'r709';
pintarDatosOrigen();

pintar();

/* Al cambiar de idioma se vuelve a dibujar todo lo que sale de app.js: etiquetas de la
   ficha, opciones del selector, datos del original y la conversión. Los textos fijos de
   index.html los cambia el propio módulo de idioma. */
if (window.MT_I18N) {
  MT_I18N.onChange(() => { montarSelector(); pintarDatosOrigen(); pintar(); });
}

/* Expuesto para las pruebas automáticas */
window.MCL_COLOR = { xyzDesdeSrgb8, calcular, encodar, ESPACIOS, YCBCR, ycbcrDesde, labDesdeXyz50,
  hslDesdeRgb8, hsvDesdeRgb8, rgb8DesdeHsl, hexDesdeRgb8, BRAD_D65_D50, M_SRGB, formatoSeleccionado };
