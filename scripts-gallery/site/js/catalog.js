/**
 * Catálogo: cargar el JSON y filtrarlo. Aquí no se toca el DOM.
 *
 * Cada herramienta lleva dos ejes de etiquetas: `hosts` (programa: After
 * Effects, Illustrator, Cavalry) y `tags` (función: Rigging, Timeline…).
 */

/** Carga scripts.json y devuelve {updated, hosts, tags, tools}. */
export async function loadCatalog(url) {
  const respuesta = await fetch(url, { cache: "no-cache" });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  if (!datos || !Array.isArray(datos.tools)) {
    throw new Error("scripts.json no tiene la forma esperada");
  }
  return datos;
}

/** Campos de la ficha de un idioma donde se busca texto libre. */
const CAMPOS_BUSCABLES = [
  "name",
  "description",
  "instructions",
  "timelineCreation",
  "limitations",
  "typicalUses",
];

/** Texto de una herramienta en el idioma activo, con el inglés como respaldo. */
export function texto(herramienta, lang) {
  return herramienta[lang] || herramienta.en;
}

function estaRetirada(herramienta) {
  return herramienta.status === "deprecated";
}

function coincideTexto(herramienta, buscado, lang) {
  const ficha = texto(herramienta, lang);
  return CAMPOS_BUSCABLES.some((campo) =>
    String(ficha[campo] || "").toLocaleLowerCase().includes(buscado)
  );
}

/**
 * Aplica programa, funciones, búsqueda y visibilidad de retiradas.
 * Los tags se combinan con «y»: solo salen las herramientas que tienen TODAS
 * las funciones seleccionadas. El orden de `tools` (el catálogo) se respeta.
 */
export function filtrar(
  tools,
  { host = "All", tags = [], query = "", lang = "en", showDeprecated = false } = {}
) {
  const buscado = query.trim().toLocaleLowerCase();
  const seleccionados = [...tags];

  return tools.filter((herramienta) => {
    if (estaRetirada(herramienta) && !showDeprecated) return false;
    if (host !== "All" && !(herramienta.hosts || []).includes(host)) return false;
    if (!seleccionados.every((tag) => (herramienta.tags || []).includes(tag))) return false;
    if (!buscado) return true;

    const enEtiquetas = [...(herramienta.hosts || []), ...(herramienta.tags || [])].some((e) =>
      e.toLocaleLowerCase().includes(buscado)
    );
    return enEtiquetas || coincideTexto(herramienta, buscado, lang);
  });
}

/**
 * Programas y funciones que existen en el catálogo, en orden canónico.
 *
 * Se calculan **al margen de lo que ya esté elegido**: si se calcularan sobre el
 * resultado filtrado, al elegir un programa desaparecería el otro de la lista y no
 * habría forma de cambiar sin volver a «Todos».
 */
export function opciones(tools, catalogo, { showDeprecated = false } = {}) {
  const visibles = tools.filter((h) => !estaRetirada(h) || showDeprecated);
  return {
    hosts: (catalogo.hosts || []).filter((host) =>
      visibles.some((h) => (h.hosts || []).includes(host))
    ),
    tags: (catalogo.tags || []).filter((tag) =>
      visibles.some((h) => (h.tags || []).includes(tag))
    ),
  };
}

/** Cuántas herramientas hay retiradas (para el botón de mostrarlas). */
export function contarRetiradas(tools) {
  return tools.filter(estaRetirada).length;
}