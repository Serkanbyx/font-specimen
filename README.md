# 🔤 Font Specimen

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Türkçe](README.tr.md)

Compare heading and body typeface candidates against your own site: your colours, your headline, your services and your languages. The tool suggests 10 heading and 10 body faces, previews them on a page built from your design tokens, and checks every language-specific letter for broken glyphs before you commit to a choice.

The app runs entirely in the browser. There is no backend, no account, no cookie, no analytics and no third-party request. Fonts are self-hosted and openly licensed.

## Features

- **Project setup**: Name, tone (luxurious, friendly, technical and others), site languages, current fonts, colour tokens and real content: a headline, an intro, three services, numeric facts and a small table. Six fictional presets get you started.
- **Candidates**: A picker scores a curated catalogue of 207 open-licensed families by tone, spreads the choice across design families, prefers variable fonts and italics, and avoids ubiquitous defaults unless they are already your current fonts. Your current fonts stay in the list and carry a “current” badge.
- **Specimen page**: An intro, a sticky selection bar with real radio groups, an `aria-live` summary and a copy button, a live preview that uses only your tokens and content, and a gallery of 20 cards that act as toggle buttons. The grid is 3 heading columns and 4 body columns on normal screens, 2 on narrow screens and 1 on mobile.
- **Glyph audit**: Every special letter is drawn on a canvas at 200px and compared with its base letter. Identical bitmaps mean a broken glyph. Turkish dotless `ı` is also checked for ink above the x-height. Missing glyphs are found by comparing two different fallbacks.
- **Export**: CSS custom properties, `@font-face` rules with a real `unicode-range`, Fontsource and `next/font` snippets, a JSON backup, and a share link that keeps the whole project in the URL fragment.
- **Interface**: Turkish, English, German, French, Spanish, Italian, Portuguese, Dutch, Swedish, Polish, Czech, Romanian, Hungarian, Russian, Ukrainian and Greek. Catalogue notes stay in Turkish and English.

## Live Demo

