/**
 * Vista: construye el HTML del listado y de los filtros. No carga datos
 * ni decide el estado; todo lo que necesita se lo pasan los parámetros.
 */
import { t, hostLabel, hostAbbr, tagLabel, tagClearLabel, formatDate } from "./i18n.js";
import { texto } from "./catalog.js";

const ICONO_DESCARGA = `<svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
</svg>`;

/** Markdown mínimo que sí usan las fichas: **negrita** y `código`. */
export function formatInline(value) {
  return String(value || "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function detailSection(title, innerHtml, customClass = "") {
  const seccion = document.createElement("div");
  seccion.className = `detail-section ${customClass}`.trim();
  seccion.innerHTML = `<h4 class="section-title">${title}</h4>${innerHtml}`;
  return seccion;
}

function listaInstrucciones(instrucciones) {
  const items = String(instrucciones || "")
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean)
    .map((linea) => `<li>${formatInline(linea.replace(/^\d+[.)\s]+/, ""))}</li>`)
    .join("");
  return items ? `<ol class="instructions-list">${items}</ol>` : "";
}

/** Textos de la ficha en el idioma activo, con sus etiquetas traducidas. */
export function textosDe(herramienta, lang) {
  const ficha = texto(herramienta, lang);
  return [
    { titulo: t(lang, "label-description"), html: `<p class="description-text">${formatInline(ficha.description)}</p>` },
    { titulo: t(lang, "label-instructions"), html: listaInstrucciones(ficha.instructions) },
    { titulo: t(lang, "label-timeline"), html: `<p class="creation-text">${formatInline(ficha.timelineCreation)}</p>` },
    { titulo: t(lang, "label-limitations"), html: `<p class="limitations-text">${formatInline(ficha.limitations)}</p>`, clase: "limitations-box" },
    { titulo: t(lang, "label-uses"), html: `<p class="uses-text">${formatInline(ficha.typicalUses)}</p>` },
  ].filter((seccion) => seccion.html);
}

/** Botón de descarga, y enlace a la página propia si la herramienta la tiene. */
function acciones(herramienta, lang) {
  const contenedor = document.createElement("div");
  contenedor.className = "download-container";

  if (herramienta.downloadUrl) {
    const enlace = document.createElement("a");
    enlace.className = "download-btn";
    enlace.href = herramienta.downloadUrl;
    enlace.rel = "noopener";
    enlace.innerHTML = `${ICONO_DESCARGA}<span>${t(lang, "btn-download")}</span>`;
    contenedor.appendChild(enlace);
  }

  if (herramienta.page) {
    const mas = document.createElement("a");
    mas.className = "tool-page-link";
    mas.href = herramienta.page;
    mas.textContent = t(lang, "btn-more");
    contenedor.appendChild(mas);
  }

  return contenedor;
}

function acordeon(herramienta, lang, isActive) {
  const ficha = texto(herramienta, lang);
  const item = document.createElement("div");
  item.className = `accordion-item${isActive ? " active" : ""}`;
  item.id = `item-${herramienta.id}`;
  // El CSS colorea el acento a partir del programa
  item.setAttribute("data-category", (herramienta.hosts || [])[0] || "After Effects");
  item.setAttribute("data-status", herramienta.status || "active");

  const sufijoHost = { "After Effects": "ae", Illustrator: "ai", Cavalry: "cav" };
  // El programa va abreviado (Ae, Ai, Cav) para no llenar la cabecera del desplegable;
  // el nombre completo queda en el title, al pasar el ratón.
  const badges = [
    ...(herramienta.hosts || []).map(
      (host) =>
        `<span class="script-category-badge badge-${sufijoHost[host] || "sub"}" ` +
        `title="${host}">${hostAbbr(host)}</span>`
    ),
    ...(herramienta.tags || []).map(
      (tag) => `<span class="script-category-badge badge-sub">${tagLabel(lang, tag)}</span>`
    ),
  ].join(" ");

  const retirada =
    herramienta.status === "deprecated"
      ? `<span class="script-category-badge badge-retired">${t(lang, "badge-deprecated")}</span>`
      : "";

  const cabecera = document.createElement("button");
  cabecera.type = "button";
  cabecera.className = "accordion-header";
  cabecera.setAttribute("aria-expanded", isActive ? "true" : "false");
  cabecera.setAttribute("aria-controls", `content-${herramienta.id}`);
  cabecera.innerHTML = `
    <span class="script-title">
      ${ficha.name}
      <span class="script-version">v${herramienta.version}</span>
    </span>
    <div class="accordion-header-right">
      ${badges}
      ${retirada}
      <span class="accordion-icon">&#x25BC;</span>
    </div>`;

  const cuerpo = document.createElement("div");
  cuerpo.className = "accordion-body";
  textosDe(herramienta, lang).forEach((seccion) =>
    cuerpo.appendChild(detailSection(seccion.titulo, seccion.html, seccion.clase))
  );
  cuerpo.appendChild(acciones(herramienta, lang));

  const contenido = document.createElement("div");
  contenido.className = `accordion-content${isActive ? " open" : ""}`;
  contenido.id = `content-${herramienta.id}`;
  const interior = document.createElement("div");
  interior.className = "accordion-inner";
  interior.appendChild(cuerpo);
  contenido.appendChild(interior);

  item.append(cabecera, contenido);
  return item;
}

