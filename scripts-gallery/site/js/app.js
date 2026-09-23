/**
 * Arranque: estado, eventos y unión entre catálogo (datos), interfaz (vista)
 * y textos. Es el único módulo que conoce el DOM completo.
 */
import { CONFIG } from "./config.js";
import { t } from "./i18n.js";
import { loadCatalog, filtrar, opciones, contarRetiradas } from "./catalog.js";
import {
  applyTranslations,
  renderList,
  renderHosts,
  renderTags,
  renderDeprecatedToggle,
  setLastUpdate,
  setOpenItem,
  showError,
} from "./ui.js";

const state = {
  lang: localStorage.getItem(CONFIG.langStorageKey) ||
    (navigator.language.startsWith("es") ? "es" : CONFIG.fallbackLang),
  host: "All",      // programa elegido: After Effects, Illustrator, Cavalry (uno)
  tags: [],         // funciones elegidas: Rigging, Timeline… (varias a la vez)
  catalogoHosts: [], // programas que existen en el catálogo (no es lo elegido)
  catalogoTags: [],  // funciones que existen en el catálogo (no es lo elegido)
  query: "",
  activeId: null,
  showDeprecated: false,
  updated: null,
  hosts: [],
  tags: [],
  tools: [],
};

const el = {
  loading: document.getElementById("loading-indicator"),
  noResults: document.getElementById("no-results"),
  accordion: document.getElementById("accordion-container"),
  searchInput: document.getElementById("search-input"),
  searchClearBtn: document.getElementById("search-clear-btn"),
  hostTabs: document.getElementById("host-tabs"),
  tagChips: document.getElementById("tag-chips"),
  deprecatedToggle: document.getElementById("toggle-deprecated"),
  langEnBtn: document.getElementById("btn-lang-en"),
  langEsBtn: document.getElementById("btn-lang-es"),
};

function pinta() {
  const visibles = filtrar(state.tools, {
    host: state.host,
    tags: state.tags,
    query: state.query,
    lang: state.lang,
    showDeprecated: state.showDeprecated,
  });

  // Las opciones de los filtros salen del catálogo entero, nunca del resultado filtrado
  const disponibles = opciones(state.tools, { hosts: state.catalogoHosts, tags: state.catalogoTags }, {
    showDeprecated: state.showDeprecated,
  });

  renderHosts(el.hostTabs, disponibles.hosts, { lang: state.lang, host: state.host }, cambiaHost);
  renderTags(
    el.tagChips,
    disponibles.tags,
    { lang: state.lang, selected: state.tags },
    alternaTag,
    limpiaTags
  );

  // El aviso dice el motivo real: filtros, búsqueda o las dos cosas
  const hayFiltros = state.tags.length > 0 || state.host !== "All";
  if (state.query && hayFiltros) {
    el.noResults.textContent = t(state.lang, "no-results-both", { query: state.query });
  } else if (hayFiltros) {
    el.noResults.textContent = t(state.lang, "no-results-filters");
  } else {
    el.noResults.textContent = t(state.lang, "no-results-text");
  }
  el.noResults.style.display = visibles.length ? "none" : "block";
  el.accordion.style.display = visibles.length ? "flex" : "none";
  renderList(el.accordion, visibles, { lang: state.lang, activeId: state.activeId });
  enlazaAcordeones();
  renderDeprecatedToggle(el.deprecatedToggle, {
    lang: state.lang,
    count: contarRetiradas(state.tools),
    visible: state.showDeprecated,
  });
  setLastUpdate(state.updated, state.lang);
}

function enlazaAcordeones() {
  el.accordion.querySelectorAll(".accordion-item").forEach((item) => {
    const id = item.id.replace("item-", "");
    item.querySelector(".accordion-header")?.addEventListener("click", () => abreAcordeon(id));
  });
}

function abreAcordeon(id) {
  state.activeId = state.activeId === id ? null : id;
  setOpenItem(el.accordion, state.activeId, { scrollDelayMs: CONFIG.scrollDelayMs });
}

function cambiaHost(host) {
  state.host = host;
  state.activeId = null;
  pinta();
}

function alternaTag(tag) {
  state.tags = state.tags.includes(tag)
    ? state.tags.filter((t) => t !== tag)
    : [...state.tags, tag];
  state.activeId = null;
  pinta();
}

function limpiaTags() {
  state.tags = [];
  state.activeId = null;
  pinta();
}

function cambiaIdioma(lang) {
  if (state.lang === lang) return;
  state.lang = lang;
  localStorage.setItem(CONFIG.langStorageKey, lang);
  applyTranslations(lang, el);
  pinta();
}

async function arranca() {
  applyTranslations(state.lang, el);

  el.langEnBtn.addEventListener("click", () => cambiaIdioma("en"));
  el.langEsBtn.addEventListener("click", () => cambiaIdioma("es"));

  el.searchInput.addEventListener("input", (evento) => {
    state.query = evento.target.value;
    state.activeId = null;
    el.searchClearBtn.style.display = state.query ? "block" : "none";
    pinta();
  });

  el.searchClearBtn.addEventListener("click", () => {
    el.searchInput.value = "";
    state.query = "";
    state.activeId = null;
    el.searchClearBtn.style.display = "none";
    el.searchInput.focus();
    pinta();
  });

  el.deprecatedToggle.addEventListener("click", () => {
    state.showDeprecated = !state.showDeprecated;
    if (!state.showDeprecated) state.activeId = null;
    pinta();
  });

  try {
    const datos = await loadCatalog(CONFIG.catalogUrl);
    state.tools = datos.tools;
    state.catalogoHosts = datos.hosts || [];
    state.catalogoTags = datos.tags || [];
    state.updated = datos.updated;
    el.loading.style.display = "none";
    pinta();
  } catch (error) {
    console.error("No se ha podido cargar el catálogo:", error);
    el.loading.style.display = "none";
    showError(error.message, state.lang);
  }
}

document.addEventListener("DOMContentLoaded", arranca);
