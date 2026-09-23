/* Motion Curves Lab — lógica de la app (equivalente exacto al original, sin React). */
(function () {
  "use strict";

  var DURATION = 2;          // segundos por ciclo (M en el original)
  var CANVAS = 450;          // lado del editor de curva
  var TRACK_H = 450;         // alto de la barra
  var TRACK_W = 80;          // ancho de la barra
  var BALL = 60;             // diámetro de la bola
  var FRAME_MS = 30;         // duración de CADA fotograma del GIF, siempre igual (el GIF solo admite múltiplos de 10 ms)
  var GIF_SIZE = 600;        // lienzo del GIF

  var PRESETS = {
    "Ease": "0.25, 0.10, 0.25, 1.00",
    "Linear": "0.00, 0.00, 1.00, 1.00",
    "Ease In": "0.42, 0.00, 1.00, 1.00",
    "Ease Out": "0.00, 0.00, 0.58, 1.00"
  };

  var DEFAULT_THEME = { bg: "#032C3C", curve: "#E8E2DD", accent: "#B83A1D", track: "#FFFFFF", grid: "#E8E2DD" };
  var FIELDS = [
    ["bg", "Background"],
    ["curve", "Curve & Dot"],
    ["accent", "Timeline"],
    ["track", "Track Base"],
    ["grid", "Grid Base"]
  ];

  /* ---------- matemáticas (idénticas al original) ---------- */

  // parsea "x1, y1, x2, y2" -> {x1,y1,x2,y2} | null
  function parseCurve(text) {
    var p = text.split(",").map(function (v) { return parseFloat(v.trim()); });
    if (p.length !== 4 || p.some(isNaN)) return null;
    return { x1: p[0], y1: p[1], x2: p[2], y2: p[3] };
  }

  // bezier cúbica con P0=0 y P3=1
  function bezier(t, p1, p2) {
    return 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3);
  }
  function bezierSlope(t, p1, p2) {
    return 3 * Math.pow(1 - t, 2) * p1 + 6 * (1 - t) * t * (p2 - p1) + 3 * Math.pow(t, 2) * (1 - p2);
  }
  // resuelve x -> t por Newton-Raphson (8 iteraciones)
  function solveT(x, x1, x2) {
    var t = x;
    for (var i = 0; i < 8; i++) {
      var d = bezier(t, x1, x2) - x;
      var s = bezierSlope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t = t - d / s;
    }
    return Math.min(Math.max(t, 0), 1);
  }
  // valor y de la curva para un progreso x
  function curveAt(x, c) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return bezier(solveT(x, c.x1, c.x2), c.y1, c.y2);
  }

  /* ---------- estado ---------- */
  var inputText = "0.75, 0.00, 0.25, 1.00";
  var curve = { x1: 0.75, y1: 0, x2: 0.25, y2: 1 };
  var theme = Object.assign({}, DEFAULT_THEME);
  var exporting = false;
  var startTime = null;
  var rafId = null;

  /* ---------- elementos ---------- */
  var el = {
    stage: document.getElementById("stage"),
    stack: document.querySelector(".stack"),
    controls: document.querySelector(".controls"),
    visual: document.getElementById("visual"),
    row: document.getElementById("row"),
    track: document.getElementById("track"),
    ball: document.getElementById("ball"),
    gridBox: document.getElementById("gridBox"),
    input: document.getElementById("bezierInput"),
    gifBtn: document.getElementById("gifBtn"),
    settingsBtn: document.getElementById("settingsBtn"),
    presets: document.getElementById("presets"),
    panel: document.getElementById("panel"),
    panelBody: document.getElementById("panelBody"),
    closePanel: document.getElementById("closePanel"),
    resetTheme: document.getElementById("resetTheme"),
    curvePath: document.getElementById("curvePath"),
    accentLine: document.getElementById("accentLine"),
    accentDot: document.getElementById("accentDot")
  };
  var vlines = el.gridBox.querySelectorAll(".vline");
  var hlines = el.gridBox.querySelectorAll(".hline");
  var hexInputs = {};

  /* ---------- pintado ---------- */

  function applyTheme() {
    var trackRgba = theme.track + "14";
    var gridRgba = theme.grid + "1A";
    var gridBorderRgba = theme.grid + "33";

    el.stage.style.backgroundColor = theme.bg;
    el.track.style.backgroundColor = trackRgba;
    el.ball.style.backgroundColor = theme.curve;
    el.gridBox.style.borderColor = gridBorderRgba;
    vlines.forEach(function (n) { n.style.borderLeftColor = gridRgba; });
    hlines.forEach(function (n) { n.style.borderTopColor = gridRgba; });
    el.curvePath.setAttribute("stroke", theme.curve);
    el.accentLine.setAttribute("stroke", theme.accent);
    el.accentDot.setAttribute("fill", theme.accent);
    el.input.style.color = theme.curve;

    FIELDS.forEach(function (f) {
      var key = f[0];
      if (!hexInputs[key]) return;
      if (hexInputs[key].input.value !== theme[key]) hexInputs[key].input.value = theme[key];
      hexInputs[key].value.textContent = theme[key];
      hexInputs[key].swatch.style.backgroundColor = theme[key];
    });
  }

  function applyCurve() {
    var p = CANVAS;
    el.curvePath.setAttribute("d",
      "M 0 " + p + " C " + (curve.x1 * p) + " " + (p - curve.y1 * p) + ", " +
      (curve.x2 * p) + " " + (p - curve.y2 * p) + ", " + p + " 0");
  }

  function frame(now) {
    if (startTime === null) startTime = now;
    var progress = ((now - startTime) / 1000) % DURATION / DURATION;
    var y = curveAt(progress, curve);

    el.ball.style.bottom = (y * (TRACK_H - BALL - 20) + 10) + "px";
    var x = progress * CANVAS;
    el.accentLine.setAttribute("x1", x);
    el.accentLine.setAttribute("x2", x);
    el.accentDot.setAttribute("cx", x);
    el.accentDot.setAttribute("cy", CANVAS - y * CANVAS);

    rafId = requestAnimationFrame(frame);
  }

  /* ---------- controles ---------- */

  el.input.addEventListener("input", function () {
    inputText = el.input.value;
    var c = parseCurve(inputText);
    if (c) { curve = c; applyCurve(); }
  });

  Object.keys(PRESETS).forEach(function (name) {
    var b = document.createElement("button");
    b.className = "preset";
    b.textContent = name;
    b.addEventListener("click", function () {
      inputText = PRESETS[name];
      el.input.value = inputText;
      var c = parseCurve(inputText);
      if (c) { curve = c; applyCurve(); }
    });
    el.presets.appendChild(b);
  });

  /* ---------- panel de tema ---------- */

  /* El panel se construye en una función porque sus etiquetas dependen del idioma: al
     cambiar de idioma se vuelve a montar. */
  function montarPanel() {
    hexInputs = {};
    el.panelBody.innerHTML = "";
    FIELDS.forEach(function (f) {
      var key = f[0], label = f[1];
      if (window.MT_I18N) label = MT_I18N.t("theme." + key, label);
      var field = document.createElement("div");
      field.className = "field";
      field.innerHTML =
        '<div class="field-row"><span class="field-label">' + label + '</span>' +
        '<span class="field-value"></span></div>' +
        '<div class="field-inputs"><div class="swatch"></div>' +
        '<input class="hex-input" type="text" maxlength="7" spellcheck="false"></div>';
      var valueEl = field.querySelector(".field-value");
      var swatch = field.querySelector(".swatch");
      var input = field.querySelector(".hex-input");

      input.value = theme[key];
      valueEl.textContent = theme[key];
      swatch.style.backgroundColor = theme[key];

      input.addEventListener("input", function () {
        theme[key] = input.value;
        valueEl.textContent = input.value;
        applyTheme();
      });

      hexInputs[key] = { input: input, swatch: swatch, value: valueEl };
      el.panelBody.appendChild(field);
    });
  }
  montarPanel();
  if (window.MT_I18N) MT_I18N.onChange(montarPanel);

  function openPanel() {
    el.panel.hidden = false;
    el.panel.classList.add("closed");
    void el.panel.offsetWidth;           // fuerza el reflow para animar la entrada
    el.panel.classList.remove("closed");
  }
  function closePanel() {
    el.panel.classList.add("closed");
    setTimeout(function () { el.panel.hidden = true; }, 200);
  }
  el.settingsBtn.addEventListener("click", function () {
    if (el.panel.hidden) openPanel(); else closePanel();
  });
  el.closePanel.addEventListener("click", closePanel);
  el.resetTheme.addEventListener("click", function () {
    theme = Object.assign({}, DEFAULT_THEME);
    applyTheme();
  });

  /* ---------- exportar GIF ---------- */
  // mismos parámetros, mismos trazos y misma secuencia que el original
  var LOADER_ICON =
    '<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>';
  var GIF_ICON = el.gifBtn.innerHTML;

  function exportGif() {
    if (exporting) return;
    exporting = true;
    el.gifBtn.disabled = true;
    el.gifBtn.innerHTML = LOADER_ICON;

    var trackRgba = theme.track + "14";
    var gridRgba = theme.grid + "1A";
    var gridBorderRgba = theme.grid + "33";
    var gif = new GIF({ workers: 2, quality: 5, width: GIF_SIZE, height: GIF_SIZE, workerScript: "vendor/gif.worker.js" });
    var canvas = document.createElement("canvas");
    canvas.width = GIF_SIZE;
    canvas.height = GIF_SIZE;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Todos los fotogramas duran lo mismo (FRAME_MS). El número de fotogramas se calcula
    // para que el ciclo completo dure aproximadamente DURATION: 2000/30 = 66,67 -> 67
    // fotogramas x 30 ms = 2,01 s (10 ms de desvío, 0,5%).
    var total = Math.max(2, Math.round((DURATION * 1000) / FRAME_MS));

    for (var i = 0; i < total; i++) {
      // t recorre el ciclo COMPLETO, de 0 a 1: el último fotograma es el estado final
      var t = total > 1 ? i / (total - 1) : 0;
      var v = curveAt(t, curve);

      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, GIF_SIZE, GIF_SIZE);

      var X = 50, q = 400, ut = 60, ht = 400, x = 50;
      ctx.fillStyle = trackRgba;
      ctx.beginPath();
      ctx.roundRect(X, X + 50, ut, ht, ut / 2);
      ctx.fill();

      var j = X + 50 + ht - (v * (ht - x - 20) + 10 + x);
      ctx.fillStyle = theme.curve;
      ctx.beginPath();
      ctx.arc(X + ut / 2, j + x / 2, x / 2, 0, Math.PI * 2);
      ctx.fill();

      var Z = X + ut + 40, F = X + 50;
      ctx.strokeStyle = gridBorderRgba;
      ctx.strokeRect(Z, F, q, q);
      ctx.lineWidth = 1;
      ctx.strokeStyle = gridRgba;
      [0.25, 0.5, 0.75].forEach(function (s) {
        ctx.beginPath(); ctx.moveTo(Z + s * q, F); ctx.lineTo(Z + s * q, F + q); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(Z, F + s * q); ctx.lineTo(Z + q, F + s * q); ctx.stroke();
      });

      ctx.beginPath();
      ctx.strokeStyle = theme.curve;
      ctx.lineWidth = 4;
      ctx.moveTo(Z, F + q);
      ctx.bezierCurveTo(Z + curve.x1 * q, F + q - curve.y1 * q, Z + curve.x2 * q, F + q - curve.y2 * q, Z + q, F);
      ctx.stroke();

      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Z + t * q, F);
      ctx.lineTo(Z + t * q, F + q);
      ctx.stroke();

      ctx.fillStyle = theme.accent;
      ctx.beginPath();
      ctx.arc(Z + t * q, F + q - v * q, 8, 0, Math.PI * 2);
      ctx.fill();

      // Retardo idéntico en todos los fotogramas: se pasa en milisegundos y gif.js
      // lo guarda en centésimas (Math.round(30/10) = 3), así que no hay redondeos raros.
      gif.addFrame(ctx, { copy: true, delay: FRAME_MS });
    }

    gif.on("finished", function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "motion-curve-" + inputText.replace(/,/g, "-").replace(/\s/g, "") + ".gif";
      a.click();
      exporting = false;
      el.gifBtn.disabled = false;
      el.gifBtn.innerHTML = GIF_ICON;
    });

    gif.render();
  }
  el.gifBtn.addEventListener("click", exportGif);

  /* ---------- encaje en pantalla (móvil) ---------- */
  // En escritorio no hace nada: la composición mide 594x450 y se ve tal cual.
  // En pantallas estrechas la composición entera se escala igual en ancho y alto
  // (nunca se deforma), ocupando todo el ancho disponible. Solo se reduce más si
  // el alto no da (por ejemplo en horizontal).
  var VISUAL_W = TRACK_W + 64 + CANVAS;   // 594
  function fit() {
    var cStage = getComputedStyle(el.stage);
    var padX = parseFloat(cStage.paddingLeft) + parseFloat(cStage.paddingRight);
    var padY = parseFloat(cStage.paddingTop) + parseFloat(cStage.paddingBottom);
    var gap = parseFloat(getComputedStyle(el.stack).rowGap) || 0;

    var availW = document.documentElement.clientWidth - padX;
    var availH = document.documentElement.clientHeight - padY - gap - el.controls.offsetHeight;

    var s = Math.min(1, availW / VISUAL_W, availH / CANVAS);
    if (!isFinite(s) || s <= 0) s = 1;

    if (s >= 1) {
      el.visual.style.width = "";
      el.visual.style.height = "";
      el.row.style.transform = "";
    } else {
      el.visual.style.width = (VISUAL_W * s) + "px";
      el.visual.style.height = (CANVAS * s) + "px";
      el.row.style.transform = "scale(" + s + ")";
    }
  }
  window.addEventListener("resize", function () { requestAnimationFrame(fit); });
  window.addEventListener("orientationchange", function () { requestAnimationFrame(fit); });
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { fit(); }); }

  /* ---------- arranque ---------- */
  applyTheme();
  applyCurve();
  fit();
  rafId = requestAnimationFrame(frame);
})();