/** Pinta el listado completo. Devuelve los elementos creados. */
export function renderList(container, tools, { lang, activeId }) {
  container.innerHTML = "";
  const items = tools.map((herramienta) => acordeon(herramienta, lang, herramienta.id === activeId));
  items.forEach((item) => container.appendChild(item));
  return items;
}

/** Abre el elemento indicado y cierra cualquier otro. */
export function setOpenItem(container, id, { scrollDelayMs = 200 } = {}) {
  container.querySelectorAll(".accordion-item").forEach((item) => {
    const abierto = item.id === `item-${id}`;
    item.classList.toggle("active", abierto);
    item.querySelector(".accordion-content")?.classList.toggle("open", abierto);
    item.querySelector(".accordion-header")?.setAttribute("aria-expanded", abierto ? "true" : "false");
  });

  if (!id) return;
  const activo = container.querySelector(`#item-${id}`);
  if (activo) {
    setTimeout(() => activo.scrollIntoView({ behavior: "smooth", block: "nearest" }), scrollDelayMs);
  }
}

/** Fila de pestañas: programas. */
export function renderHosts(container, hosts, { lang, host }, onSelect) {
  container.innerHTML = ["All", ...hosts]
    .map((clave) => {
      const activa = clave === host;
      return `<button class="tab-btn${activa ? " active" : ""}" type="button" data-host="${clave}"
        role="tab" aria-selected="${activa}">${hostLabel(lang, clave)}</button>`;
    })
    .join("");

  container.querySelectorAll(".tab-btn").forEach((boton) => {
    boton.addEventListener("click", () => onSelect(boton.dataset.host));
  });
}

/**
 * Fila de chips: funciones. Se pueden elegir varias a la vez y se combinan con «y»
 * (sale lo que tiene TODAS las funciones marcadas). El primer chip limpia la selección.
 */
export function renderTags(container, tags, { lang, selected = [] }, onToggle, onClear) {
  const ninguna = selected.length === 0;

  const chips = [
    `<button class="tag-chip tag-chip--clear${ninguna ? " active" : ""}" type="button"
      data-tag="" aria-pressed="${ninguna}">${tagClearLabel(lang)}</button>`,
    ...tags.map((tag) => {
      const activo = selected.includes(tag);
      return `<button class="tag-chip${activo ? " active" : ""}" type="button" data-tag="${tag}"
        aria-pressed="${activo}">${tagLabel(lang, tag)}</button>`;
    }),
  ].join("");

  container.innerHTML = chips;
  container.setAttribute("aria-label", t(lang, "label-tag"));

  container.querySelectorAll(".tag-chip").forEach((boton) => {
    boton.addEventListener("click", () => {
      const tag = boton.dataset.tag;
      if (tag) onToggle(tag);
      else onClear();
    });
  });
}

/** Botón de «ver herramientas retiradas». */
export function renderDeprecatedToggle(boton, { lang, count, visible }) {
  if (!count) {
    boton.hidden = true;
    return;
  }
  boton.hidden = false;
  boton.textContent = visible
    ? t(lang, "hide-deprecated")
    : t(lang, "show-deprecated", { count });
  boton.setAttribute("aria-pressed", String(visible));
}

/** Traduce la interfaz y marca el idioma activo. */
export function applyTranslations(lang, refs) {
  document.documentElement.lang = lang;
  refs.langEsBtn.classList.toggle("active", lang === "es");
  refs.langEnBtn.classList.toggle("active", lang === "en");

  document.querySelectorAll("[data-i18n]").forEach((nodo) => {
    nodo.textContent = t(lang, nodo.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((nodo) => {
    nodo.placeholder = t(lang, nodo.dataset.i18nPlaceholder);
  });
}

/** Fecha de última actualización, calculada a partir del catálogo. */
export function setLastUpdate(iso, lang) {
  const nodo = document.getElementById("last-update");
  if (nodo) nodo.textContent = t(lang, "last-update", { date: formatDate(iso, lang) });
}

export function showError(message, lang) {
  const caja = document.getElementById("error-message");
  const textoError = document.getElementById("error-text");
  if (!caja || !textoError) return;
  textoError.textContent = t(lang, "error-text", { message });
  caja.style.display = "flex";
}
