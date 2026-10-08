import { languages, type GlyphPairDefinition, type LanguageCode } from '../data/languages.ts';

export interface GlyphPair extends GlyphPairDefinition {
  language: LanguageCode;
}

/** Letters in a charset string, without spaces, digits or punctuation. */
export function lettersOf(charset: string): string[] {
  return [...new Set([...charset].filter((char) => /\p{L}/u.test(char)))];
}

/**
 * Pairs each accented letter with its base letter. If a font draws both
 * identically, the accent is missing even though the codepoint exists.
 */
export function pairsForLanguage(code: LanguageCode): GlyphPair[] {
  const info = languages[code];
  const pairs: GlyphPair[] = [];
  const seen = new Set<string>();
  const push = (glyph: string, base: string) => {
    const key = `${glyph}|${base}`;
    if (glyph === base || seen.has(key)) return;
    seen.add(key);
    pairs.push({ glyph, base, language: code });
  };

  for (const letter of lettersOf(info.charset)) {
    const decomposed = letter.normalize('NFD');
    const base = [...decomposed][0];
    if (base && decomposed.length > 1 && /\p{L}/u.test(base)) push(letter, base);
  }
  for (const pair of info.extraPairs ?? []) push(pair.glyph, pair.base);
  return pairs;
}

export function pairsForLanguages(codes: readonly LanguageCode[]): GlyphPair[] {
  return codes.flatMap((code) => pairsForLanguage(code));
}

export function lettersForLanguages(codes: readonly LanguageCode[]): string[] {
  return [...new Set(codes.flatMap((code) => lettersOf(languages[code].charset)))];
}

export interface Bitmap {
  width: number;
  height: number;
  /** One alpha value (0–255) per pixel, row-major. */
  alpha: ArrayLike<number>;
}

export interface InkBounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const inkThreshold = 64;

export function inkBounds(bitmap: Bitmap, threshold = inkThreshold): InkBounds | null {
  let top = -1;
  let bottom = -1;
  let left = bitmap.width;
  let right = -1;
  for (let y = 0; y < bitmap.height; y++) {
    for (let x = 0; x < bitmap.width; x++) {
      if ((bitmap.alpha[y * bitmap.width + x] ?? 0) < threshold) continue;
      if (top === -1) top = y;
      bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }
  return top === -1 ? null : { top, bottom, left, right };
}

/** Share of pixels whose ink state differs between two same-sized bitmaps. */
export function differenceRatio(a: Bitmap, b: Bitmap, threshold = inkThreshold): number {
  if (a.width !== b.width || a.height !== b.height) return 1;
  let inked = 0;
  let different = 0;
  for (let i = 0; i < a.width * a.height; i++) {
    const inkA = (a.alpha[i] ?? 0) >= threshold;
    const inkB = (b.alpha[i] ?? 0) >= threshold;
    if (inkA || inkB) inked++;
    if (inkA !== inkB) different++;
  }
  return inked === 0 ? 0 : different / inked;
}

/** Below this share of differing ink, two renderings count as the same glyph. */
export const identicalTolerance = 0.01;

export function looksIdentical(a: Bitmap, b: Bitmap): boolean {
  return differenceRatio(a, b) <= identicalTolerance;
}

/**
 * A dotless ı whose ink rises clearly above the x-height of `x` has a dot (or
 * an accent) drawn on it. Tolerance absorbs overshoot and hinting.
 */
export function hasInkAboveXHeight(dotless: Bitmap, x: Bitmap, fontSize: number): boolean {
  const dotlessBounds = inkBounds(dotless);
  const xBounds = inkBounds(x);
  if (!dotlessBounds || !xBounds) return false;
  return dotlessBounds.top < xBounds.top - fontSize * 0.04;
}

export type GlyphIssueKind = 'missing' | 'identical' | 'dotted';

export interface GlyphIssue {
  kind: GlyphIssueKind;
  glyph: string;
  base?: string;
  language: LanguageCode;
}
