import { describe, expect, it } from 'vitest';
import {
  differenceRatio,
  hasInkAboveXHeight,
  inkBounds,
  lettersOf,
  looksIdentical,
  pairsForLanguage,
  type Bitmap,
} from './glyphCheck.ts';

function bitmap(rows: string[]): Bitmap {
  const width = rows[0]!.length;
  const alpha = rows.flatMap((row) => [...row].map((char) => (char === '#' ? 255 : 0)));
  return { width, height: rows.length, alpha };
}

describe('pairsForLanguage', () => {
  it('covers every Turkish pair from the specimen checklist', () => {
    const pairs = pairsForLanguage('tr').map((pair) => `${pair.glyph}/${pair.base}`);
    for (const expected of ['ı/i', 'İ/I', 'ş/s', 'Ş/S', 'ğ/g', 'Ğ/G', 'ç/c', 'Ç/C', 'ö/o', 'ü/u']) {
      expect(pairs).toContain(expected);
    }
  });

  it('decomposes Cyrillic and Greek accented letters', () => {
    expect(pairsForLanguage('ru').map((pair) => `${pair.glyph}/${pair.base}`)).toContain('й/и');
    expect(pairsForLanguage('el').map((pair) => `${pair.glyph}/${pair.base}`)).toContain('ά/α');
  });

  it('adds non-decomposing lookalikes', () => {
    expect(pairsForLanguage('pl').map((pair) => `${pair.glyph}/${pair.base}`)).toContain('ł/l');
  });

  it('has no pairs for plain English', () => {
    expect(pairsForLanguage('en')).toEqual([]);
  });
});

describe('lettersOf', () => {
  it('drops digits, spaces and punctuation', () => {
    expect(lettersOf('Aa Çç — 0123')).toEqual(['A', 'a', 'Ç', 'ç']);
  });
});

describe('bitmap comparison', () => {
  const i = bitmap(['..#..', '.....', '..#..', '..#..', '..#..']);
  const dotless = bitmap(['.....', '.....', '..#..', '..#..', '..#..']);

  it('finds ink bounds', () => {
    expect(inkBounds(dotless)).toEqual({ top: 2, bottom: 4, left: 2, right: 2 });
    expect(inkBounds(bitmap(['...']))).toBeNull();
  });

  it('treats identical renders as identical', () => {
    expect(differenceRatio(i, i)).toBe(0);
    expect(looksIdentical(i, i)).toBe(true);
  });

  it('sees the dot as a difference', () => {
    expect(looksIdentical(i, dotless)).toBe(false);
  });

  it('flags a dotless ı drawn with a dot above the x-height', () => {
    const x = bitmap(['.....', '.....', '#...#', '.#.#.', '#...#']);
    expect(hasInkAboveXHeight(i, x, 5)).toBe(true);
    expect(hasInkAboveXHeight(dotless, x, 5)).toBe(false);
  });
});
