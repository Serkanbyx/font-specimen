# Contributing

Thanks for helping. Issues and pull requests are welcome in English or Turkish.

## Setup

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run typecheck
npm test
npm run build
```

The CI workflow runs the same three commands.

## Ground rules

- **No new runtime dependencies** without discussing it in an issue first. The platform (FontFace, CompressionStream, canvas, `localStorage`) covers almost everything.
- **No third-party requests at runtime.** No analytics, web fonts from a CDN, embeds or trackers. The production CSP will block them anyway.
- **Accessibility, security and performance are requirements**, not extras: real form controls, visible focus, `prefers-reduced-motion`, and checks at mobile (≤768px), narrow (769–1023px) and normal (≥1024px) widths.
- **Every user-facing string goes in both dictionaries**, `src/i18n/en.ts` and `src/i18n/tr.ts`. Font names stay in English and carry `lang="en"`.
- Comments explain *why*, not *what*.
- Commit messages start with `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:` or `perf:`.

## Adding a typeface to the catalogue

1. The family must be on Fontsource and licensed under the SIL OFL 1.1 or Apache 2.0. Do not add fonts with other or unclear licences.
2. Add an entry to `src/data/catalogue.ts`: classification, roles, tones and a one-sentence note in both languages explaining what kind of project it suits.
3. Run `npm run fonts:sync`. It fetches metadata, pins the version, writes the upstream licence and copyright into `src/generated/fontMeta.json` and downloads the files.
4. Open the Glyph audit tab and run the catalogue audit. If the face fails for a language, add `glyphIssues` and a `caveat` in both languages.
5. Run the tests; `src/data/catalogue.test.ts` checks that metadata and licences are complete.

## Presets

Example projects in `src/data/presets.ts` must be clearly fictional: invented business names, no real addresses, phone numbers, people or logos.

## Licence of contributions

By contributing you agree that your contribution is licensed under the MIT licence of this repository.
