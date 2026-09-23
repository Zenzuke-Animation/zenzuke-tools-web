#!/usr/bin/env python3
"""Genera dist/ (lo que se sube por FTP) a partir de las fichas y de la plantilla.

- Las fichas son la única fuente de verdad: tools/<slug>/tool.md
- site/ es la plantilla de la web (HTML, CSS y los módulos de JS)
- dist/ es el resultado: index.html, style.css, js/, scripts.json y las páginas propias

Uso:
    python3 build.py            # genera dist/
    python3 build.py --comprobar  # solo valida las fichas, no escribe nada
"""
from __future__ import annotations

import html
import json
import pathlib
import re
import shutil
import sys

import yaml

RAIZ = pathlib.Path(__file__).resolve().parent
TOOLS = RAIZ / "tools"
SITE = RAIZ / "site"
DIST = RAIZ / "dist"

CAMPOS_OBLIGATORIOS = (
    "id",
    "hosts",
    "version",
    "status",
    "updated",
    "license",
    "download",
)
IDIOMAS = ("en", "es")
CAMPOS_TEXTO = (
    "name",
    "description",
    "instructions",
    "timelineCreation",
    "limitations",
    "typicalUses",
)
ESTADOS = ("active", "deprecated")

# Los dos ejes de etiquetas: programas (pestañas) y funciones (chips). El orden
# canónico es el que se ve en la web, independientemente del orden de las fichas.
ORDEN_HOSTS = ("After Effects", "Illustrator", "Cavalry")
ORDEN_TAGS = ("Rigging", "Timeline", "Utility", "Extension")


# ---------------------------------------------------------------- fichas


def leer_ficha(ruta: pathlib.Path) -> dict:
    texto = ruta.read_text(encoding="utf-8")
    if not texto.startswith("---\n"):
        raise ValueError(f"{ruta}: falta el bloque de metadatos (---)")
    _, cabecera, _ = texto.split("---\n", 2)
    datos = yaml.safe_load(cabecera)
    if not isinstance(datos, dict):
        raise ValueError(f"{ruta}: los metadatos no son válidos")

    for campo in CAMPOS_OBLIGATORIOS:
        if campo not in datos:
            raise ValueError(f"{ruta}: falta el campo «{campo}»")
    if datos["status"] not in ESTADOS:
        raise ValueError(f"{ruta}: status debe ser uno de {ESTADOS}")
    if datos["id"] != ruta.parent.name:
        raise ValueError(f"{ruta}: el id «{datos['id']}» no coincide con la carpeta")
    if not datos["hosts"]:
        raise ValueError(f"{ruta}: sin programa (hosts)")
    if not isinstance(datos["hosts"], list) or not isinstance(datos.get("tags", []), list):
        raise ValueError(f"{ruta}: hosts y tags deben ser listas")
    for host in datos["hosts"]:
        if host not in ORDEN_HOSTS:
            raise ValueError(f"{ruta}: programa desconocido «{host}» (válidos: {ORDEN_HOSTS})")

    for idioma in IDIOMAS:
        bloque = datos.get(idioma)
        if not isinstance(bloque, dict):
            raise ValueError(f"{ruta}: falta el bloque «{idioma}»")
        for campo in CAMPOS_TEXTO:
            if not bloque.get(campo):
                raise ValueError(f"{ruta}: {idioma}.{campo} está vacío")

    datos.setdefault("page", None)
    datos.setdefault("changelog", [])
    return datos


def leer_fichas() -> list[dict]:
    fichas = [leer_ficha(p) for p in sorted(TOOLS.glob("*/tool.md"))]
    vistos: set[str] = set()
    for ficha in fichas:
        if ficha["id"] in vistos:
            raise ValueError(f"id repetido: {ficha['id']}")
        vistos.add(ficha["id"])
    return fichas


def orden(ficha: dict) -> tuple:
    """Activos primero, ordenados por nombre en inglés; los obsoletos al final."""
    return (
        1 if ficha["status"] == "deprecated" else 0,
        ficha["en"]["name"].casefold(),
    )


# ---------------------------------------------------------------- salidas


def entrada_catalogo(ficha: dict) -> dict:
    return {
        "id": ficha["id"],
        "version": str(ficha["version"]),
        "hosts": list(ficha["hosts"]),
        "tags": list(ficha.get("tags", [])),
        "status": ficha["status"],
        "updated": str(ficha["updated"]),
        "license": ficha["license"],
        "page": ficha["page"],
        "downloadUrl": ficha["download"],
        "changelog": ficha.get("changelog", []),
        "en": {c: ficha["en"][c] for c in CAMPOS_TEXTO},
        "es": {c: ficha["es"][c] for c in CAMPOS_TEXTO},
    }


