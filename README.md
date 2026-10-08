# Font Specimen

[Türkçe](README.tr.md)

Compare heading and body typeface candidates against **your own** site: your colours, your headline, your services, your languages. The tool suggests 10 heading and 10 body faces, previews them on a page built from your design tokens, and checks every language-specific letter for broken glyphs before you commit to a choice.

Everything runs in the browser. There is no backend, no account, no cookie, no analytics and no third-party request. Fonts are self-hosted and openly licensed.

## What it does

- **Project setup:** name, tone (luxurious, friendly, technical, …), site languages, current fonts, colour tokens and real content (headline, intro, three services, numeric facts, a small table). Six fictional presets get you started.
- **Candidates:** a picker scores a curated catalogue of 207 open-licensed families by tone, spreads the choice across design families (no ten geometric sans in a row), prefers variable fonts and faces with italics, and avoids ubiquitous defaults unless they are your current fonts. Your current fonts are always listed and marked “current”.
- **Specimen page:** an intro, a sticky selection bar (real radio groups, `aria-live` summary, copy button), a live preview that uses only your tokens and content, and a gallery of 20 cards that act as toggle buttons. Grid: 3 heading / 4 body columns on normal screens, 2 on narrow, 1 on mobile.
- **Glyph audit:** every special letter is rendered to a canvas at 200px and compared with its base letter (Turkish `ı/i`, `İ/I`, `ş/s`, `ğ/g`, … plus Polish `ł/l`). Identical bitmaps mean a broken glyph. For Turkish dotless `ı` it also checks that no ink sits above the x-height. Missing glyphs are detected by comparing two different fallbacks.
- **Export:** CSS custom properties, `@font-face` rules with real `unicode-range`, Fontsource and `next/font` snippets, a JSON backup, and a share link that keeps the whole project in the URL fragment (never sent to a server).
- **Interface:** Turkish, English, German, French, Spanish, Italian, Portuguese, Dutch, Swedish, Polish, Czech, Romanian, Hungarian, Russian, Ukrainian and Greek. Catalogue notes stay in Turkish and English.

### Findings worth knowing

The audit is not theoretical. Against the current catalogue it flags these families for Turkish. Tenor Sans, Lato, Bagel Fat One and Golos Text were also checked by eye:

| Family | Problem in Turkish |
| --- | --- |
| Tenor Sans | dotless `ı` drawn with a dot; `Ş/ş` uses a comma below |
| Lato (Fontsource build) | `İ`, `Ğ`, `ğ`, `Ş`, `ş` missing |
| Bagel Fat One | `İ`, `Ğ`, `ğ`, `Ş`, `ş` missing |
| Golos Text | `Ğ/ğ` drawn without the breve |
| Assistant | `İ`, `Ğ`, `ğ`, `Ş`, `ş` missing; `Ç` drawn like `C` |
| Expletus Sans | `İ`, `Ğ`, `ğ`, `Ş`, `ş` missing |
| Ballet | capital `İ` drawn like dotless `I` |

These faces carry a caveat in the catalogue and are never suggested for Turkish projects. The other handwriting faces in the catalogue passed the same Turkish check.

## Getting started

Requirements: Node.js 22.18 or newer (the scripts are TypeScript run natively by Node). The repository pins Node 24 in `.nvmrc`.

```bash
npm install
npm run dev        # downloads missing font files, then starts Vite
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | type check, then production build into `dist/` |
| `npm run preview` | serve `dist/` locally (the CSP is active here, not in dev) |
| `npm test` | unit tests (Vitest) |
| `npm run typecheck` | `tsc -b` |
| `npm run fonts` | download any font file listed in `src/generated/fontMeta.json` that is missing locally |
| `npm run fonts:sync` | re-read Fontsource, npm and upstream licence data and rewrite `fontMeta.json` |
| `npm run notices` | write `public/THIRD_PARTY_NOTICES.txt` |

The build uses relative asset paths and hash routing, so `dist/` works from any static host or sub-folder (GitHub Pages included) without configuration.

## How fonts are handled

- `src/generated/fontMeta.json` is committed. It pins each family to an exact Fontsource version and records its subsets, axes, files, licence, upstream licence URL and copyright line.
- The `.woff2` files (about 30 MB) are **not** committed. `npm run fonts` downloads exactly the pinned files from the jsDelivr Fontsource mirror into `public/fonts/<id>/`, together with the family's own `LICENSE.txt`, taken from the upstream [google/fonts](https://github.com/google/fonts) repository.
- At runtime fonts are loaded with the `FontFace` API from the same origin, split by `unicode-range`, so a browser only fetches the subsets your languages need.
- No visitor ever contacts Google, Fontsource or a CDN.

## Project layout

```
scripts/            font sync/download and third-party notices
src/data/           catalogue, languages, presets, shared types
src/generated/      fontMeta.json (generated, committed)
src/lib/            picker, glyph audit, storage, share links, snippets, contrast
src/i18n/           interface dictionaries (16 languages)
src/components/     shared UI and the specimen parts
src/pages/          routes; project tabs live in src/pages/project/
.cursor/commands/   the original Cursor command this tool grew out of
```

## Privacy and security

- Projects are stored in your browser's `localStorage` and can be deleted at any time from the Privacy page.
- Share links put the compressed project in the URL **fragment** (`#/share/…`), which browsers do not send to servers. Incoming data is size-limited and validated with Zod before use.
- The production build ships a strict Content Security Policy: everything from `'self'`, no inline scripts, no external connections, `object-src 'none'`, `base-uri 'none'`.

See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Legal

- **Code:** MIT, see [LICENSE](LICENSE).
- **Fonts:** 206 families under the SIL Open Font License 1.1 and one (Roboto Slab) under the Apache License 2.0. Each keeps its own copyright and licence; they are not relicensed by this repository. The in-app Legal page lists every family with its licence and copyright, and the build ships `THIRD_PARTY_NOTICES.txt`. Some font names are Reserved Font Names: if you modify a font, you must rename it.
- **Trademarks:** font names and the names Google Fonts and Fontsource belong to their owners and are used only to identify the typefaces. This project is independent and not affiliated with or endorsed by Google, Fontsource or any type designer.
- **Presets:** the six example businesses (Ekşimaya Fırın, Meridyen Hukuk, Nordlicht Studio, Tidepool Analytics, Maison Ondine, Bilmece Atölyesi) are fictional. Any resemblance to real businesses is coincidental.
- **No warranty:** suggestions and glyph checks are aids, not guarantees. Test the final choice on your real site and check each font's licence for your own use.

## The Cursor command

This tool started as a Cursor command that adds a specimen page directly into an existing codebase. It is kept in [`.cursor/commands/font-specimen.md`](.cursor/commands/font-specimen.md). To use it, copy the file into another project's `.cursor/commands/` folder and type `/font-specimen` in Cursor's chat.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
