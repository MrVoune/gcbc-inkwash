# GCBC Website — Ink-Wash Edition

Kellogg Greater China Business Conference site, restyled from the dark "aurora / glass" look into an ink-wash, rice-paper aesthetic based on the *Bridging Two Worlds* key visual. Content, pages and behavior are the same as the original site; only the visual system changed.

## Run locally

Static site, no build step.

```bash
python3 -m http.server 8097
```

Then open http://localhost:8097.

## Design system (`css/styles.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f4ece5` | page ground (with SVG grain + soft washes) |
| `--ink` | `#1d1613` | headings, primary text |
| `--crimson` / `--seal` | `#9c2327` / `#b2262a` | accent, buttons, seal marks |
| `--rust` | `#8a4a42` | "Shanghai" side of the palette |
| `--slate` | `#33476f` | "Chicago" side of the palette |

- **Type:** EB Garamond (display, old-style numerals), Source Serif 4 (body), Noto Serif SC (Chinese).
- **Motifs:** rule–diamond–rule and rule–dots ornaments, vermilion 商 seal (`assets/img/seal.png`), hairline borders, watercolor skylines.
- **Alternating pigment:** rust and slate alternate across stat cards and panel numbers to echo the two skylines.

## Artwork

- `assets/img/hero/inkwash-skyline.webp` — homepage hero (text and seal removed from the original poster, bridge cable kept).
- `assets/img/hero/inkwash-banner.webp` — same art with the cable removed, used behind inner-page headers.
- `design/reference-poster.webp` — the original reference poster.

## Structure

```
index.html  2027-outlook.html  2026-recap.html  donate.html
our-team.html  about-us.html  contact-us.html
css/styles.css   js/main.js   assets/
```
