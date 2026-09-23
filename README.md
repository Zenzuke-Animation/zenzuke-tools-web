# zenzuke-tools-web

Static source of **zenzuke.com/tools** and **zenzuke.com/scripts**.

## What's here

- `tools-web/` — the unified tools index plus the motion tools:
  - `index.html` + `assets/` — index page and shared chrome/i18n
  - `curves/` — Curves Lab (curve editor with GIF export)
  - `sizes/` — size explorer / resolution calculator
  - `color/` — color converter
- `scripts-gallery/` — source of the scripts gallery:
  - `tools/<slug>/tool.md` — one card per script (front-matter + doc)
  - `site/` — templates and JS/CSS for the generated site
  - `build.py` — gallery generator (needs Python 3 + PyYAML)
  - `pruebas/` — equivalence and smoke tests

## Regenerating the gallery

The gallery site is generated, not hand-edited:

```bash
cd scripts-gallery
python3 build.py   # requires PyYAML
```

## Public downloads

The actual downloadable scripts live in the releases of their own repos
(`cavalry-scripts`, `ae-scripts`, `zen-ease`) — this repo is source only.