A public demo is not published. After the install steps below, open [http://localhost:5173/](http://localhost:5173/).

## Technologies

- **React 19**: The interface, including project tabs and the specimen gallery.
- **TypeScript**: Types for the catalogue, projects and font metadata. Scripts run as native TypeScript on Node.
- **Vite 8**: Dev server and static production build. Relative asset paths keep `dist/` portable.
- **Zod**: Validates stored projects, imported JSON and share-link payloads before use.
- **Vitest**: Unit tests for the picker, glyph checks, routing, sharing and snippets.
- **FontFace API**: Loads self-hosted `.woff2` files in the browser, split by `unicode-range`.
- **Canvas**: Renders glyphs for the audit and compares their pixel bitmaps.
- **CompressionStream**: Compresses a project into the share-link fragment with `deflate-raw`.
- **localStorage**: Keeps projects and the chosen interface language on this browser only.

## Installation

Requirements: Node.js 22.18 or newer. The repository pins Node 24 in `.nvmrc`. The font scripts are TypeScript and run directly on Node.

### Local development

```bash
npm install
npm run dev
```

`npm run dev` runs `npm run fonts` first. That downloads any pinned font file that is missing, then starts Vite.

### Production build

```bash
npm run build
npm run preview
```

`npm run build` type-checks, refreshes third-party notices, and writes `dist/`. `npm run preview` serves that folder locally. The Content Security Policy is active in this build. Dev mode leaves it out because hot reload injects inline code.

### Static hosting

Upload `dist/` to any static host, including a sub-folder such as GitHub Pages. Hash routing and relative paths mean the app needs no server configuration and no rewrite rules.

Other scripts:

| Script | What it does |
| --- | --- |
| `npm test` | Unit tests (Vitest) |
| `npm run typecheck` | `tsc -b` |
| `npm run fonts` | Download font files listed in `src/generated/fontMeta.json` that are missing locally |
| `npm run fonts:sync` | Re-read Fontsource, npm and upstream licence data, then rewrite `fontMeta.json` |
| `npm run notices` | Write `public/THIRD_PARTY_NOTICES.txt` |

## Usage

1. Start the app and open the home page.
2. Start from one of the six fictional presets, create a blank project, or import a JSON backup (200,000 bytes maximum).
3. On **Setup**, set the name, tones, languages, current fonts, colours and the real copy the preview will show.
4. On **Candidates**, review the 10 heading and 10 body suggestions. Each card explains why that face fits. Faces you already use are marked “current”.
5. On **Specimen**, switch heading and body with the sticky bar or the gallery. The preview updates immediately. **Copy selection** writes the pair to the clipboard.
6. On **Glyph audit**, run the check for the project’s languages before you keep a face.
7. On **Export**, copy CSS, `@font-face` rules or framework snippets, download JSON, or copy a share link.

Routes use the URL hash:

| Hash | Page |
| --- | --- |
| `#/` | Home |
| `#/p/<id>/setup` | Setup. Other tabs: `candidates`, `specimen`, `audit`, `export` |
| `#/catalogue` | The 207 families |
| `#/guide` | How to read a specimen |
| `#/legal` | Licences and copyright lines |
| `#/privacy` | What stays in the browser |
| `#/share/<payload>` | Open a shared project |

## How It Works

### Candidate score

Each face receives a score for the role (heading or body) and the tones you selected. `toneMatches` is how many of your tones appear on that face. The first tone in your list is the primary tone.

```text
score = toneMatches × 3
      + 1    if the primary tone is on the face
      + 0.5  if the face is variable
      + 0.75 if it has italic and the role is body
      + 0.25 if it has italic and the role is heading
      − 4    if it is a ubiquitous default
      − 0.75 if the catalogue gives it a caveat
```

A face is eligible when it supports the role, covers every required subset (Turkish needs `latin-ext`), is not excluded, and has no known glyph failure for the project’s languages.

The picker then keeps variety:

1. Your current font comes first, then any face you chose to keep.
2. The best fitting face of each design family is taken. A fit means at least one tone match, and ubiquitous defaults wait.
3. Remaining slots fill by score, with at most 3 faces from one family.
4. If the list is still short, the tone requirement relaxes, then ubiquitous defaults are allowed, and the family cap drops only at the end.

A recommended pair prefers contrast. The same family as both heading and body scores −10. A serif heading with a sans body scores +2. Two faces from the same body group score −1.

### Glyph audit

Accented letters are paired with a base letter (`ş` with `s`, `ğ` with `g`, and the extra Turkish and Polish pairs that Unicode decomposition does not express). Each glyph is painted at 200px. A pixel counts as ink when its alpha is at least 64. If the ink pattern matches the base letter, the accent is missing even though the character exists in the font. For Turkish dotless `ı`, the check also requires no ink above the x-height.

### Font files

`src/generated/fontMeta.json` is committed. It pins every family to an exact Fontsource version and records subsets, axes, files, the licence, the upstream licence URL and the copyright line.

The `.woff2` files (about 30 MB) are not committed. `npm run fonts` downloads the pinned files from the jsDelivr Fontsource mirror into `public/fonts/<id>/`, and places each family’s own `LICENSE.txt` beside them. That licence text comes from the upstream [google/fonts](https://github.com/google/fonts) repository.

At runtime the `FontFace` API loads those files from the same origin, split by `unicode-range`, so the browser fetches only the subsets your languages need. A visitor’s browser does not contact Google, Fontsource or a CDN. The download step runs on your machine, during install or build.

### Share links and storage

Projects live in `localStorage` under this origin. A share link compresses the project with `deflate-raw`, encodes it as base64url, and puts it in the fragment (`#/share/…`). Browsers do not send the fragment to a server. Payloads are capped at 24,000 encoded characters and 64,000 bytes after decompression, then checked with Zod.

### Privacy and security

- Delete projects at any time from the Privacy page.
- The production build ships a strict Content Security Policy: everything from `'self'`, no inline scripts, no external connections, `object-src 'none'`, `base-uri 'none'`.
- Report a vulnerability in private. See [SECURITY.md](SECURITY.md). Do not open a public issue for security problems.

### Project layout

```text
scripts/            font sync, download and third-party notices
src/data/           catalogue, languages, presets, shared types
src/generated/      fontMeta.json (generated, committed)
src/lib/            picker, glyph audit, storage, share links, snippets, contrast
src/i18n/           interface dictionaries (16 languages)
src/components/     shared UI and the specimen parts
src/pages/          routes; project tabs live in src/pages/project/
.cursor/commands/   the original Cursor command this tool grew out of
```

## Customization

### Add a typeface

The family must be on Fontsource and licensed under the SIL Open Font License 1.1 or the Apache License 2.0. Add an entry to `src/data/catalogue.ts`:

```typescript
{
  id: 'your-fontsource-id',
  family: 'Family Name',
  classification: 'humanistSans',
  roles: ['body'],
  tones: ['calm', 'friendly'],
  note: {
    tr: 'Bu yüzün aklınızdaki projelere neden uyduğunu tek cümlede yazın.',
    en: 'One sentence on why this face suits the projects you have in mind.',
  },
}
```

`classification` is one of `didone`, `garalde`, `transitional`, `softSerif`, `editorialSerif`, `inscriptional`, `slab`, `geometricSans`, `humanistSans`, `grotesk`, `softSans`, `condensedSans`, `display` or `mono`.

Then run:

```bash
npm run fonts:sync
```

That pins the version, writes the upstream licence and copyright into `fontMeta.json`, and downloads the files. Open the Glyph audit tab and run the catalogue audit. If the face fails for a language, add `glyphIssues` and a `caveat` in both languages.

### Add a preset

Example projects live in `src/data/presets.ts`. They must be fictional: invented business names, and no real addresses, phone numbers, people or logos. Each preset needs a `summary` and `content` in Turkish and English, plus `languages`, `tones` and `theme` colours.

### Change interface copy

User-facing strings live in `src/i18n/`. English and Turkish (`en.ts`, `tr.ts`) are the source pair. The other fourteen locales are loaded on demand. Font names stay in English and are marked `lang="en"`, because Turkish uppercase turns `i` into `İ`.

### Use the Cursor command in another project

This app started as a Cursor command that adds a specimen page to an existing codebase. The command is [`.cursor/commands/font-specimen.md`](.cursor/commands/font-specimen.md). Copy that file into the other project’s `.cursor/commands/` folder and type `/font-specimen` in Cursor’s chat. Opening this repository does not install the command into other projects.

## Features in Detail

### Known Turkish glyph findings

The audit flags these families in the current catalogue. Tenor Sans, Lato, Bagel Fat One and Golos Text were also checked by eye.

| Family | Problem in Turkish |
| --- | --- |
| Tenor Sans | Dotless `ı` is drawn with a dot; `Ş/ş` uses a comma below |
| Lato (Fontsource build) | `İ`, `Ğ`, `ğ`, `Ş`, `ş` missing |
| Bagel Fat One | `İ`, `Ğ`, `ğ`, `Ş`, `ş` missing |
| Golos Text | `Ğ/ğ` drawn without the breve |
| Assistant | `İ`, `Ğ`, `ğ`, `Ş`, `ş` missing; `Ç` drawn like `C` |
| Expletus Sans | `İ`, `Ğ`, `ğ`, `Ş`, `ş` missing |
| Ballet | Capital `İ` drawn like dotless `I` |

These faces carry a caveat in the catalogue and are never suggested for Turkish projects. The other handwriting faces in the catalogue passed the same Turkish check.

Suggestions and glyph checks are aids. Test the final choice on your real site.

### What ships today

- ✅ Six fictional presets and JSON import/export
- ✅ Ten heading and ten body candidates, with a recommended pair
- ✅ Specimen preview, sticky radios and a 20-card gallery
- ✅ Canvas glyph audit, including Turkish and Polish special cases
- ✅ CSS, `@font-face`, Fontsource and `next/font` export
- ✅ Share links that never leave the URL fragment
- ✅ Sixteen interface languages
- ✅ Strict production Content Security Policy

## Contributing

Issues and pull requests are welcome in English or Turkish. By contributing you agree that your contribution is licensed under the MIT licence of this repository.

1. Fork the repository and create a branch.
2. Install dependencies and start the app with `npm install` and `npm run dev`.
3. Commit with a message that starts with `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:` or `perf:`.
4. Before a pull request, run `npm run typecheck`, `npm test` and `npm run build`.
5. Push the branch and open a pull request.

Full rules, including how a new typeface is reviewed, are in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

The code is [MIT](LICENSE).

### Fonts

206 families are under the SIL Open Font License 1.1. One family, Roboto Slab, is under the Apache License 2.0. Each keeps its own copyright and licence. This repository does not relicense them. The in-app Legal page lists every family with its licence and copyright, and the build ships `THIRD_PARTY_NOTICES.txt`. Some font names are Reserved Font Names: if you modify a font, you must rename it.

### Trademarks

Font names, and the names Google Fonts and Fontsource, belong to their owners and are used only to identify the typefaces. This project is independent and is not affiliated with or endorsed by Google, Fontsource or any type designer.

### Presets

The six example businesses (Ekşimaya Fırın, Meridyen Hukuk, Nordlicht Studio, Tidepool Analytics, Maison Ondine, Bilmece Atölyesi) are fictional. Any resemblance to a real business is coincidental.

### No warranty

The software and the font files are provided without warranty. Read each font’s licence for your own use.

## Developer

**Serkanbyx**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- The type designers and copyright holders of the 207 families.
- [Fontsource](https://fontsource.org/) for per-family packages, subset metadata and the API the sync script reads.
- [google/fonts](https://github.com/google/fonts) for the upstream licence texts copied next to each family.
- The SIL Open Font License and the Apache License 2.0, which keep those families redistributable.

## Contact

- Questions and bugs: [open an issue](https://github.com/Serkanbyx/font-specimen/issues)
- Security reports: GitHub private vulnerability reporting, described in [SECURITY.md](SECURITY.md)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
