/* Explorador de tamaños y ratios — matemática, sin DOM.
 *
 * Este fichero se carga igual desde el navegador (deja `MT_SIZES_CALC` en window) y desde
 * Node (module.exports), para que las pruebas puedan recorrer la tabla de casos sin navegador.
 *
 * Reglas (decididas con Carlos, 17-09-2026):
 *   - El original es el ancla: no cambia nunca y el 100 % de escala se refiere a él.
 *   - La escala es de dos ejes por dentro (X e Y). Mientras coinciden, la interfaz enseña una
 *     sola cifra; en cuanto dejan de coincidir, se parte en dos.
 *   - Un candado clava su valor, siempre. Ningún control bloqueado cambia nunca de valor.
 *   - Lo que se edita se aplica primero. Si un candado lo pisa, sale un aviso explicando qué
 *     se ha respetado y qué no.
 *   - Orden al clavar los valores: ancho, alto, escala, y el ratio al final. El ratio va el
 *     último a propósito, porque no clava un eje concreto: lo que hace es ajustar el eje que
 *     queda libre para que la proporción se mantenga. Puesto al final nunca pelea con los
 *     demás candados, solo recoge lo que dejan.
 *   - Los píxeles son enteros. Si el redondeo desvía el ratio más de un 0,1 %, se avisa.
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.MT_SIZES_CALC = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DESVIO_MAX = 0.001;      // 0,1 % de desviación de ratio que se tolera sin avisar
  var TOPE_PAR = 250;          // máximo en cada lado de un ratio reducido exacto
  var TOPE_APROX = 16;         // máximo al buscar un par aproximado a mano (denominador)
  var TOPE_APROX_NUM = 40;     // y en el numerador
  var TOL_PAR = 0.003;         // 0,3 % para reconocer una proporción con nombre
  var TOL_APROX = 0.005;       // 0,5 % para un par aproximado sin nombre

  /* Proporciones con nombre propio. Son las que un animador reconoce de un vistazo: si el
     tamaño actual se parece a una de ellas, se enseña su nombre en vez de un par raro
     (1920×823 es 21:9, no 7:3). */
  var CONOCIDAS = [
    [1, 1], [5, 4], [4, 3], [3, 2], [16, 10], [5, 3], [16, 9], [2, 1],
    [21, 9], [37, 20], [47, 20], [239, 100], [69, 25],
    [1, 2], [9, 21], [2, 3], [3, 4], [4, 5], [10, 16], [9, 16],
  ];

  function mcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a || 1;
  }

  function enteroPositivo(v) {
    var n = Number(v);
    if (!isFinite(n)) return 1;
    return Math.max(1, Math.round(n));
  }

  function etiquetaConocida(a, b) {
    // «2.39:1» para pares que nadie escribe como 239:100.
    if (a > 40 || b > 40) {
      var r = a / b;
      return (Math.round(r * 100) % 1 === 0 ? (r).toFixed(2) : r.toFixed(3)) + ':1';
    }
    return null;
  }

  /* Ratio en dos números. Siempre devuelve uno, porque cualquier tamaño entero tiene su par
     exacto. Cuatro intentos, por orden:
     1. el par reducido exacto, si sus números son manejables (1920×1080 -> 16:9);
     2. una proporción conocida que se le parezca (1920×823 -> 21:9, 1920×802 -> 2.39:1);
     3. un par aproximado pequeño, que se lee mejor que uno de tres cifras;
     4. el par reducido exacto aunque sus números sean grandes (1920×1214 -> 960:607).
     Nunca se devuelve «nada»: dejar los campos en blanco parecía un error. */
  function parRatio(ancho, alto) {
    var w = enteroPositivo(ancho), h = enteroPositivo(alto);
    var d = mcd(w, h);
    var a = w / d, b = h / d;
    if (a <= TOPE_PAR && b <= TOPE_PAR) return { par: [a, b], exacto: true, etiqueta: etiquetaConocida(a, b) };

    var r = w / h;

    for (var i = 0; i < CONOCIDAS.length; i++) {
      var p = CONOCIDAS[i][0], q = CONOCIDAS[i][1];
      if (Math.abs(r - p / q) / r <= TOL_PAR) {
        return { par: [p, q], exacto: false, etiqueta: etiquetaConocida(p, q) };
      }
    }

    // Se busca el par MÁS CORTO que quepa en la tolerancia, no el más preciso: 19:8 se lee
    // mejor que 31:13, y el ≈ ya avisa de que es una aproximación.
    for (var q2 = 1; q2 <= TOPE_APROX; q2++) {
      var p2 = Math.round(r * q2);
      if (p2 < 1 || p2 > TOPE_APROX_NUM) continue;
      if (Math.abs(r - p2 / q2) / r <= TOL_APROX) return { par: [p2, q2], exacto: false, etiqueta: null };
    }

    return { par: [a, b], exacto: true, etiqueta: etiquetaConocida(a, b) };
  }

  /* Estado completo a partir del original y del tamaño actual. */
  function estado(ow, oh, w, h, extra) {
    ow = enteroPositivo(ow); oh = enteroPositivo(oh);
    w = enteroPositivo(w); h = enteroPositivo(h);
    var par = parRatio(w, h);
    return Object.assign({
      origen: { ancho: ow, alto: oh },
      ancho: w,
      alto: h,
      ratio: w / h,
      escalaX: w / ow * 100,
      escalaY: h / oh * 100,
      // Uniforme se decide con enteros, que es exacto: (w/ow) == (h/oh)  <=>  w·oh == h·ow
      uniforme: w * oh === h * ow,
      par: par ? par.par : null,
      parExacto: par ? par.exacto : false,
      parEtiqueta: par ? par.etiqueta : null,
      megapixeles: w * h / 1e6,
      pedido: null,
    }, extra || {});
  }

  function estadoInicial(ow, oh) {
    return estado(ow, oh, ow, oh);
  }

  /* Aplica un cambio respetando los candados.
     cambio: { campo: 'ancho'|'alto'|'ratio'|'ratioPar'|'escalaX'|'escalaY', valor }
       'ratio'     -> valor es el ratio decimal (1.7778)
       'ratioPar'  -> valor es [a, b]
     candados: { ancho, alto, ratio, escalaX, escalaY } (booleanos) — solo los bloqueos.
     clavados: { ratio: {valor, par, etiqueta, exacto}, escalaX: {valor}, escalaY: {valor} } — el
       valor que clava cada candado, que es el que tenía cuando se cerró. Va en un objeto aparte
       a propósito: mezclarlo con los booleanos hacía que `candados['ratioPar']` (el par
       guardado) pareciera un bloqueo activo y los atajos de proporción no hicieran nada.
     Devuelve { estado, avisos }. Los avisos son claves; los textos los pone la interfaz. */
  function aplicar(est, cambio, candados, clavados) {
    candados = candados || {};
    clavados = clavados || {};
    var c = cambio || {};
    var avisos = [];

    if (!c.campo) return { estado: est, avisos: avisos };
    // Un control bloqueado no se puede editar. La interfaz no deja teclear en él, pero si
    // algo se saltara esa protección, aquí no se hace nada. El par de proporción es la misma
    // cosa que la proporción, así que comparte su candado.
    var candadoDelCampo = { ancho: 'ancho', alto: 'alto', ratio: 'ratio', ratioPar: 'ratio',
                            escalaX: 'escalaX', escalaY: 'escalaY' }[c.campo];
    if (candadoDelCampo && candados[candadoDelCampo]) {
      return { estado: est, avisos: [{ clave: 'bloqueado', campo: candadoDelCampo }] };
    }

    var ow = est.origen.ancho, oh = est.origen.alto;
    var w = est.ancho, h = est.alto;
    var ratioPedido = null;                 // ratio exacto que se ha pedido, para medir el redondeo

    /* 1) La edición manda. */
    switch (c.campo) {
      case 'ancho':
        w = enteroPositivo(c.valor);
        break;
      case 'alto':
        h = enteroPositivo(c.valor);
        break;
      case 'ratio':
      case 'ratioPar': {
        var R = c.campo === 'ratio' ? Number(c.valor) : (Number(c.valor[0]) / Number(c.valor[1]));
        if (!isFinite(R) || R <= 0) return { estado: est, avisos: [{ clave: 'ratioInvalido' }] };
        ratioPedido = R;
        // Se conserva el ancho (el eje de referencia) salvo que el alto esté clavado.
        if (candados.alto) w = enteroPositivo(h * R);
        else h = enteroPositivo(w / R);
        break;
      }
      case 'escalaX': {
        var sx = Number(c.valor);
        if (!isFinite(sx) || sx <= 0) return { estado: est, avisos: [{ clave: 'escalaInvalida' }] };
        w = enteroPositivo(ow * sx / 100);
        // Con la imagen uniforme, una sola cifra de escala mueve los dos ejes.
        if (est.uniforme) h = enteroPositivo(oh * sx / 100);
        break;
      }
      case 'escalaY': {
        var sy = Number(c.valor);
        if (!isFinite(sy) || sy <= 0) return { estado: est, avisos: [{ clave: 'escalaInvalida' }] };
        h = enteroPositivo(oh * sy / 100);
        if (est.uniforme) w = enteroPositivo(ow * sy / 100);
        break;
      }
      default:
        return { estado: est, avisos: avisos };
    }

    var pedidoAncho = w, pedidoAlto = h;   // lo que se quería, antes de los candados

    /* 2) Los candados clavan su valor: ancho, alto, escala y el ratio al final.
          El valor que clava un candado es el que tenía cuando se cerró (lo guarda la interfaz
          en `clavados`). Eso importa mientras se escribe: si el candado leyera el estado
          actual, los valores intermedios de tecleo (3, 38, 384) irían corrompiendo la
          proporción clavada. Si no viene valor, se usa el actual. */
    var R0 = clavados.ratio && Number(clavados.ratio.valor) > 0 ? Number(clavados.ratio.valor) : est.ancho / est.alto;
    var sxClavada = clavados.escalaX && Number(clavados.escalaX.valor) > 0 ? Number(clavados.escalaX.valor) : est.escalaX;
    var syClavada = clavados.escalaY && Number(clavados.escalaY.valor) > 0 ? Number(clavados.escalaY.valor) : est.escalaY;

    if (candados.ancho && w !== est.ancho) { w = est.ancho; avisos.push({ clave: 'candadoAncho' }); }
    if (candados.alto && h !== est.alto) { h = est.alto; avisos.push({ clave: 'candadoAlto' }); }
    var trasEjes = { ancho: w, alto: h };

    if (candados.escalaX) {
      var w0 = enteroPositivo(ow * sxClavada / 100);
      if (w !== w0) { w = w0; avisos.push({ clave: 'candadoEscala' }); }
    }
    if (candados.escalaY) {
      var h0 = enteroPositivo(oh * syClavada / 100);
      if (h !== h0) { h = h0; avisos.push({ clave: 'candadoEscala' }); }
    }

    if (candados.ratio) {
      var anchoLibre = !candados.ancho && !(candados.escalaX && w === enteroPositivo(ow * sxClavada / 100));
      var altoLibre = !candados.alto && !(candados.escalaY && h === enteroPositivo(oh * syClavada / 100));
      // Se ajusta el eje que queda libre y que el usuario no acaba de editar. Puesto el
      // candado del ratio al final, esto nunca pelea con los demás: solo recoge lo que dejan.
      if (altoLibre && c.campo !== 'alto') h = enteroPositivo(w / R0);
      else if (anchoLibre) w = enteroPositivo(h * R0);
      else if (altoLibre) h = enteroPositivo(w / R0);
      ratioPedido = R0;
    }

    /* 3) ¿Ha sobrevivido lo que el usuario había pedido? Si un candado lo ha pisado, se dice.
          En un tamaño solo se mira el eje editado: que el ratio clavado ajuste el otro eje es
          justo lo que se le ha pedido que haga, y no es un aviso. */
    if ((c.campo === 'ancho' && w !== pedidoAncho) || (c.campo === 'alto' && h !== pedidoAlto)) {
      avisos.push({ clave: 'descartado', campo: c.campo });
    }
    if ((c.campo === 'ratio' || c.campo === 'ratioPar' || c.campo === 'escalaX' || c.campo === 'escalaY') &&
        (w !== pedidoAncho || h !== pedidoAlto) &&
        !(candados.ratio && (trasEjes.ancho !== w || trasEjes.alto !== h))) {
      avisos.push({ clave: 'descartado', campo: c.campo });
    }

    var nuevo = estado(ow, oh, w, h, { pedido: ratioPedido });

    /* 4) Aviso de redondeo: los píxeles son enteros, así que el ratio real puede no ser el
          que se ha pedido. Solo tiene sentido si el cambio llegó a aplicarse: si un candado
          lo descartó, la diferencia la explica el candado, no el redondeo. */
    var descartado = avisos.some(function (a) { return a.clave === 'descartado'; });
    if (ratioPedido && ratioPedido > 0 && !descartado) {
      var desvio = Math.abs(nuevo.ratio - ratioPedido) / ratioPedido;
      if (desvio > DESVIO_MAX) avisos.push({ clave: 'redondeo', desvio: desvio, pedido: ratioPedido });
    }

    return { estado: nuevo, avisos: sinRepetir(avisos) };
  }

  function sinRepetir(avisos) {
    var vistos = {}, salida = [];
    avisos.forEach(function (a) {
      var firma = a.clave + (a.campo || '');
      if (vistos[firma]) return;
      vistos[firma] = true;
      salida.push(a);
    });
    return salida;
  }

  /* Utilidades de formato. El separador decimal es cosa del idioma: la coma en español. */
  function conDecimales(v, decimales, separador) {
    if (!isFinite(v)) return '—';
    var s = Number(v).toFixed(decimales);
    return separador === ',' ? s.replace('.', ',') : s;
  }

  /* Píxeles totales con separador de millares, en el idioma que toque. */
  function pixeles(v, idioma) {
    var s = String(Math.round(v));
    var miles = idioma === 'es' ? '.' : ',';
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, miles);
  }

  return {
    DESVIO_MAX: DESVIO_MAX,
    mcd: mcd,
    parRatio: parRatio,
    estado: estado,
    estadoInicial: estadoInicial,
    aplicar: aplicar,
    conDecimales: conDecimales,
    pixeles: pixeles,
  };
});