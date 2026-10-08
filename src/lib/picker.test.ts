import { describe, expect, it } from 'vitest';
import { requiredSubsets } from '../data/languages.ts';
import { fonts, getFont } from './fonts.ts';
import { groupOf, isEligible, pairBonus, recommendPair, scoreFont, suggestCandidates, type PickerFont } from './picker.ts';

const turkish = requiredSubsets(['tr']);

describe('suggestCandidates', () => {
  it('returns ten distinct heading faces that all cover Turkish', () => {
    const ids = suggestCandidates(fonts, { role: 'heading', tones: ['warm', 'friendly'], subsets: turkish });
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
    for (const id of ids) expect(getFont(id)?.meta.subsets).toContain('latin-ext');
  });

  it('never lets one design family take more than three places', () => {
    for (const role of ['heading', 'body'] as const) {
      const ids = suggestCandidates(fonts, { role, tones: ['luxurious'], subsets: turkish });
      const counts = new Map<string, number>();
      for (const id of ids) {
        const group = groupOf(role, getFont(id)!.classification);
        counts.set(group, (counts.get(group) ?? 0) + 1);
      }
      expect(Math.max(...counts.values())).toBeLessThanOrEqual(3);
    }
  });

  it('spreads heading suggestions across several families', () => {
    const ids = suggestCandidates(fonts, { role: 'heading', tones: ['editorial', 'modern'], subsets: turkish });
    const groups = new Set(ids.map((id) => groupOf('heading', getFont(id)!.classification)));
    expect(groups.size).toBeGreaterThanOrEqual(5);
  });

  it('puts the current font first even when it is ubiquitous', () => {
    const ids = suggestCandidates(fonts, { role: 'body', tones: ['technical'], subsets: turkish, current: 'inter' });
    expect(ids[0]).toBe('inter');
  });

  it('skips ubiquitous defaults unless they are current', () => {
    const ids = suggestCandidates(fonts, { role: 'body', tones: ['friendly', 'modern'], subsets: turkish });
    for (const id of ids) expect(getFont(id)?.ubiquitous).toBeFalsy();
  });

  it('respects exclusions and keeps explicitly kept fonts', () => {
    const ids = suggestCandidates(fonts, {
      role: 'heading',
      tones: ['luxurious'],
      subsets: turkish,
      excluded: ['playfair-display'],
      keep: ['bagel-fat-one'],
    });
    expect(ids).not.toContain('playfair-display');
    expect(ids).toContain('bagel-fat-one');
  });

  it('leaves out faces without the needed subset', () => {
    const ids = suggestCandidates(fonts, { role: 'heading', tones: ['luxurious', 'classic'], subsets: turkish });
    expect(ids).not.toContain('prata');
  });

  it('never suggests faces with known glyph problems for the site languages', () => {
    const ids = suggestCandidates(fonts, {
      role: 'heading',
      tones: ['luxurious', 'calm'],
      subsets: turkish,
      languages: ['tr'],
      keep: [],
    });
    expect(ids).not.toContain('tenor-sans');
    const tenor = getFont('tenor-sans');
    expect(tenor).toBeDefined();
    expect(isEligible(tenor!, 'heading', ['latin'], [], ['en'])).toBe(true);
    expect(isEligible(tenor!, 'heading', turkish, [], ['tr'])).toBe(false);
    for (const id of ['assistant', 'expletus-sans', 'ballet']) {
      const font = getFont(id);
      expect(font, id).toBeDefined();
      const role = font!.roles[0] ?? 'heading';
      expect(isEligible(font!, role, turkish, [], ['tr']), id).toBe(false);
      expect(isEligible(font!, role, ['latin'], [], ['en']), id).toBe(true);
    }
  });

  it('is deterministic', () => {
    const options = { role: 'body' as const, tones: ['calm' as const], subsets: turkish };
    expect(suggestCandidates(fonts, options)).toEqual(suggestCandidates(fonts, options));
  });
});

describe('scoring and pairing', () => {
  const base: PickerFont = {
    id: 'a',
    classification: 'grotesk',
    roles: ['body'],
    tones: ['modern', 'calm'],
    meta: { subsets: ['latin'], variable: false, italic: false },
  };

  it('rewards tone matches and the primary tone', () => {
    expect(scoreFont(base, 'body', ['modern', 'playful'])).toBeGreaterThan(scoreFont(base, 'body', ['playful', 'modern']));
    expect(scoreFont(base, 'body', ['modern', 'calm'])).toBeGreaterThan(scoreFont(base, 'body', ['playful']));
  });

  it('penalises ubiquitous faces', () => {
    expect(scoreFont({ ...base, ubiquitous: true }, 'body', ['modern'])).toBeLessThan(scoreFont(base, 'body', ['modern']));
  });

  it('checks role and subsets for eligibility', () => {
    expect(isEligible(base, 'heading', ['latin'])).toBe(false);
    expect(isEligible(base, 'body', ['latin', 'latin-ext'])).toBe(false);
    expect(isEligible(base, 'body', ['latin'])).toBe(true);
  });

  it('prefers a sans body under a serif heading', () => {
    const serif = { ...base, id: 's', classification: 'didone' as const };
    expect(pairBonus(serif, base)).toBeGreaterThan(pairBonus(serif, { ...base, id: 'b', classification: 'garalde' }));
    expect(pairBonus(base, base)).toBeLessThan(0);
  });

  it('recommends a pair from the given lists', () => {
    const heading = suggestCandidates(fonts, { role: 'heading', tones: ['warm'], subsets: turkish });
    const body = suggestCandidates(fonts, { role: 'body', tones: ['warm'], subsets: turkish });
    const pair = recommendPair(fonts, { heading, body, tones: ['warm'] });
    expect(heading).toContain(pair.heading);
    expect(body).toContain(pair.body);
    expect(pair.heading).not.toBe(pair.body);
  });
});
