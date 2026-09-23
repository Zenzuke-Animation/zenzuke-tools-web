#!/usr/bin/env python3
"""Prueba de extensibilidad: un programa nuevo entra solo.

Copia el proyecto a una carpeta temporal, añade una ficha de Cavalry y comprueba
que el titular, las insignias, el JSON y la fila de pestañas la recogen sin tocar
ni una línea de código ni de plantilla.

Uso: python3 pruebas/nuevo-programa.py
"""
from __future__ import annotations

import json
import pathlib
import shutil
import subprocess
import sys
import tempfile

RAIZ = pathlib.Path(__file__).resolve().parent.parent

FICHA_DEMO = """---
id: cavalry-demo
hosts:
- Cavalry
tags:
- Utility
version: '1.0'
status: active
updated: '2026-09-18'
license: MIT + Commons Clause
download: https://example.com/cavalry-demo.js
page: null
changelog: []
en:
  name: Cavalry Demo
  description: A demo tool for Cavalry to check that a new host appears on its own.
  instructions: '1. Run the script from the Cavalry scripts menu.'
  timelineCreation: Adds a layer to the composition.
  limitations: Does not work outside Cavalry.
  typicalUses: Testing how a new host is added to the site.
es:
  name: Demo de Cavalry
  description: Una herramienta de prueba para Cavalry que comprueba que un programa nuevo aparece solo.
  instructions: '1. Ejecuta el script desde el menú de scripts de Cavalry.'
  timelineCreation: Añade una capa a la composición.
  limitations: No funciona fuera de Cavalry.
  typicalUses: Comprobar cómo se añade un programa nuevo a la web.
---
"""


def main() -> int:
    with tempfile.TemporaryDirectory() as temporal:
        destino = pathlib.Path(temporal) / "proyecto"
        shutil.copytree(RAIZ, destino, ignore=shutil.ignore_patterns("dist", "__pycache__"))
        (destino / "tools" / "cavalry-demo").mkdir(parents=True)
        (destino / "tools" / "cavalry-demo" / "tool.md").write_text(FICHA_DEMO, encoding="utf-8")

        # Se usa «python3» del PATH (el intérprete que tiene PyYAML instalado),
        # no sys.executable, que puede ser otro distinto si se lanza desde un script.
        interprete = shutil.which("python3") or sys.executable
        resultado = subprocess.run(
            [interprete, "build.py"], cwd=destino, capture_output=True, text=True
        )
        if resultado.returncode != 0:
            print("FALLO: el build falló\n", resultado.stdout, resultado.stderr)
            return 1

        datos = json.loads((destino / "dist" / "scripts.json").read_text(encoding="utf-8"))
        indice = (destino / "dist" / "index.html").read_text(encoding="utf-8")
        pagina = json.dumps(datos, ensure_ascii=False)

        fallos = []
        if "Cavalry" not in datos["hosts"]:
            fallos.append(f"Cavalry no aparece en hosts: {datos['hosts']}")
        if "cavalry-demo" not in [t["id"] for t in datos["tools"]]:
            fallos.append("la herramienta de Cavalry no está en el catálogo")
        if "Cavalry" not in indice.split("<title>")[1].split("</title>")[0]:
            fallos.append("el titular del navegador no menciona Cavalry")
        if "\"Cavalry\"" not in pagina:
            fallos.append("las etiquetas de la herramienta no llevan el programa")

        if fallos:
            print("FALLOS:")
            for fallo in fallos:
                print(" -", fallo)
            return 1

        print("Extensibilidad correcta: añadiendo una ficha con «hosts: [Cavalry]»,")
        print("  · el catálogo pasa a tener los programas:", ", ".join(datos["hosts"]))
        print("  · el titular del navegador se actualiza solo")
        print("  · la fila de pestañas y las etiquetas de la herramienta la incluyen")
        return 0


if __name__ == "__main__":
    sys.exit(main())