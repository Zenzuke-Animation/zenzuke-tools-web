/* Módulo de idioma del hub de herramientas de motion.
 *
 * Reglas (decididas con Carlos, 17-09-2026):
 *   - Dos idiomas: español (es) e inglés (en).
 *   - El idioma se elige así, por este orden: ?lang= de la URL → lo guardado en este
 *     navegador → el idioma del navegador → inglés si no es ninguno de los dos.
 *   - La elección se guarda en localStorage, y como las tres páginas viven en el mismo
 *     origen, vale para todas: si eliges inglés en el hub, las herramientas ya salen en inglés.
 *
 * Cada página trae sus textos en un diccionario {es:{clave:'...'}, en:{clave:'...'}}, y el
 * idioma que no es el original de la herramienta vive en un fichero i18n aparte.
 */
(function () {
  'use strict';

  var KEY = 'mt-lang';
  var LANGS = ['es', 'en'];
  var FALLBACK = 'en';                 // idioma por defecto si el navegador no es es ni en

  var dict = { es: {}, en: {} };
  var listeners = [];
  var storedOriginals = new WeakSet();

  /* Los textos de la propia cabecera viven aquí, junto al módulo que la construye, para que
     cualquier página que lo cargue los tenga ya traducidos. */
  Object.assign(dict.es, { 'chrome.back': 'Herramientas', 'chrome.backAria': 'Volver al índice de herramientas' });
  Object.assign(dict.en, { 'chrome.back': 'Tools', 'chrome.backAria': 'Back to the tools index' });

  function normaliza(valor) {
    var v = String(valor || '').toLowerCase();
    if (v.indexOf('es') === 0) return 'es';
    if (v.indexOf('en') === 0) return 'en';
    return null;
  }
  function deUrl() {
    var m = /[?&]lang=(es|en|ES|EN)\b/.exec(location.search);
    return m ? normaliza(m[1]) : null;
  }
  function deMemoria() {
    try { return normaliza(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function delNavegador() {
    var lista = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < lista.length; i++) {
      var v = normaliza(lista[i]);
      if (v) return v;
    }
    return FALLBACK;
  }

  var lang = deUrl() || deMemoria() || delNavegador();

  function guarda(l) {
    try { localStorage.setItem(KEY, l); } catch (e) { /* navegación privada: se ignora */ }
  }

  function t(clave, porDefecto) {
    var actual = dict[lang] && dict[lang][clave];
    if (typeof actual === 'string') return actual;
    var base = dict[lang === 'es' ? 'en' : 'es'] && dict[lang === 'es' ? 'en' : 'es'][clave];
    if (typeof base === 'string' && typeof porDefecto === 'undefined') return base;
    return typeof porDefecto === 'string' ? porDefecto : (typeof base === 'string' ? base : clave);
  }

  /* Recuerda el texto original de cada nodo la primera vez, para poder volver a él
     si una clave no está traducida en el idioma elegido. */
  function original(nodo, attr, actual) {
    var marca = 'mtBase' + attr;
    if (!storedOriginals.has(nodo)) {
      storedOriginals.add(nodo);
      if (!(marca in nodo.dataset)) nodo.dataset[marca] = actual;
    }
    return nodo.dataset[marca];
  }

  function aplica(raiz) {
    var cont = raiz || document;

    cont.querySelectorAll('[data-i18n]').forEach(function (n) {
      var base = original(n, 'Texto', n.textContent);
      n.textContent = t(n.dataset.i18n, base);
    });
    cont.querySelectorAll('[data-i18n-html]').forEach(function (n) {
      var base = original(n, 'Html', n.innerHTML);
      n.innerHTML = t(n.dataset.i18nHtml, base);
    });
    cont.querySelectorAll('[data-i18n-title]').forEach(function (n) {
      var base = original(n, 'Title', n.getAttribute('title') || '');
      n.setAttribute('title', t(n.dataset.i18nTitle, base));
    });
    cont.querySelectorAll('[data-i18n-aria]').forEach(function (n) {
      var base = original(n, 'Aria', n.getAttribute('aria-label') || '');
      n.setAttribute('aria-label', t(n.dataset.i18nAria, base));
    });
    cont.querySelectorAll('[data-i18n-placeholder]').forEach(function (n) {
      var base = original(n, 'Placeholder', n.getAttribute('placeholder') || '');
      n.setAttribute('placeholder', t(n.dataset.i18nPlaceholder, base));
    });

    document.documentElement.lang = lang;
    document.querySelectorAll('[data-mt-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.mtLang === lang ? 'true' : 'false');
    });
  }

  function set(nuevo) {
    var l = normaliza(nuevo) || FALLBACK;
    if (l === lang) { aplica(); return l; }
    lang = l;
    guarda(l);
    aplica();
    listeners.forEach(function (fn) { try { fn(l); } catch (e) {} });
    document.dispatchEvent(new CustomEvent('mt:lang', { detail: { lang: l } }));
    return l;
  }

  /* Cabecera común: vuelta al índice del hub y selector ES/EN. */
  function montaCabecera(opciones) {
    var o = opciones || {};
    if (document.querySelector('.mt-chrome')) return;
    var caja = document.createElement('div');
    caja.className = 'mt-chrome';

    var izquierda = '';
    if (o.back !== false) {
      izquierda = '<a class="mt-back" href="../"><span class="mt-arrow" aria-hidden="true">&larr;</span>' +
        '<span data-i18n="chrome.back" data-i18n-aria="chrome.backAria">Herramientas</span></a>';
    }

    caja.innerHTML = izquierda +
      '<div class="mt-lang" role="group">' +
        '<button type="button" data-mt-lang="es" aria-pressed="false">ES</button>' +
        '<span class="mt-sep" aria-hidden="true">/</span>' +
        '<button type="button" data-mt-lang="en" aria-pressed="false">EN</button>' +
      '</div>';

    caja.querySelectorAll('[data-mt-lang]').forEach(function (b) {
      b.addEventListener('click', function () { set(b.dataset.mtLang); });
    });

    document.body.insertBefore(caja, document.body.firstChild);
    aplica(caja);
  }

  window.MT_I18N = {
    get lang() { return lang; },
    langs: LANGS.slice(),
    dict: function (obj) {
      LANGS.forEach(function (l) {
        if (obj && obj[l]) Object.assign(dict[l], obj[l]);
      });
      return dict;
    },
    t: t,
    set: set,
    apply: aplica,
    mountChrome: montaCabecera,
    onChange: function (fn) { if (typeof fn === 'function') listeners.push(fn); },
  };
})();
