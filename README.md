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

## Single source of truth

**GitHub is the source of truth for the site.** The live files at
`zenzuke.com/scripts` and `zenzuke.com/tools` are build outputs, never edited by
hand and never used to reconstruct the source. To change the site: edit the
fichas (or `site/`), commit, push, rebuild and deploy.

Downloads always point to GitHub release assets
(`releases/latest/download/<asset>`). Do not link to Dropbox or to `raw/main`
files: the latest release must therefore carry **every** asset, or the older
cards break.

## Public downloads


The actual downloadable scripts live in the releases of their own repos
(`cavalry-scripts`, `adobe-scripts`, `zen-ease`) — this repo is source only.
