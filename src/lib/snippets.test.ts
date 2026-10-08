import { describe, expect, it } from 'vitest';
import { getFont } from './fonts.ts';
import { cssVariablesSnippet, fontFaceSnippet, fontsourceSnippet, nextFontSnippet, selectionSummary } from './snippets.ts';

const fraunces = getFont('fraunces')!;
const abril = getFont('abril-fatface')!;
const dmSans = getFont('dm-sans')!;
const subsets = ['latin', 'latin-ext'] as const;

describe('snippets', () => {
  it('writes a next/font import with literal options', () => {
    const code = nextFontSnippet({ heading: fraunces, body: dmSans, subsets });
    expect(code).toContain("import { Fraunces, DM_Sans } from 'next/font/google';");
    expect(code).toContain("subsets: ['latin', 'latin-ext']");
    expect(code).toContain("variable: '--font-heading'");
    expect(code).not.toContain('weight:');
  });

  it('lists weights for static families', () => {
    expect(nextFontSnippet({ heading: abril, body: dmSans, subsets })).toContain("weight: ['400']");
  });

  it('uses variable Fontsource packages when available', () => {
    const { install, code } = fontsourceSnippet({ heading: fraunces, body: abril, subsets });
    expect(install).toBe('npm install @fontsource-variable/fraunces @fontsource/abril-fatface');
    expect(code).toContain("'Fraunces Variable'");
    expect(code).toContain("import '@fontsource/abril-fatface/400.css';");
  });

  it('writes @font-face rules only for requested subsets', () => {
    const css = fontFaceSnippet({ heading: fraunces, body: dmSans, subsets: ['latin'] });
    expect(css).toContain("src: url('/fonts/fraunces/latin-wght-normal.woff2')");
    expect(css).not.toContain('latin-ext-');
    expect(css).toContain('unicode-range: U+0000-00FF');
  });

  it('writes custom properties with fallbacks', () => {
    const css = cssVariablesSnippet({ heading: fraunces, body: dmSans, subsets });
    expect(css).toMatch(/--font-heading: 'Fraunces', .*serif;/);
    expect(css).toMatch(/--font-body: 'DM Sans', .*sans-serif;/);
  });

  it('formats the selection summary', () => {
    expect(selectionSummary('A', 'B', { heading: 'Heading', body: 'Body' })).toBe('Heading: A · Body: B');
  });
});
