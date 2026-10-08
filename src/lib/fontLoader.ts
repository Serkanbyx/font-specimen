import { fontFileUrl, unicodeRangeFor, type FontRecord } from './fonts.ts';

const registered = new Map<string, FontFace[]>();

/**
 * Registers every file of a family with its unicode-range. Nothing downloads
 * until text in that family is rendered, and then only the needed subsets.
 * FontFace is used instead of injected @font-face rules so the strict
 * Content-Security-Policy (no inline styles) still holds.
 */
export function registerFont(font: FontRecord): void {
  if (registered.has(font.id) || typeof FontFace === 'undefined') return;
  const faces = font.meta.files.map(
    (file) =>
      new FontFace(font.family, `url("${fontFileUrl(font, file.file)}") format("woff2")`, {
        weight: file.weight,
        style: file.style,
        unicodeRange: unicodeRangeFor(font, file.subset),
        display: 'swap',
      }),
  );
  for (const face of faces) document.fonts.add(face);
  registered.set(font.id, faces);
}

export function registerFonts(list: readonly (FontRecord | undefined)[]): void {
  for (const font of list) if (font) registerFont(font);
}

/** Resolves once the faces needed for `text` have loaded; false if none matched. */
export async function loadFont(font: FontRecord, text: string, weight = 400, style = 'normal'): Promise<boolean> {
  registerFont(font);
  const faces = await document.fonts.load(`${style} ${weight} 32px "${font.family}"`, text);
  return faces.length > 0;
}

export function loadedFaceCount(font: FontRecord): number {
  return (registered.get(font.id) ?? []).filter((face) => face.status === 'loaded').length;
}
