import { describe, expect, it } from 'vitest';
import { presets } from '../data/presets.ts';
import { describeIssue, projectInputSchema } from './project.ts';
import { inputOf, projectFromPreset } from './projectOps.ts';

const validInput = () => structuredClone(inputOf(projectFromPreset(presets[0]!)));

describe('projectInputSchema', () => {
  it('trims text fields', () => {
    const input = validInput();
    input.name = '  Padded name  ';
    const result = projectInputSchema.safeParse(input);
    expect(result.success && result.data.name).toBe('Padded name');
  });

  it('rejects an empty headline and names the field', () => {
    const input = validInput();
    input.content.headline = '   ';
    const result = projectInputSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) expect(describeIssue(result.error)).toBe('content.headline (too_small)');
  });

  it('rejects colours that are not six-digit hex', () => {
    const input = validInput();
    input.theme.colors.accent = 'red';
    const result = projectInputSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) expect(describeIssue(result.error)).toBe('theme.colors.accent (invalid_format)');
  });

  it('enforces list sizes', () => {
    const input = validInput();
    input.content.services = input.content.services.slice(0, 2);
    expect(projectInputSchema.safeParse(input).success).toBe(false);
  });

  it('rejects unknown languages and font ids with markup', () => {
    const input = validInput();
    expect(projectInputSchema.safeParse({ ...input, languages: ['xx'] }).success).toBe(false);
    expect(projectInputSchema.safeParse({ ...input, excludedFonts: ['<img src=x>'] }).success).toBe(false);
  });
});
