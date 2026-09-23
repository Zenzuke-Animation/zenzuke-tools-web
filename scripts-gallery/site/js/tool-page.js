/**
 * Página propia de una herramienta (por ejemplo Zen Ease).
 *
 * El HTML llega ya escrito en español desde el generador, para que se pueda
 * indexar sin depender de JavaScript. Este módulo vuelve a pintarlo en el
 * idioma del visitante y engancha el conmutador EN/ES, reutilizando los
 * mismos textos y la misma vista que el listado.
 */
import { CONFIG } from "./config.js";
import { t, formatDate } from "./i18n.js";
import { textosDe, formatInline } from "./ui.js";

const datos = JSON.parse(document.getElementById("tool-data").textContent);
const contenedor = document.getElementById("tool-sections");
const langEsBtn = document.getElementById("btn-lang-es");
const langEnBtn = document.getElementById("btn-lang-en");

const lang = localStorage.getItem(CONFIG.langStorageKey) ||
  (navigator.language.startsWith("es") ? "es" : CONFIG.fallbackLang);

function seccion(titulo, contenido, clase = "") {
  const bloque = document.createElement("div");
  bloque.className = `detail-section ${clase}`.trim();
  bloque.innerHTML = `<h4 class="section-title">${titulo}</h4>${contenido}`;
  return bloque;
}

function versiones() {
  if (!datos.changelog || !datos.changelog.length) return null;
  const items = datos.changelog
    .map((v) => {
      const fecha = v.date ? ` · ${formatDate(v.date, lang)}` : "";
      return `<li><strong>${v.version}</strong>${fecha}<br>${formatInline(v.notes)}</li>`;
    })
    .join("");
  return seccion(t(lang, "label-versions"), `<ul class="changelog-list">${items}</ul>`);
}

function pinta(textos) {
  document.documentElement.lang = textos;
  langEsBtn.classList.toggle("active", textos === "es");
  langEnBtn.classList.toggle("active", textos === "en");

  document.querySelectorAll("[data-i18n]").forEach((nodo) => {
    nodo.textContent = t(textos, nodo.dataset.i18n);
  });

  const fecha = document.getElementById("tool-updated");
  if (fecha) fecha.textContent = formatDate(datos.updated, textos);

  contenedor.innerHTML = "";
  textosDe(datos, textos).forEach((parte) =>
    contenedor.appendChild(seccion(parte.titulo, parte.html, parte.clase))
  );
  const bloqueVersiones = versiones();
  if (bloqueVersiones) contenedor.appendChild(bloqueVersiones);
}

function cambiaIdioma(nuevo) {
  localStorage.setItem(CONFIG.langStorageKey, nuevo);
  pinta(nuevo);
}

langEnBtn.addEventListener("click", () => cambiaIdioma("en"));
langEsBtn.addEventListener("click", () => cambiaIdioma("es"));
pinta(lang);
