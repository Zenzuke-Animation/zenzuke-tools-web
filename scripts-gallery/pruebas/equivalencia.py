#!/usr/bin/env python3
"""Prueba de equivalencia de la migración.

Comprueba que el catálogo generado a partir de las fichas conserva, palabra por
palabra, todo lo que hoy está publicado en zenzuke.com/scripts/scripts.json.

Diferencias aceptadas (deliberadas):
- «2d-parameter-to-null» tenía la versión falsa «_Deprecated» y ahora lleva
  versión 1.0 más status «deprecated».
- Desde el 23-09-2026 el catálogo incluye herramientas nuevas que no estaban en
  el catálogo publicado (Cavalry y demás): se comprueba que sus textos no estén
  vacíos, pero no hay contra qué compararlos.

Uso:
    python3 pruebas/equivalencia.py            # compara dist/scripts.json con el publicado
    python3 pruebas/equivalencia.py --strict   # exige equivalencia total, sin excepciones
"""
from __future__ import annotations

import json
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
GENERADO = RAIZ / "dist" / "scripts.json"
PUBLICADO = RAIZ / "baseline-scripts.json"

CAMPOS_TEXTO = ("name", "description", "instructions", "timelineCreation", "limitations", "typicalUses")
EXCEPCIONES = {"2d-parameter-to-null"}

# Etiquetas que se corrigen a propósito respecto al catálogo publicado (18-09-2026):
# Carlos aclara que la única extensión (fichero .zxp) es Zen Ease; los demás son scripts,
# tengan interfaz o no. Motivo: «Extension» hacía de cajón de sastre y confundía el filtro.
ETIQUETAS_CORREGIDAS = {
    "marker-batch-render": "script con panel, no extensión",
    "marker-copy-paste": "script con panel, no extensión",
    "project-folder-helper": "script con panel, no extensión",
    "renombrator-illustrator": "script con panel, no extensión",
}


def main() -> int:
    estricto = "--strict" in sys.argv
    generado = {t["id"]: t for t in json.loads(GENERADO.read_text(encoding="utf-8"))["tools"]}
    publicado = {t["id"]: t for t in json.loads(PUBLICADO.read_text(encoding="utf-8"))}

    fallos: list[str] = []

    faltan = sorted(set(publicado) - set(generado))
    if faltan:
        fallos.append(f"herramientas que faltan en lo generado: {faltan}")

    nuevas = sorted(set(generado) - set(publicado))

    for slug, original in sorted(publicado.items()):
        nuevo = generado.get(slug)
        if not nuevo:
            continue
        # Etiquetas: la suma de los dos ejes debe reproducir las categorías publicadas
        publicadas = sorted(original["categories"])
        generadas = sorted(set(nuevo["hosts"]) | set(nuevo["tags"]))
        if generadas != publicadas:
            quitadas = set(publicadas) - set(generadas)
            permitido = (
                slug in ETIQUETAS_CORREGIDAS
                and quitadas == {"Extension"}
                and not estricto
            )
            if permitido:
                print(f"  etiqueta corregida en {slug}: se quita «Extension» "
                      f"({ETIQUETAS_CORREGIDAS[slug]})")
            else:
                fallos.append(f"{slug}: etiquetas {generadas} ≠ {publicadas}")
        if not nuevo["hosts"]:
            fallos.append(f"{slug}: sin programa (hosts)")
        if nuevo["downloadUrl"] != original["downloadUrl"]:
            fallos.append(f"{slug}: URL de descarga distinta")

        version_ok = nuevo["version"] == str(original["version"])
        if not version_ok:
            permitido = slug in EXCEPCIONES and not estricto
            if permitido and nuevo["status"] == "deprecated":
                print(f"  excepción aceptada en {slug}: versión «{original['version']}» → "
                      f"{nuevo['version']} + status deprecated")
            else:
                fallos.append(f"{slug}: versión {nuevo['version']} ≠ {original['version']}")

        if slug in EXCEPCIONES and nuevo["status"] != "deprecated":
            fallos.append(f"{slug}: debería estar marcado como deprecated")

        for idioma in ("en", "es"):
            for campo in CAMPOS_TEXTO:
                a, b = nuevo[idioma][campo], original[idioma][campo]
                if a != b:
                    fallos.append(
                        f"{slug}: {idioma}.{campo} no coincide\n"
                        f"    publicado: {b!r}\n    generado:  {a!r}"
                    )

    # Herramientas nuevas (aún sin contra qué comparar): comprobar que están completas
    for slug in nuevas:
        nuevo = generado[slug]
        if nuevo["status"] not in ("active", "deprecated"):
            fallos.append(f"{slug}: status raro «{nuevo['status']}»")
        if not nuevo["downloadUrl"].startswith(("http://", "https://")):
            fallos.append(f"{slug}: URL de descarga no válida")
        for idioma in ("en", "es"):
            for campo in CAMPOS_TEXTO:
                if not str(nuevo[idioma].get(campo, "")).strip():
                    fallos.append(f"{slug}: {idioma}.{campo} vacío")

    print(f"\nHerramientas comparadas con el catálogo publicado: {len(publicado)}")
    campos = len(publicado) * 2 * len(CAMPOS_TEXTO)
    if nuevas:
        print(f"Herramientas nuevas en el catálogo (sin baseline): {len(nuevas)} → {nuevas}")
    if fallos:
        print(f"FALLOS ({len(fallos)}):")
        for fallo in fallos:
            print(" -", fallo)
        return 1

    print(f"Equivalencia correcta: {campos} campos de texto idénticos al catálogo publicado, "
          f"etiquetas (programa + función) y URLs de descarga incluidas.")
    if ETIQUETAS_CORREGIDAS:
        print(f"  ({len(ETIQUETAS_CORREGIDAS)} fichas con la etiqueta «Extension» retirada a "
              f"propósito: no son extensiones, son scripts)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
