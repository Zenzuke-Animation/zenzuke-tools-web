/**
 * Textos de la interfaz. Un objeto por idioma, con las mismas claves.
 * Las etiquetas de programas y funciones viven aparte: son datos del catálogo.
 */
export const STRINGS = {
  en: {
    "app-title": "Motion scripts & tools",
    "last-update": "Last update {date}",
    "search-placeholder": "Search tools...",
    "label-host": "Software",
    "label-tag": "Function",
    "loading-text": "Loading tools catalog...",
    "no-results-text": "No tools match your search.",
    "no-results-filters": "No tool matches those filters combined. Try removing one.",
    "no-results-both": "No tool matches “{query}” with those filters.",
    "error-text": "Error loading the catalog: {message}",
    "label-description": "What it does",
    "label-instructions": "How to use it",
    "label-timeline": "What it creates",
    "label-limitations": "Limitations & compatibility",
    "label-uses": "Typical uses",
    "btn-download": "Download",
    "btn-more": "Details & install guide",
    "back": "← Back to the list",
    "label-versions": "Versions",
    "badge-deprecated": "retired",
    "show-deprecated": "Show retired tools ({count})",
    "hide-deprecated": "Hide retired tools",
  },
  es: {
    "app-title": "Scripts y herramientas para motion design",
    "last-update": "Última actualización {date}",
    "search-placeholder": "Buscar herramientas...",
    "label-host": "Programa",
    "label-tag": "Función",
    "loading-text": "Cargando el catálogo...",
    "no-results-text": "Ninguna herramienta coincide con tu búsqueda.",
    "no-results-filters": "Ninguna herramienta combina los filtros elegidos. Quita alguno.",
    "no-results-both": "Ninguna herramienta coincide con «{query}» y esos filtros.",
    "error-text": "Error al cargar el catálogo: {message}",
    "label-description": "Qué hace",
    "label-instructions": "Cómo se usa",
    "label-timeline": "Qué crea",
    "label-limitations": "Limitaciones y compatibilidad",
    "label-uses": "Usos típicos",
    "btn-download": "Descargar",
    "btn-more": "Más info e instalación",
    "back": "← Volver al listado",
    "label-versions": "Versiones",
    "badge-deprecated": "retirada",
    "show-deprecated": "Ver herramientas retiradas ({count})",
    "hide-deprecated": "Ocultar herramientas retiradas",
  },
};

/** Programas: el nombre es el mismo en los dos idiomas. */
export const HOST_LABELS = {
  "After Effects": { en: "After Effects", es: "After Effects" },
  Illustrator: { en: "Illustrator", es: "Illustrator" },
  Cavalry: { en: "Cavalry", es: "Cavalry" },
};

/** Abreviatura de cada programa, para las etiquetas del listado (ocupan poco). */
export const HOST_ABBR = {
  "After Effects": "Ae",
  Illustrator: "Ai",
  Cavalry: "Cav",
};

/** Funciones: aquí sí conviene traducir. */
export const TAG_LABELS = {
  Rigging: { en: "Rigging", es: "Rigging" },
  Timeline: { en: "Timeline", es: "Timeline" },
  Utility: { en: "Utility", es: "Utilidades" },
  Extension: { en: "Extension", es: "Extensión" },
  Expressions: { en: "Expressions", es: "Expresiones" },
  Render: { en: "Render", es: "Render" },
};

/** Devuelve un texto de interfaz, con {marcadores} sustituidos si se pasan. */
export function t(lang, key, vars = {}) {
  const idioma = STRINGS[lang] || STRINGS.en;
  const texto = idioma[key] ?? STRINGS.en[key] ?? key;
  return texto.replace(/\{(\w+)\}/g, (_, nombre) =>
    Object.prototype.hasOwnProperty.call(vars, nombre) ? vars[nombre] : ""
  );
}

/** Nombre visible de un programa («All» incluido) en el idioma activo. */
export function hostLabel(lang, host) {
  if (host === "All") return lang === "es" ? "Todos" : "All";
  return HOST_LABELS[host]?.[lang] || host;
}

/** Abreviatura de un programa: Ae, Ai, Cav. */
export function hostAbbr(host) {
  return HOST_ABBR[host] || host;
}

/** Nombre visible del chip que limpia la selección de funciones. */
export function tagClearLabel(lang) {
  return lang === "es" ? "Todas" : "All";
}

/** Nombre visible de una función en el idioma activo. */
export function tagLabel(lang, tag) {
  return TAG_LABELS[tag]?.[lang] || tag;
}

/** 2026-06-03 → 03-06-2026 (formato que ya usaba la web). */
export function formatDate(iso, lang = "en") {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!partes) return String(iso || "");
  const [, anio, mes, dia] = partes;
  const separador = lang === "en" ? "-" : "/";
  return [dia, mes, anio].join(separador);
}