import { languages, type LanguageCode } from '../data/languages.ts';
import { loadFont } from './fontLoader.ts';
import type { FontRecord } from './fonts.ts';
import {
  hasInkAboveXHeight,
  lettersForLanguages,
  looksIdentical,
  pairsForLanguages,
  type Bitmap,
  type GlyphIssue,
} from './glyphCheck.ts';

export const auditFontSize = 200;
const canvasWidth = 320;
const canvasHeight = 340;
const baseline = 250;

export interface GlyphAuditResult {
  fontId: string;
  issues: GlyphIssue[];
  checkedLetters: number;
  checkedPairs: number;
  loaded: boolean;
}

type Renderer = (text: string, family: string, fallback: string) => Bitmap;

function createRenderer(weight: number): Renderer {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D is not available.');
  return (text, family, fallback) => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = '#000';
    context.textBaseline = 'alphabetic';
    context.font = `${weight} ${auditFontSize}px "${family}", ${fallback}`;
    context.fillText(text, 40, baseline);
    const { data } = context.getImageData(0, 0, canvasWidth, canvasHeight);
    const alpha = new Uint8Array(canvasWidth * canvasHeight);
    for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3] ?? 0;
    return { width: canvasWidth, height: canvasHeight, alpha };
  };
}

function regularWeight(font: FontRecord): number {
  const wght = font.meta.axes['wght'];
  if (font.meta.variable && wght) return Math.min(wght.max, Math.max(wght.min, 400));
  return font.meta.weights.includes(400) ? 400 : (font.meta.weights[0] ?? 400);
}

export async function auditFont(font: FontRecord, codes: readonly LanguageCode[]): Promise<GlyphAuditResult> {
  const letters = lettersForLanguages(codes);
  const pairs = pairsForLanguages(codes);
  const weight = regularWeight(font);
  const sampleText = [...new Set([...letters, ...pairs.map((pair) => pair.base), 'x'])].join('');
  const loaded = await loadFont(font, sampleText, weight);
  const render = createRenderer(weight);
  const issues: GlyphIssue[] = [];

  // With the family present, the fallback never shows; differing renders
  // under two unrelated fallbacks mean the glyph is not in the font.
  const missing = new Set<string>();
  for (const letter of letters) {
    const withMono = render(letter, font.family, 'monospace');
    const withSerif = render(letter, font.family, 'serif');
    if (!looksIdentical(withMono, withSerif)) missing.add(letter);
  }
  for (const code of codes) {
    for (const letter of letters) {
      if (missing.has(letter) && languages[code].charset.includes(letter) && !issues.some((issue) => issue.glyph === letter)) {
        issues.push({ kind: 'missing', glyph: letter, language: code });
      }
    }
  }

  for (const pair of pairs) {
    if (missing.has(pair.glyph) || missing.has(pair.base)) continue;
    if (looksIdentical(render(pair.glyph, font.family, 'monospace'), render(pair.base, font.family, 'monospace'))) {
      issues.push({ kind: 'identical', glyph: pair.glyph, base: pair.base, language: pair.language });
    }
  }

  const dotlessCode = codes.find((code) => languages[code].checkDotlessI);
  if (dotlessCode && !missing.has('ı')) {
    const dotless = render('ı', font.family, 'monospace');
    const x = render('x', font.family, 'monospace');
    if (hasInkAboveXHeight(dotless, x, auditFontSize) && !issues.some((issue) => issue.glyph === 'ı')) {
      issues.push({ kind: 'dotted', glyph: 'ı', language: dotlessCode });
    }
  }

  return { fontId: font.id, issues, checkedLetters: letters.length, checkedPairs: pairs.length, loaded };
}