def catalogo(fichas: list[dict]) -> dict:
    activas = [f for f in fichas if f["status"] == "active"]
    return {
        "updated": max(f["updated"] for f in fichas),
        "count": len(fichas),
        "countActive": len(activas),
        "countDeprecated": len(fichas) - len(activas),
        "hosts": [h for h in ORDEN_HOSTS if any(h in f["hosts"] for f in fichas)],
        "tags": [t for t in ORDEN_TAGS if any(t in f.get("tags", []) for f in fichas)]
        + sorted({t for f in fichas for t in f.get("tags", [])} - set(ORDEN_TAGS)),
        "tools": [entrada_catalogo(f) for f in sorted(fichas, key=orden)],
    }


# ---------------------------------------------------------------- página propia


def inline(texto: str) -> str:
    escapado = html.escape(texto)
    escapado = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", escapado)
    escapado = re.sub(r"`(.+?)`", r"<code>\1</code>", escapado)
    return escapado


def parrafo(texto: str) -> str:
    return f"<p>{inline(texto)}</p>"


def lista_numerada(texto: str) -> str:
    lineas = [l.strip() for l in texto.splitlines() if l.strip()]
    numeracion = re.compile(r"^\d+[.)\s]+")
    items = "".join("<li>%s</li>" % inline(numeracion.sub("", l)) for l in lineas)
    return f"<ol class=\"instructions-list\">{items}</ol>"


def bloque(etiqueta: str, titulo: str, contenido: str, clase: str = "") -> str:
    if not contenido:
        return ""
    extra = f" {clase}" if clase else ""
    return (
        f'<section class="detail-section{extra}">'
        f'<h2 class="section-title">{html.escape(titulo)}</h2>{contenido}</section>'
    )


def lista_en_espanol(elementos: list[str]) -> str:
    """[a, b, c] → «a, b y c» (para el titular y la descripción)."""
    if len(elementos) < 2:
        return elementos[0] if elementos else ""
    return ", ".join(elementos[:-1]) + " y " + elementos[-1]


def version_de_recursos() -> str:
    """Huella corta del CSS y del JS, para romper la caché del navegador al publicar.

    Sin esto, un style.css nuevo puede quedarse sin llegar al visitante que ya
    tenía el anterior guardado (y a los servidores intermedios, que lo cachean).
    """
    import hashlib

    resumen = hashlib.sha256()
    for ruta in sorted(SITE.rglob("*")):
        if ruta.is_file() and ruta.suffix in (".css", ".js"):
            resumen.update(ruta.read_bytes())
    return resumen.hexdigest()[:8]


def pagina_indice(plantilla: str, datos: dict, recursos: str = "") -> str:
    """Rellena el titular, la descripción y las insignias a partir del catálogo."""
    hosts = datos["hosts"]
    sustituciones = {
        "{{PAGE_TITLE}}": html.escape(f"Scripts para {lista_en_espanol(hosts)} | Zenzuke"),
        "{{META_DESCRIPTION}}": html.escape(
            f"Scripts y herramientas de Zenzuke para {lista_en_espanol(hosts)}: "
            "qué hace cada una, cómo se usa y descarga directa.",
            quote=True,
        ),
        "href=\"style.css\"": f'href="style.css?v={recursos}"',
        "src=\"js/app.js\"": f'src="js/app.js?v={recursos}"',
    }
    salida = plantilla
    for clave, valor in sustituciones.items():
        salida = salida.replace(clave, valor)
    return salida


def resumen_plano(texto: str, limite: int = 158) -> str:
    """Texto de la ficha → descripción de una línea para el <meta name="description">."""
    limpio = re.sub(r"[*`]", "", str(texto or ""))
    limpio = re.sub(r"\s+", " ", limpio).strip()
    return limpio if len(limpio) <= limite else limpio[: limite - 1].rstrip() + "…"


