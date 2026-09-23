/* Explorador de tamaños y ratios — interfaz.
 *
 * La matemática vive en calc.js y no sabe nada del DOM. Aquí solo se lee lo que se teclea,
 * se pide el reparto a calc.js y se pinta el resultado. Las reglas de los candados están
 * explicadas en calc.js.
 */
'use strict';

(function () {
  var C = window.MT_SIZES_CALC;
  var $ = function (id) { return document.getElementById(id); };

  function t(clave, porDefecto) {
    return window.MT_I18N ? MT_I18N.t(clave, porDefecto) : porDefecto;
  }
  function idioma() { return window.MT_I18N ? MT_I18N.lang : 'es'; }
  function dec(v, decimales) { return C.conDecimales(v, decimales, idioma() === 'es' ? ',' : '.'); }

  /* ---------------- estado ---------------- */

  var original = { ancho: 1920, alto: 1080 };
  var candados = { ancho: false, alto: false, ratio: false, escalaX: false, escalaY: false };
  // El valor que clava cada candado, que es el que tenía cuando se cerró. Va aparte de los
  // booleanos: si se mezclan, el par de proporción guardado parece un bloqueo y los campos
  // de la proporción y los atajos se quedan muertos.
  var clavados = { ratio: null, escalaX: null, escalaY: null };
  var est = C.estadoInicial(original.ancho, original.alto);
  var avisos = [];
  var imagen = null;          // imagen propia que suelte el usuario
  var urlImagen = null;
  var temporizadorCopiado = null;

  var ATAJOS = [
    { clave: 'original' },
    { par: [1, 1] }, { par: [4, 3] }, { par: [3, 2] }, { par: [16, 10] },
    { par: [16, 9] }, { par: [21, 9] }, { par: [239, 100], etiqueta: '2.39:1' }, { par: [9, 16] },
  ];

  /* ---------------- lectura de los campos ---------------- */

  function leerEntero(txt) {
    var s = String(txt).trim().replace(/\s/g, '').replace(/[.,](\d{3})(?=\D|$)/g, '').replace(',', '.');
    if (s === '') return null;
    var n = Number(s);
    if (!isFinite(n) || n <= 0) return null;
    return Math.round(n);
  }
  function leerDecimal(txt) {
    var s = String(txt).trim().replace(/\s/g, '').replace(',', '.');
    if (s === '') return null;
    var n = Number(s);
    if (!isFinite(n) || n <= 0) return null;
    return n;
  }
  function marcar(id, mal) {
    var el = $(id);
    if (el) el.classList.toggle('mal', !!mal);
  }

  /* ---------------- pintado ---------------- */

  function factorTexto(escala) {
    var f = escala / 100;
    if (Math.abs(f - Math.round(f)) < 1e-9) return '×' + Math.round(f);
    // Sin ceros de relleno: ×0,5 y no ×0,500.
    var s = f.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    return '×' + (idioma() === 'es' ? s.replace('.', ',') : s);
  }

  function pintar(origen) {
    if (origen !== 'ancho') $('ancho').value = String(est.ancho);
    if (origen !== 'alto') $('alto').value = String(est.alto);

    var par = est.par;
    var etiqueta = est.parEtiqueta;
    var exacto = est.parExacto;
    var decimal = est.ratio;
    // Con la proporción bloqueada se enseña la proporción clavada, no la momentánea: mientras
    // se teclea, los valores intermedios dan proporciones que no son las que están clavadas.
    if (candados.ratio && clavados.ratio && Number(clavados.ratio.valor) > 0) {
      par = clavados.ratio.par || null;
      etiqueta = clavados.ratio.etiqueta || null;
      exacto = clavados.ratio.exacto !== false;
      decimal = Number(clavados.ratio.valor);
    }
    var parTexto = par ? (etiqueta || par.join(':')) : null;

    if (origen !== 'ratio-a' && origen !== 'ratio-b') {
      if (par) {
        if (etiqueta && etiqueta.indexOf(':1') > 0) {
          // «2.39:1» se enseña como 2.39 y 1, que es exactamente su proporción.
          $('ratio-a').value = etiqueta.split(':')[0];
          $('ratio-b').value = etiqueta.split(':')[1];
        } else {
          $('ratio-a').value = String(par[0]);
          $('ratio-b').value = String(par[1]);
        }
      } else {
        $('ratio-a').value = '—';
        $('ratio-b').value = '—';
      }
    }
    if (origen !== 'ratio-dec') $('ratio-dec').value = dec(decimal, 3);

    var unico = est.uniforme && candados.escalaX === candados.escalaY;
    if (origen !== 'escala-x') $('escala-x').value = dec(est.escalaX, 2);
    $('factor-x').textContent = factorTexto(est.escalaX);
    if (origen !== 'escala-y') $('escala-y').value = dec(est.escalaY, 2);
    $('factor-y').textContent = factorTexto(est.escalaY);

    // Una sola fila de escala mientras los dos ejes coincidan y sus candados vayan a la par.
    $('fila-escala-y').hidden = unico;
    $('rotulo-escala-unico').hidden = !unico;
    $('rotulo-escala-eje').hidden = unico;
    $('rotulo-escala-y').textContent = t('rotulo.escalaY', 'Escala Y');

    // Candados: el campo bloqueado es de solo lectura. El nombre del candado sale de la
    // etiqueta visible de su fila, para que esté en el idioma que toque sin duplicar textos.
    [['candado-ancho', 'ancho'], ['candado-alto', 'alto'], ['candado-ratio', 'ratio'],
     ['candado-escala-x', 'escalaX'], ['candado-escala-y', 'escalaY']].forEach(function (fila) {
      var bloqueado = candados[fila[1]];
      var boton = $(fila[0]);
      var rotuloEl = boton.closest('.control').querySelector('.rotulo span:not([hidden])') ||
                     boton.closest('.control').querySelector('.rotulo');
      var rotulo = rotuloEl.textContent.trim();
      boton.setAttribute('aria-pressed', bloqueado ? 'true' : 'false');
      boton.setAttribute('aria-label', t(bloqueado ? 'aria.abrirCandado' : 'aria.cerrarCandado',
        bloqueado ? 'Abrir candado' : 'Cerrar candado') + ' · ' + rotulo);
    });
    $('ancho').readOnly = candados.ancho;
    $('alto').readOnly = candados.alto;
    $('ratio-a').readOnly = candados.ratio || !par;
    $('ratio-b').readOnly = candados.ratio || !par;
    $('ratio-dec').readOnly = candados.ratio;
    $('escala-x').readOnly = candados.escalaX;
    $('escala-y').readOnly = candados.escalaY;
    $('ratio-a').title = par ? '' : t('nota.sinPar', 'Este tamaño no tiene una proporción de dos números sencilla.');
    $('ratio-b').title = $('ratio-a').title;
    // El par solo es exacto cuando sale de reducir el tamaño. Si es una aproximación
    // reconocible (1920×823 -> 21:9), se marca con ≈ para no hacer creer que es exacta.
    var aprox = $('ratio-aprox');
    aprox.hidden = !par || exacto;
    aprox.title = t('nota.aprox', 'Proporción aproximada: la exacta es {exacta}.')
      .replace('{exacta}', dec(decimal, 3));

    // Datos: el original arriba (con su proporción, que no cambia) y la transformación abajo.
    var parOrig = C.parRatio(original.ancho, original.alto);
    var parOrigTexto = parOrig ? (parOrig.etiqueta || parOrig.par.join(':')) + (parOrig.exacto ? '' : '≈') : '';
    var px = C.pixeles(est.ancho * est.alto, idioma());
    $('origen-datos').innerHTML =
      '<span>' + t('dato.original', 'Original') + '</span> <b>' + original.ancho + '×' + original.alto + '</b>' +
      (parOrigTexto ? ' · <b>' + parOrigTexto + '</b>' : '') +
      '<br><span>' + t('dato.ahora', 'Ahora') + '</span> <b>' + est.ancho + '×' + est.alto + '</b>' +
      (parTexto ? ' · <b>' + parTexto + (exacto ? '' : '≈') + '</b>' : '') +
      ' · ' + px + ' px · ' + dec(est.megapixeles, 2) + ' MP';

    $('nota-uniforme').hidden = est.uniforme;
    $('aviso').textContent = avisos.length ? avisos.map(textoAviso).join(' ') : '';

    // Los paneles de presets: se cierran si su campo queda bloqueado y marcan el valor actual.
    Object.keys(paneles).forEach(function (id) {
      var f = paneles[id];
      if ($(id).readOnly) f.cerrar();
      f.rotular();
      f.marcar();
    });

    dibujar();
    montarAtajos();
  }

  function textoAviso(a) {
    switch (a.clave) {
      case 'candadoAncho': return t('aviso.candadoAncho', 'El ancho está bloqueado: se ha respetado.');
      case 'candadoAlto': return t('aviso.candadoAlto', 'El alto está bloqueado: se ha respetado.');
      case 'candadoEscala': return t('aviso.candadoEscala', 'La escala está bloqueada: el tamaño lo fija ella.');
      case 'descartado': return t('aviso.descartado', 'Un candado ha impedido aplicar el cambio. Abre el candado que estorba si quieres ese valor.');
      case 'bloqueado': return t('aviso.bloqueado', 'Ese control está bloqueado.');
      case 'noEsMedia': return t('aviso.noEsMedia', 'Ese archivo no es una imagen ni un vídeo.');
      case 'sinTamano': return t('aviso.sinTamano', 'No se ha podido leer el tamaño de ese archivo.');
      case 'redondeo': return t('aviso.redondeo',
        'Los píxeles son enteros: la proporción queda en {real} en vez de {pedido}, un {desvio} % de desvío.')
        .replace('{real}', dec(est.ratio, 3)).replace('{pedido}', dec(a.pedido, 3))
        .replace('{desvio}', dec(a.desvio * 100, 2));
      default: return '';
    }
  }

  function montarAtajos() {
    var caja = $('atajos');
    if (caja.childElementCount === 0) {
      ATAJOS.forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.dataset.atajo = a.clave || a.etiqueta || a.par.join(':');
        caja.appendChild(b);
      });
    }
    Array.prototype.forEach.call(caja.children, function (b, i) {
      var a = ATAJOS[i];
      var texto = a.clave === 'original' ? t('atajo.original', 'Original') : (a.etiqueta || a.par.join(':'));
      if (b.textContent !== texto) b.textContent = texto;
      b.setAttribute('aria-label', t('aria.atajo', 'Poner la proporción') + ' ' + texto);
    });
  }

  /* ---------------- previsualización ---------------- */

  function encajar(ratio, caja) {
    var w = caja.w, h = w / ratio;
    if (h > caja.h) { h = caja.h; w = h * ratio; }
    return { x: caja.x + (caja.w - w) / 2, y: caja.y + (caja.h - h) / 2, w: w, h: h };
  }

  function patron(ctx, r) {
    var linea = Math.max(42, Math.min(r.w, r.h) / 8);
    ctx.save();
    ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
    ctx.fillStyle = '#101014';
    ctx.fillRect(r.x, r.y, r.w, r.h);

    ctx.strokeStyle = '#232328';
    ctx.lineWidth = 1;
    for (var x = r.x + linea; x < r.x + r.w; x += linea) {
      ctx.beginPath(); ctx.moveTo(Math.round(x) + .5, r.y); ctx.lineTo(Math.round(x) + .5, r.y + r.h); ctx.stroke();
    }
    for (var y = r.y + linea; y < r.y + r.h; y += linea) {
      ctx.beginPath(); ctx.moveTo(r.x, Math.round(y) + .5); ctx.lineTo(r.x + r.w, Math.round(y) + .5); ctx.stroke();
    }

    // Círculo centrado: es lo que enseña el estirado de un vistazo, porque se vuelve elipse.
    var radio = Math.min(r.w, r.h) * 0.28;
    ctx.strokeStyle = '#6d6d75';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(r.x + r.w / 2, r.y + r.h / 2, radio, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r.x + r.w / 2 - radio, r.y + r.h / 2);
    ctx.lineTo(r.x + r.w / 2 + radio, r.y + r.h / 2);
    ctx.moveTo(r.x + r.w / 2, r.y + r.h / 2 - radio);
    ctx.lineTo(r.x + r.w / 2, r.y + r.h / 2 + radio);
    ctx.stroke();

    // Marcas en las esquinas.
    var m = Math.min(28, Math.min(r.w, r.h) * 0.12);
    ctx.strokeStyle = '#8b8b93';
    ctx.lineWidth = 2;
    [[r.x, r.y, 1, 1], [r.x + r.w, r.y, -1, 1], [r.x, r.y + r.h, 1, -1], [r.x + r.w, r.y + r.h, -1, -1]]
      .forEach(function (c) {
        ctx.beginPath();
        ctx.moveTo(c[0] + c[2] * m, c[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.lineTo(c[0], c[1] + c[3] * m);
        ctx.stroke();
      });
    ctx.restore();
  }

  function dibujar() {
    var lienzo = $('lienzo');
    var cv = $('patron');
    var caja = lienzo.getBoundingClientRect();
    if (caja.width < 2 || caja.height < 2) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(caja.width * dpr);
    cv.height = Math.round(caja.height * dpr);
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, caja.width, caja.height);
    ctx.fillStyle = '#07070a';
    ctx.fillRect(0, 0, caja.width, caja.height);

    var marco = { x: 0, y: 0, w: caja.width, h: caja.height };
    var nuevo = encajar(est.ratio, marco);
    var referencia = encajar(original.ancho / original.alto, marco);

    // El contenido se dibuja estirado a la proporción actual, que es lo que se está mirando.
    if (imagen) {
      ctx.save();
      ctx.beginPath(); ctx.rect(nuevo.x, nuevo.y, nuevo.w, nuevo.h); ctx.clip();
      ctx.drawImage(imagen, nuevo.x, nuevo.y, nuevo.w, nuevo.h);
      ctx.restore();
    } else {
      patron(ctx, nuevo);
    }

    // Marco discontinuo: la proporción del original. Marco continuo: la actual.
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = '#4a4a55';
    ctx.lineWidth = 1;
    ctx.strokeRect(referencia.x + .5, referencia.y + .5, referencia.w - 1, referencia.h - 1);
    ctx.restore();
    ctx.strokeStyle = est.uniforme ? '#3a3a42' : '#e0a458';
    ctx.lineWidth = 1;
    ctx.strokeRect(nuevo.x + .5, nuevo.y + .5, nuevo.w - 1, nuevo.h - 1);
  }

  /* ---------------- cambios ---------------- */

  function cambia(cambio, campoEditado, silencioso) {
    var r = C.aplicar(est, cambio, candados, clavados);
    est = r.estado;
    // Mientras se teclea no se avisa de nada: los valores intermedios (3, 38, 384) son
    // normales y llenarían la pantalla de avisos. Los avisos salen al confirmar el campo.
    avisos = silencioso ? [] : r.avisos;
    pintar(campoEditado);
  }

  /* Un campo se aplica en vivo mientras se escribe (para que se vea cómo se adapta el resto),
     pero los avisos y el valor canónico salen al confirmar, con Enter o al salir del campo. */
  function engancharCampo(id, leer, construirCambio) {
    $(id).addEventListener('input', function (e) {
      var v = leer(e.target.value);
      if (v === null) return;                  // vacío o inválido: no se toca nada
      cambia(construirCambio(v, id), id, true);
    });
    $(id).addEventListener('change', function (e) {
      var v = leer(e.target.value);
      marcar(id, v === null && String(e.target.value).trim() !== '');
      if (v === null) { avisos = []; pintar(id); return; }
      cambia(construirCambio(v, id), null, false);
    });
    $(id).addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
    });
  }

  engancharCampo('ancho', leerEntero, function (v) { return { campo: 'ancho', valor: v }; });
  engancharCampo('alto', leerEntero, function (v) { return { campo: 'alto', valor: v }; });

  function leerPar(marcarCampos) {
    // Con decimal (no entero) porque el par puede salir con decimales cuando su etiqueta es del
    // estilo 0.71:1, y redondearlo al teclearlo cambiaría la proporción sin avisar.
    var a = leerDecimal($('ratio-a').value), b = leerDecimal($('ratio-b').value);
    var mal = a === null || b === null;
    if (marcarCampos) { marcar('ratio-a', mal); marcar('ratio-b', mal); }
    return mal ? null : [a, b];
  }
  ['ratio-a', 'ratio-b'].forEach(function (id) {
    $(id).addEventListener('input', function () {
      var par = leerPar(false);
      if (!par) return;
      cambia({ campo: 'ratioPar', valor: par }, id, true);
    });
    $(id).addEventListener('change', function () {
      var par = leerPar(true);
      if (!par) { avisos = []; pintar(id); return; }
      cambia({ campo: 'ratioPar', valor: par }, null, false);
    });
    $(id).addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
    });
  });

  engancharCampo('ratio-dec', leerDecimal, function (v) { return { campo: 'ratio', valor: v }; });
  engancharCampo('escala-x', leerDecimal, function (v) { return { campo: 'escalaX', valor: v }; });
  engancharCampo('escala-y', leerDecimal, function (v) { return { campo: 'escalaY', valor: v }; });

  /* ---------------- presets de resolución ----------------
     Sobre los cuatro campos de resolución (ancho y alto de la transformación, ancho y alto del
     original) aparece un panel con los valores comunes. Se abre al pasar el ratón, al hacer clic
     y al llegar con el teclado, y aguanta mientras el puntero esté sobre el campo o sobre el
     panel: eso es lo que permite llegar a pulsar un valor. Elegir un preset hace exactamente lo
     mismo que escribirlo, porque pasa por los mismos manejadores, así que los candados se siguen
     respetando. En un campo bloqueado el panel no se abre, porque el campo es de solo lectura. */
  var PRESETS_RES = [128, 256, 512, 640, 720, 800, 1024, 2048, 3840, 4096, 4320, 8192];
  var paneles = {};

  function usaPreset(id, valor) {
    var campo = $(id);
    campo.value = String(valor);
    if (id === 'origen-ancho' || id === 'origen-alto') { aplicarOriginal(); return; }
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    campo.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function montaPresets(id) {
    var campo = $(id);
    var caja = campo.closest('.campo-res');
    if (!caja) return;

    var panel = document.createElement('div');
    panel.className = 'presets';
    panel.hidden = true;
    panel.setAttribute('role', 'group');
    PRESETS_RES.forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(v);
      b.dataset.valor = String(v);
      b.tabIndex = -1;          // se llega con el ratón; el tabulador se queda en el campo
      panel.appendChild(b);
    });
    caja.appendChild(panel);

    var ratonEncima = false;
    var ficha = {
      panel: panel,
      abrir: function () { if (!campo.readOnly) panel.hidden = false; ficha.marcar(); },
      cerrar: function () { panel.hidden = true; },
      rotular: function () { panel.setAttribute('aria-label', t('presets.titulo', 'Valores comunes')); },
      marcar: function () {
        var actual = String(campo.value).trim();
        Array.prototype.forEach.call(panel.children, function (b) {
          b.classList.toggle('marcado', b.dataset.valor === actual);
        });
      },
    };
    paneles[id] = ficha;
    ficha.rotular();

    campo.addEventListener('mouseenter', function () { ratonEncima = true; ficha.abrir(); });
    caja.addEventListener('mouseleave', function () {
      ratonEncima = false;
      if (document.activeElement !== campo) ficha.cerrar();
    });
    campo.addEventListener('focus', ficha.abrir);
    campo.addEventListener('blur', function () { if (!ratonEncima) ficha.cerrar(); });
    campo.addEventListener('keydown', function (e) { if (e.key === 'Escape') ficha.cerrar(); });
    panel.addEventListener('mousedown', function (e) { e.preventDefault(); });  // no robar el foco
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      usaPreset(id, Number(b.dataset.valor));
      ficha.cerrar();
    });
  }

  ['ancho', 'alto', 'origen-ancho', 'origen-alto'].forEach(montaPresets);

  /* Candados. Al cerrar uno se guarda el valor que clava en ese momento; ese es el valor que
     se respeta a partir de ahí, aunque el estado siga cambiando mientras se escribe. */
  function clavado(campo) {
    if (campo === 'ratio') {
      // Se guarda también cómo se enseña esa proporción (par, nombre y si es exacta), para que
      // el campo bloqueado muestre el valor clavado y no el momentáneo del tecleo.
      clavados.ratio = {
        valor: est.ratio,
        par: est.par ? est.par.slice() : null,
        etiqueta: est.parEtiqueta || null,
        exacto: est.parExacto,
      };
    }
    if (campo === 'escalaX') clavados.escalaX = { valor: est.escalaX };
    if (campo === 'escalaY') clavados.escalaY = { valor: est.escalaY };
  }

  Array.prototype.forEach.call(document.querySelectorAll('.candado'), function (b) {
    b.addEventListener('click', function () {
      var campo = b.dataset.candado;
      var nuevo = !candados[campo];
      candados[campo] = nuevo;
      if (nuevo) {
        clavado(campo);
        // Mientras la escala es una sola cifra, su candado vale para los dos ejes.
        if ((campo === 'escalaX' || campo === 'escalaY') && est.uniforme) {
          candados.escalaX = true; candados.escalaY = true;
          clavados.escalaX = { valor: est.escalaX };
          clavados.escalaY = { valor: est.escalaY };
        }
      }
      avisos = [];
      pintar();
    });
  });

  $('atajos').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var i = Array.prototype.indexOf.call($('atajos').children, b);
    var a = ATAJOS[i];
    if (!a) return;
    var par = a.clave === 'original' ? [original.ancho, original.alto] : a.par;
    cambia({ campo: 'ratioPar', valor: par }, null);
  });

  $('reset').addEventListener('click', function () {
    est = C.estadoInicial(original.ancho, original.alto);
    avisos = [];
    pintar();
  });

  $('copiar').addEventListener('click', function () {
    var parTexto = est.par ? (est.parEtiqueta || est.par.join(':')) + (est.parExacto ? '' : '≈') : '';
    var linea = [
      est.ancho + '×' + est.alto,
      parTexto,
      dec(est.ratio, 3),
      dec(est.escalaX, 2) + '%' + (est.uniforme ? ' (' + factorTexto(est.escalaX) + ')' : ' X / ' + dec(est.escalaY, 2) + '% Y'),
      C.pixeles(est.ancho * est.alto, idioma()) + ' px · ' + dec(est.megapixeles, 2) + ' MP',
    ].filter(Boolean).join(' · ');
    copiar(linea);
  });

  function copiar(texto) {
    var listo = function () {
      var b = $('copiar');
      b.textContent = t('boton.copiado', 'Copiado');
      clearTimeout(temporizadorCopiado);
      temporizadorCopiado = setTimeout(function () {
        b.textContent = t('boton.copiar', 'Copiar');
      }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(listo, function () { copiarAntiguo(texto, listo); });
    } else {
      copiarAntiguo(texto, listo);
    }
  }
  function copiarAntiguo(texto, listo) {
    var area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); listo(); } catch (e) { /* nada que hacer */ }
    document.body.removeChild(area);
  }

  /* ---------------- tamaño original ---------------- */

  function aplicarOriginal() {
    var a = leerEntero($('origen-ancho').value), b = leerEntero($('origen-alto').value);
    marcar('origen-ancho', a === null); marcar('origen-alto', b === null);
    if (a === null || b === null) return;
    if (a === original.ancho && b === original.alto) return;
    fijaOriginal(a, b);
  }
  $('aplicar-origen').addEventListener('click', aplicarOriginal);
  ['origen-ancho', 'origen-alto'].forEach(function (id) {
    $(id).addEventListener('change', aplicarOriginal);
    $(id).addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); aplicarOriginal(); $(id).blur(); }
    });
  });

  /* ---------------- imagen o vídeo propios ----------------
     Al soltar un archivo se toma SU TAMAÑO como nuevo original, que es lo que se espera al
     arrastrar algo: el ancla pasa a ser ese archivo. Con los vídeos se lee además un fotograma
     para la previsualización (si el formato lo permite; si no, el tamaño se coge igual). */

  function tipoDe(fichero) {
    var t = (fichero.type || '').toLowerCase();
    if (t.indexOf('image/') === 0) return 'imagen';
    if (t.indexOf('video/') === 0) return 'video';
    // Algunos arrastres desde el explorador no traen tipo: se mira la extensión.
    var n = (fichero.name || '').toLowerCase();
    if (/\.(png|jpe?g|webp|gif|bmp|avif|tiff?)$/.test(n)) return 'imagen';
    if (/\.(mp4|m4v|mov|webm|mkv|avi|wmv|flv|mpe?g|mts|m2ts|3gp)$/.test(n)) return 'video';
    return null;
  }

  function fijaOriginal(ancho, alto) {
    var a = Math.max(1, Math.round(ancho)), b = Math.max(1, Math.round(alto));
    if (!a || !b) return false;
    original = { ancho: a, alto: b };
    $('origen-ancho').value = String(a);
    $('origen-alto').value = String(b);
    // El original es el ancla: la transformación vuelve al 100 %.
    est = C.estadoInicial(a, b);
    avisos = [];
    pintar();
    return true;
  }

  function sueltaUrl() {
    if (urlImagen) URL.revokeObjectURL(urlImagen);
    urlImagen = null;
  }

  function cargaImagen(fichero) {
    sueltaUrl();
    urlImagen = URL.createObjectURL(fichero);
    var img = new Image();
    img.onload = function () {
      imagen = img;
      if (!fijaOriginal(img.naturalWidth, img.naturalHeight)) return;
      dibujar();
    };
    img.onerror = function () { avisos = [{ clave: 'sinTamano' }]; pintar(); };
    img.src = urlImagen;
  }

  function cargaVideo(fichero) {
    sueltaUrl();
    urlImagen = URL.createObjectURL(fichero);
    var v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.onloadedmetadata = function () {
      if (!fijaOriginal(v.videoWidth, v.videoHeight)) {
        avisos = [{ clave: 'sinTamano' }];
        pintar();
        return;
      }
      // Un fotograma para verlo en la previsualización. Si el formato no deja buscar, se queda
      // el patrón de prueba y el tamaño ya está cogido, que es lo importante.
      v.onseeked = function () { imagen = v; dibujar(); };
      v.onloadeddata = function () { imagen = v; dibujar(); };
      try { v.currentTime = Math.min(0.1, (v.duration || 0.2) / 2); } catch (e) { /* nada */ }
    };
    v.onerror = function () { avisos = [{ clave: 'sinTamano' }]; pintar(); };
    v.src = urlImagen;
  }

  function recibeFichero(fichero) {
    if (!fichero) return;
    var tipo = tipoDe(fichero);
    if (!tipo) { avisos = [{ clave: 'noEsMedia' }]; pintar(); return; }
    if (tipo === 'video') cargaVideo(fichero); else cargaImagen(fichero);
  }

  var lienzo = $('lienzo');
  ['dragenter', 'dragover'].forEach(function (ev) {
    lienzo.addEventListener(ev, function (e) {
      e.preventDefault();
      lienzo.classList.add('arrastrando');
    });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    lienzo.addEventListener(ev, function (e) {
      e.preventDefault();
      lienzo.classList.remove('arrastrando');
    });
  });
  lienzo.addEventListener('drop', function (e) {
    var dt = e.dataTransfer;
    if (!dt) return;
    var fichero = dt.files && dt.files[0];
    if (!fichero && dt.items && dt.items.length) {
      var it = dt.items[0];
      if (it.kind === 'file') fichero = it.getAsFile();
    }
    recibeFichero(fichero);
  });
  // Además del arrastre, se puede elegir el archivo con un clic: arrastrar no siempre funciona
  // igual en todos los sistemas, y con los vídeos es donde más falla.
  lienzo.addEventListener('click', function () { $('fichero').click(); });
  $('fichero').addEventListener('change', function (e) {
    recibeFichero(e.target.files && e.target.files[0]);
    e.target.value = '';
  });

  /* ---------------- arranque ---------------- */

  window.addEventListener('resize', function () { requestAnimationFrame(dibujar); });
  if (window.MT_I18N) {
    MT_I18N.onChange(function () { pintar(); });
  }
  pintar();

  /* Expuesto para las comprobaciones en el navegador */
  window.MT_SIZES = {
    estado: function () { return est; },
    candados: function () { return candados; },
    clavados: function () { return clavados; },
    original: function () { return original; },
    avisos: function () { return avisos; },
    aplicar: function (cambio, cand) { var r = C.aplicar(est, cambio, cand || candados, clavados); est = r.estado; avisos = r.avisos; pintar(); return r; },
    pintar: pintar,
  };
})();