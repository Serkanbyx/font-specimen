import rawMeta from '../generated/fontMeta.json';
import { catalogue, getCatalogueFont } from '../data/catalogue.ts';
import type { CatalogueFont, Classification, FontMeta, FontMetaFile, FontRole, Subset } from '../data/types.ts';

const meta = rawMeta as FontMetaFile;

export interface FontRecord extends CatalogueFont {
  meta: FontMeta;
}

/** Catalogue entries joined with downloaded metadata; entries without files are skipped. */
export const fonts: readonly FontRecord[] = catalogue.flatMap((font) => {
  const fontMeta = meta.fonts[font.id];
  return fontMeta ? [{ ...font, meta: fontMeta }] : [];
});

const byId = new Map(fonts.map((font) => [font.id, font]));

export function getFont(id: string | null | undefined): FontRecord | undefined {
  return id ? byId.get(id) : undefined;
}

export function isKnownFont(id: string): boolean {
  return byId.has(id) && getCatalogueFont(id) !== undefined;
}

export function fontsForRole(role: FontRole): FontRecord[] {
  return fonts.filter((font) => font.roles.includes(role));
}

export function supportsSubsets(font: FontRecord, subsets: readonly Subset[]): boolean {
  return subsets.every((subset) => font.meta.subsets.includes(subset));
}

export function unicodeRangeFor(font: FontRecord, subset: Subset): string {
  return font.meta.unicodeRange?.[subset] ?? meta.subsetRanges[subset];
}

export function fontFileUrl(font: FontRecord, file: string): string {
  return `${import.meta.env.BASE_URL}fonts/${font.id}/${file}`;
}

export function licenseUrl(font: FontRecord): string {
  return `${import.meta.env.BASE_URL}fonts/${font.id}/LICENSE.txt`;
}

export function totalBytes(font: FontRecord): number {
  return font.meta.files.reduce((sum, file) => sum + file.bytes, 0);
}

const fallbackStacks: Record<Classification, string> = {
  didone: "Didot, 'Bodoni 72', Georgia, serif",
  garalde: "Garamond, 'Palatino Linotype', Georgia, serif",
  transitional: "Baskerville, Georgia, 'Times New Roman', serif",
  softSerif: "Georgia, 'Times New Roman', serif",
  editorialSerif: "Georgia, 'Times New Roman', serif",
  inscriptional: "Optima, Candara, 'Segoe UI', sans-serif",
  slab: "Rockwell, 'Roboto Slab', Georgia, serif",
  geometricSans: "Futura, 'Century Gothic', system-ui, sans-serif",
  humanistSans: "'Segoe UI', 'Gill Sans', system-ui, sans-serif",
  grotesk: "'Helvetica Neue', Arial, system-ui, sans-serif",
  softSans: "'Segoe UI', system-ui, sans-serif",
  condensedSans: "'Arial Narrow', 'Roboto Condensed', system-ui, sans-serif",
  display: 'system-ui, sans-serif',
  mono: "ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace",
};

export function fallbackStack(classification: Classification): string {
  return fallbackStacks[classification];
}

export function fontStack(font: FontRecord): string {
  return `'${font.family}', ${fallbackStack(font.classification)}`;
}

export function isSerif(classification: Classification): boolean {
  return ['didone', 'garalde', 'transitional', 'softSerif', 'editorialSerif', 'slab'].includes(classification);
}

/** Picks a heading weight the face can actually render, preferring the curated one. */
export function headingWeight(font: FontRecord): number {
  const wanted = font.headingWeight ?? (font.meta.variable ? 600 : 700);
  const wght = font.meta.axes['wght'];
  if (font.meta.variable && wght) return Math.min(wght.max, Math.max(wght.min, wanted));
  const weights = font.meta.weights;
  return weights.reduce((best, weight) => (Math.abs(weight - wanted) < Math.abs(best - wanted) ? weight : best), weights[0] ?? 400);
}

export const fontMetaGeneratedAt = meta.generatedAt;
