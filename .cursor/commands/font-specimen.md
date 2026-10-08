# Font specimen page

Add a page to this project that compares heading and body typeface candidates using the site's real visual language. The **structure** is identical in every project; the **typefaces, content, colours and component styling** come from this project's own design.

Any notes the user writes after the command (route path, desired mood, fonts to exclude, …) override these instructions.

Reply to the user in the language they write in. Keep code, identifiers and commit messages in English.

## 1. Understand the project first

Before writing code, extract the following and summarise it briefly:

- **Stack:** framework (Next.js, Astro, Vite, plain HTML, …), routing layout, styling approach (CSS Modules, Tailwind, global CSS, …), and how fonts are currently loaded.
- **Design language:** colour tokens, current heading and body fonts, button / card / panel styles, dark or contrast sections, corner radii, spacing scale.
- **Brand and tone:** industry, audience, tone (luxurious, friendly, technical, playful, …), character of the logo (serif, sans, calligraphic, geometric).
- **Languages and scripts:** every language the site supports. Turkish requires the `latin-ext` subset (ç, ğ, ı, İ, ö, ş, ü).
- **Real content:** the home headline, a short intro sentence, three service or product names with descriptions, a dark-section heading, a few numeric facts, and a small table if one exists (opening hours, specs, …). The preview uses this content. Never use lorem ipsum.

## 2. Choose the candidates: 10 heading + 10 body

Pick **10 heading** and **10 body** typefaces that suit this project's tone.

- **Current fonts** are included and marked with a “current” badge. They count toward the 10.
- **Variety:** do not pick ten faces of the same kind.
  - Headings: spread across families such as high-contrast didone, classic/garalde serif, soft modern serif, condensed editorial serif, inscriptional, geometric sans, grotesk, expressive display.
  - Body: spread across geometric, humanist, grotesk and soft sans; add one highly legible serif if it fits.
- **Fit:** write one sentence per candidate on why it suits this project. That sentence becomes the card note.
- **Technical requirements:**
  - Must cover every site language. Verify with the Fontsource API: `https://api.fontsource.org/v1/fonts/<font-id>` → `subsets`. A listed subset only proves the glyph exists, not that it is drawn correctly; see the glyph check in step 5.
  - Must be openly licensed (Google Fonts or Fontsource).
  - Prefer variable fonts.
  - Note in the card when a face has no italic.
- **Avoid** ubiquitous defaults (Inter, Roboto, Open Sans, Montserrat, Poppins, Lato) unless there is a clear reason. If the project already uses one, it is still listed as “current”.

Before writing code, show the 20 choices as a table: name, classification, italic yes/no, note.

## 3. Page structure (identical in every project)

The page has four parts, in this order.

### 3.1 Intro
- Page title (h1): “Font specimen”, or its equivalent in the site's language (Turkish: “Yazı tipi denemesi”).
- One sentence explaining that the choice updates the preview instantly and that the gallery is at the bottom.

### 3.2 Sticky selection bar
- Sits directly below the site's fixed header (`top: <header height>`).
- Two rows, each a `fieldset` + `legend`: **Heading** and **Body**.
- Each option is a radio input whose label is set in its own typeface. The current font carries the “current” badge.
- On the right: a summary (“Heading: X · Body: Y”, `aria-live="polite"`) and a **Copy selection** button (`navigator.clipboard`, briefly shows “Copied” on success).
- On mobile the options become a single horizontally scrolling row.
- Default selection is your recommended heading + body pair; the current fonts remain in the list.

### 3.3 Live preview
Uses the project's **own** classes, colours and component styling. The selected fonts are applied only to this container through CSS custom properties: redefine the project's heading and body font variables on the container, and give it `font-family: var(<body font variable>)`. The site header and footer stay unchanged.

The preview has four parts:
1. **Hero excerpt:** main headline, intro sentence, primary and secondary button, 2–3 numeric facts. Beside it, three service/product rows in the project's card or panel style.
2. **Contrast section:** a section heading on the project's dark or accent background, an input/question line and a few chips.
3. **Text block:** a section heading, a 3–4 sentence body paragraph, a short uppercase label line.
4. **Small table:** four rows (hours, specs or similar); numbers use `tabular-nums`.

### 3.4 Gallery
- **Heading typefaces:** 10 cards. Each shows the font name (+ “current” badge), a sample sentence using the project's main headline, the brand name with digits, the language's special character set, and the fit note. Turkish character set: `Aa Çç Ğğ Iı İi Öö Şş Üü — 0123456789`.
- **Body typefaces:** 10 cards. Each shows the font name, a pangram plus one real sentence in the site's language, an uppercase label sample, the character set and the note. Turkish pangram: “Pijamalı hasta yağız şoföre çabucak güvendi.”
- Cards behave as buttons (`aria-pressed`); clicking one updates the selection above. The selected card gets a clear outline.
- Grid: heading cards 3 columns and body cards 4 columns on normal screens, 2 on narrow, 1 on mobile.

## 4. Implementation rules

- **File layout (adapt to the stack):**
  - `fontOptions`: data for the 20 candidates (id, name, CSS variable, fallback stack, note, `current`).
  - `specimenFonts`: the font loader. In Next.js use `next/font/google` (arguments must be literal values). In Astro/Vite use `@fontsource` or the project's existing method.
  - A `FontSpecimen` client component with its stylesheet, plus a thin route/page file.
- **Fonts load on this page only.** They must not enter the bundle of other pages, and visitors must never request fonts from Google directly (GDPR/KVKK). Self-host them.
- **Internal page:** `noindex`, not in navigation or the sitemap. On multilingual sites it can exist in one language only; the language switch falls back to the home page.
- **Accessibility:** radio groups use real `input` elements; keyboard focus is visible. If the page language changes uppercase mapping (Turkish turns i into İ), mark English font names with `lang="en"`.
- **Responsive:** must work at three widths: mobile ≤768px, narrow 769–1023px, normal ≥1024px.
- **Motion:** none is required. Any animation must stop under `prefers-reduced-motion`.
- **Avoid template-looking patterns:** no small tracked uppercase label above headings, no differently coloured or italic accent words in the middle of a sentence, no emoji, no generic gradient blobs.
- Follow the project's code style, naming and folder layout. Do not add dependencies; if a font package is needed, ask first.

## 5. Verify

- Type check and production build must pass.
- Open the page in the browser and confirm:
  - all 20 fonts actually load (check `document.fonts`, or the computed `font-family` after each selection),
  - **language-specific glyphs are drawn correctly** in every candidate. Some fonts ship broken glyphs: Tenor Sans, for example, draws Turkish dotless `ı` with a dot. Render each special letter and its base letter to a canvas at ~200px and compare pixels (identical bitmaps = broken glyph). For Turkish compare `ı/i`, `İ/I`, `ş/s`, `Ş/S`, `ğ/g`, `Ğ/G`, `ç/c`, `Ç/C`, `ö/o`, `ü/u`; for `ı` also confirm no pixels above the x-height. Mark broken candidates in the card note and the summary table,
  - changing the selection updates the preview,
  - the copy button works,
  - the layout holds at all three widths.
- Take screenshots and show them to the user.

## 6. Report to the user

- Give the local URL of the page.
- Summarise the 20 fonts in a short table and state the recommended pair with reasons.
- Say which single file will change once a choice is made. Do **not** change the site's fonts until the user chooses.
- Do not commit unless the user explicitly asks.
