# GCBC Website — Ink-Wash Edition

Kellogg Greater China Business Conference site, restyled from the dark "aurora / glass" look into a gray-white ink-wash (写意) aesthetic based on the *Bridging Two Worlds* key visual. Content, pages and behavior are the same as the original site; only the visual system changed.

## Run locally

Static site, no build step.

```bash
python3 -m http.server 8097
```

Then open http://localhost:8097.

## Design system (`css/styles.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f8f8f6` | bright neutral rice-paper ground (fibre texture + whisper-light washes) |
| `--ink` | `#1b1b1d` | headings, primary text (neutral ink black) |
| `--crimson` / `--seal` | `#9c2327` / `#b2262a` | accent, buttons, seal marks |
| `--rust` | `#8a4a42` | "Shanghai" side of the palette |
| `--slate` | `#33476f` | "Chicago" side of the palette |

- **Type:** EB Garamond (display, old-style numerals), Source Serif 4 (body), Noto Serif SC (Chinese).
- **Motifs:** rule–diamond–rule and rule–dots ornaments, vermilion 商 seal (`assets/img/seal.png`), hairline borders, watercolor skylines.
- **Paper:** `assets/img/paper-fibre.webp` is a tileable xuan-paper texture (pale fibres + faint cloudy mottle) laid over the ground by `.paper-grain`; it scrolls with the page.
- **People cards:** straight, equal-height cards on one sheet of xuan paper (same tint and fibre texture, `paper-fibre.webp`), CONNECT buttons aligned at the bottom. On hover ink bleeds into the paper around the portrait (one of three masks, `assets/img/shapes/ink-bleed-{1,2,3}.png`: densest next to the photo, thinning outward with a damp, uneven edge; rust on odd cards, slate on even).
- **Gallery:** keeps its equal 4:3 grid, but each tile is feathered with one of four pre-rendered brush-edge masks (`assets/img/shapes/gallery-{1..4}.png`). People cards and sponsor tiles stay as cards.
- **Ink bleed:** `assets/img/ink-wash.svg` is tiled down the page by `body::after` (rust drifting in from the left, slate from the right); the footer carries a cloud bank (`assets/img/hero/footer-mist.webp`).
- **Alternating pigment:** rust and slate alternate across stat cards and panel numbers to echo the two skylines.

## Artwork

- `assets/img/hero/inkwash-skyline.webp` — homepage hero (text and seal removed from the original poster, bridge cable kept, paper re-balanced from cream to bright neutral white, mist lightened).
- `assets/img/hero/inkwash-banner.webp` — same art with the cable removed, used behind inner-page headers.
- `design/reference-poster.webp` — the original reference poster.

## Structure

```
index.html  2027-outlook.html  2026-recap.html  donate.html
our-team.html  about-us.html  contact-us.html
css/styles.css   js/main.js   assets/
```
