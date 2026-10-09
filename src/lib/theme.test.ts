import { describe, expect, it } from 'vitest';
import { resolveTheme } from './theme.ts';

describe('resolveTheme', () => {
  it('follows the system when the choice is system', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('keeps an explicit choice', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});
