---
id: project-folder-helper
hosts:
- After Effects
tags:
- Utility
version: '1.0'
status: active
updated: '2026-06-03'
license: MIT + Commons Clause
download: https://www.dropbox.com/scl/fi/3wkq2txzutj41ct9ntuf5/ProjectFolderHelper.jsx?rlkey=ngv760vybpmkkoj08rben8u1e&dl=1
page: null
en:
  name: Project Folder Helper
  description: Lets you 'clone' the organization of your Project panel. You can export your entire current
    folder hierarchy to a plain text file (.txt) and then import it in any new project to recreate that
    same structure, maintaining the order of folders and subfolders.
  instructions: '1. Run the script from the File > Scripts menu.

    2. If you have a structure you like, click ''Export Structure (.txt)'' to save it.

    3. In a new project, click ''Import Structure (.txt)'' and select that file; the script will build
    the entire folder tree for you.'
  timelineCreation: Generates Folder-type elements in the Project panel. Uses a text path system (e.g.
    '04_VIDEO/FOOTAGE') to detect which folders go inside others and organize them exactly as in the original,
    regardless of depth.
  limitations: Only recreates the folder structure (the 'skeleton' of the project). Does not export or
    import files, compositions, or footage. If you edit the .txt file manually, ensure you maintain the
    slash-separated name format so the script doesn't get lost.
  typicalUses: Standardizing workflow in a team so everyone uses the same nomenclature, setting up new
    projects in seconds without creating folders by hand, saving different organization templates depending
    on the type of work (e.g. one for Social Media and another for VFX)
es:
  name: Project Folder Helper
  description: El script te permite "clonar" la organización de tu ventana de Proyecto. Puedes exportar
    toda tu jerarquía de carpetas actual a un archivo de texto simple (.txt) y luego importarlo en cualquier
    proyecto nuevo para recrear esa misma estructura automáticamente, manteniendo el orden de carpetas
    y subcarpetas.
  instructions: Ejecuta el script desde el menú *File > Scripts*. Si ya tienes una estructura que te gusta,
    pulsa **"Export Structure (.txt)"** para guardarla. En un proyecto nuevo, pulsa **"Import Structure
    (.txt)"** y selecciona ese archivo; el script se encargará de construir todo el árbol de carpetas
    por ti en un segundo.
  timelineCreation: 'Genera elementos de tipo "Folder" en la ventana de Proyecto. El script utiliza un
    sistema de rutas de texto (por ejemplo: `04_VIDEO/FOOTAGE`), lo que significa que detecta qué carpetas
    van dentro de otras y las organiza exactamente como estaban en el original, sin importar cuántos niveles
    de profundidad tengan.'
  limitations: Solo recrea la **estructura de carpetas** (el "esqueleto" del proyecto). No exporta ni
    importa los archivos, composiciones o material de archivo (footage) que haya dentro. Además, si decides
    editar el archivo .txt a mano, asegúrate de mantener el formato de nombres separados por barras `/`
    para que el script no se pierda.
  typicalUses: Estandarizar el flujo de trabajo en un equipo para que todos usen la misma nomenclatura,
    configurar proyectos nuevos en segundos sin tener que crear carpetas a mano ("GYST"), o guardar diferentes
    plantillas de organización según el tipo de trabajo (ej. una para Redes Sociales y otra para VFX).
---
