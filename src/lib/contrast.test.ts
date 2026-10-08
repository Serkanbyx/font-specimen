import { describe, expect, it } from 'vitest';
import { contrastLevel, contrastRatio, parseHex } from './contrast.ts';

describe('contrast', () => {
  it('matches the WCAG extremes', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#1d4ed8', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#1d4ed8'), 10);
  });

  it('classifies levels', () => {
    expect(contrastLevel(7.2)).toBe('AAA');
    expect(contrastLevel(4.6)).toBe('AA');
    expect(contrastLevel(3.1)).toBe('AA-large');
    expect(contrastLevel(2)).toBe('fail');
  });

  it('rejects malformed colours', () => {
    expect(parseHex('#fff')).toBeNull();
    expect(parseHex('red')).toBeNull();
  });
});