def pagina_propia(ficha: dict, plantilla: str, etiquetas: dict, recursos: str = "") -> str:
    es, en = ficha["es"], ficha["en"]
    version = str(ficha["version"])
    changelog = ""
    if ficha.get("changelog"):
        filas = "".join(
            f"<li><strong>{html.escape(str(v.get('version', '')))}</strong>"
            f"{' · ' + html.escape(str(v.get('date', ''))) if v.get('date') else ''}"
            f"<br>{inline(str(v.get('notes', '')))}</li>"
            for v in ficha["changelog"]
        )
        changelog = bloque(etiquetas["changelog"], etiquetas["changelog"], f"<ul>{filas}</ul>")

    obsoleto = (
        f'<p class="status-note">{etiquetas["deprecated_note"]}</p>'
        if ficha["status"] == "deprecated"
        else ""
    )

    sustituciones = {
        "{{NAME}}": html.escape(en["name"]),
        "{{NAME_ES}}": html.escape(es["name"]),
        "{{META_DESCRIPTION}}": html.escape(resumen_plano(es["description"]), quote=True),
        "{{TOOL_JSON}}": json.dumps(entrada_catalogo(ficha), ensure_ascii=False).replace("</", "<\\/"),
        "{{VERSION}}": html.escape(version),
        "{{UPDATED}}": html.escape(str(ficha["updated"])),
        "{{CATEGORIES}}": html.escape(" · ".join(list(ficha["hosts"]) + list(ficha.get("tags", [])))),
        "{{LICENSE}}": html.escape(str(ficha["license"])),
        "{{DOWNLOAD_URL}}": html.escape(ficha["download"], quote=True),
        "{{DOWNLOAD_LABEL}}": etiquetas["download"],
        "{{KIND}}": etiquetas.get("kind_" + ficha["kind"], etiquetas["kind_default"])
        if "kind" in ficha
        else etiquetas["kind_default"],
        "{{DESCRIPTION}}": parrafo(es["description"]) if es.get("description") else "",
        "{{INSTALL}}": bloque(
            "install", etiquetas["install"], lista_numerada(es["instructions"])
        ),
        "{{TIMELINE}}": bloque("timeline", etiquetas["timeline"], parrafo(es["timelineCreation"])),
        "{{LIMITATIONS}}": bloque(
            "limitations", etiquetas["limitations"], parrafo(es["limitations"]), "limitations-box"
        ),
        "{{USES}}": bloque("uses", etiquetas["uses"], parrafo(es["typicalUses"])),
        "{{CHANGELOG}}": changelog,
        "{{DEPRECATED}}": obsoleto,
        "href=\"../style.css\"": f'href="../style.css?v={recursos}"',
        "src=\"../js/tool-page.js\"": f'src="../js/tool-page.js?v={recursos}"',
    }
    salida = plantilla
    for clave, valor in sustituciones.items():
        salida = salida.replace(clave, valor)
    return salida


ETIQUETAS_PAGINA = {
    "download": "Descargar",
    "install": "Cómo se instala",
    "timeline": "Qué hace en el proyecto",
    "limitations": "Limitaciones",
    "uses": "Usos típicos",
    "changelog": "Versiones",
    "deprecated_note": "Herramienta retirada. Se deja disponible solo por compatibilidad.",
    "kind_default": "Herramienta",
}


# ---------------------------------------------------------------- build


def avisos_de_etiquetas(fichas: list[dict]) -> list[str]:
    """Vigila el criterio de la etiqueta «Extension»: es para paquetes .zxp.

    Un script de After Effects, tenga panel o no, no es una extensión. Si algún día
    se etiqueta mal (o se publica un .zxp sin etiquetar), el build lo dice.
    """
    avisos = []
    for ficha in fichas:
        es_zxp = str(ficha["download"]).lower().split("?")[0].endswith(".zxp")
        marcada = "Extension" in ficha.get("tags", [])
        if marcada and not es_zxp:
            avisos.append(
                f"{ficha['id']}: lleva la etiqueta «Extension» pero no es un .zxp "
                f"(la etiqueta es solo para paquetes .zxp)"
            )
        elif es_zxp and not marcada:
            avisos.append(f"{ficha['id']}: es un .zxp y no lleva la etiqueta «Extension»")
    return avisos


def build(comprobar: bool = False) -> int:
    fichas = leer_fichas()
    datos = catalogo(fichas)

    sin_descarga = [f["id"] for f in fichas if not f["download"]]
    if sin_descarga:
        print("AVISO: sin URL de descarga:", ", ".join(sin_descarga))

    for aviso in avisos_de_etiquetas(fichas):
        print("AVISO:", aviso)

    print(f"Fichas: {len(fichas)}  activas: {datos['countActive']}  "
          f"obsoletas: {datos['countDeprecated']}  actualizado: {datos['updated']}")
    print(f"Programas: {', '.join(datos['hosts'])}   Funciones: {', '.join(datos['tags'])}")

    if comprobar:
        print("Comprobación correcta, no se ha escrito nada.")
        return 0

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    for elemento in SITE.iterdir():
        if elemento.name.endswith(".template.html"):
            continue
        destino = DIST / elemento.name
        if elemento.is_dir():
            shutil.copytree(elemento, destino)
        else:
            shutil.copy2(elemento, destino)

    (DIST / "scripts.json").write_text(
        json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    # index.html: titular y descripción generados del catálogo, con los recursos versionados
    recursos = version_de_recursos()
    indice = (SITE / "index.html").read_text(encoding="utf-8")
    (DIST / "index.html").write_text(pagina_indice(indice, datos, recursos), encoding="utf-8")

    plantilla = (SITE / "tool-page.template.html").read_text(encoding="utf-8")
    for ficha in fichas:
        if not ficha["page"]:
            continue
        destino = DIST / ficha["page"]
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(
            pagina_propia(ficha, plantilla, ETIQUETAS_PAGINA, recursos), encoding="utf-8"
        )
        print("página propia:", ficha["page"])

    tamano = sum(p.stat().st_size for p in DIST.rglob("*") if p.is_file())
    print(f"dist/ listo: {len(list(DIST.rglob('*')))} elementos, {tamano / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(build(comprobar="--comprobar" in sys.argv))
