import type { Classification, FontRole, LocalizedText, Subset, Tone } from '../data/types.ts';

export interface PickerFont {
  id: string;
  classification: Classification;
  roles: readonly FontRole[];
  tones: readonly Tone[];
  ubiquitous?: boolean;
  caveat?: LocalizedText;
  glyphIssues?: readonly string[];
  meta: { subsets: readonly Subset[]; variable: boolean; italic: boolean };
}

export type HeadingGroup =
  | 'didone'
  | 'classicSerif'
  | 'softSerif'
  | 'editorialSerif'
  | 'inscriptional'
  | 'slab'
  | 'geometric'
  | 'grotesk'
  | 'condensed'
  | 'display'
  | 'mono';

export type BodyGroup = 'geometric' | 'humanist' | 'grotesk' | 'soft' | 'serif' | 'mono';

const headingGroups: Record<Classification, HeadingGroup> = {
  didone: 'didone',
  garalde: 'classicSerif',
  transitional: 'classicSerif',
  softSerif: 'softSerif',
  editorialSerif: 'editorialSerif',
  inscriptional: 'inscriptional',
  slab: 'slab',
  geometricSans: 'geometric',
  humanistSans: 'grotesk',
  grotesk: 'grotesk',
  softSans: 'geometric',
  condensedSans: 'condensed',
  display: 'display',
  mono: 'mono',
};

const bodyGroups: Record<Classification, BodyGroup> = {
  didone: 'serif',
  garalde: 'serif',
  transitional: 'serif',
  softSerif: 'serif',
  editorialSerif: 'serif',
  inscriptional: 'humanist',
  slab: 'serif',
  geometricSans: 'geometric',
  humanistSans: 'humanist',
  grotesk: 'grotesk',
  softSans: 'soft',
  condensedSans: 'grotesk',
  display: 'grotesk',
  mono: 'mono',
};

export function groupOf(role: FontRole, classification: Classification): HeadingGroup | BodyGroup {
  return role === 'heading' ? headingGroups[classification] : bodyGroups[classification];
}

export const candidateCount = 10;
const maxPerGroup = 3;
const toneMatchWeight = 3;

export function toneMatches(font: PickerFont, tones: readonly Tone[]): number {
  return font.tones.filter((tone) => tones.includes(tone)).length;
}

export function scoreFont(font: PickerFont, role: FontRole, tones: readonly Tone[]): number {
  const primaryTone = tones[0];
  let score = toneMatches(font, tones) * toneMatchWeight;
  if (primaryTone && font.tones.includes(primaryTone)) score += 1;
  if (font.meta.variable) score += 0.5;
  if (font.meta.italic) score += role === 'body' ? 0.75 : 0.25;
  if (font.ubiquitous) score -= 4;
  if (font.caveat) score -= 0.75;
  return score;
}

export function isEligible(
  font: PickerFont,
  role: FontRole,
  subsets: readonly Subset[],
  excluded: readonly string[] = [],
  languages: readonly string[] = [],
): boolean {
  return (
    font.roles.includes(role) &&
    !excluded.includes(font.id) &&
    subsets.every((subset) => font.meta.subsets.includes(subset)) &&
    !(font.glyphIssues ?? []).some((language) => languages.includes(language))
  );
}

export interface SuggestOptions {
  role: FontRole;
  tones: readonly Tone[];
  subsets: readonly Subset[];
  /** Site languages; faces with known glyph problems in any of them are skipped. */
  languages?: readonly string[];
  current?: string | null;
  excluded?: readonly string[];
  /** Ids the user explicitly kept; they stay in the list. */
  keep?: readonly string[];
  count?: number;
}

/**
 * Returns up to `count` ids: the current font first, then a spread across
 * design families so the comparison never collapses into ten similar faces.
 */
export function suggestCandidates(fonts: readonly PickerFont[], options: SuggestOptions): string[] {
  const { role, tones, subsets, languages = [], current, excluded = [], keep = [], count = candidateCount } = options;
  const byId = new Map(fonts.map((font) => [font.id, font]));
  const picked: string[] = [];
  const add = (id: string) => {
    if (picked.length < count && !picked.includes(id) && byId.has(id)) picked.push(id);
  };

  if (current) add(current);
  for (const id of keep) add(id);

  const ranked = fonts
    .map((font, index) => ({ font, index, score: scoreFont(font, role, tones) }))
    .filter(({ font }) => isEligible(font, role, subsets, excluded, languages))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const groupCount = (group: string) =>
    picked.filter((id) => {
      const font = byId.get(id);
      return font !== undefined && groupOf(role, font.classification) === group;
    }).length;

  const fitting = ranked.filter(({ font }) => !font.ubiquitous && toneMatches(font, tones) > 0);

  // Pass 1: the best fitting face of every design family.
  const seenGroups = new Set<string>();
  for (const { font } of fitting) {
    const group = groupOf(role, font.classification);
    if (seenGroups.has(group)) continue;
    seenGroups.add(group);
    if (groupCount(group) === 0) add(font.id);
  }

  // Pass 2: fill by score while keeping any one family from dominating.
  for (const { font } of fitting) {
    if (groupCount(groupOf(role, font.classification)) < maxPerGroup) add(font.id);
  }

  // Later passes only run when still short: relax the tone fit, then allow
  // ubiquitous defaults, and drop the family cap only as a last resort.
  const underCap = (font: PickerFont) => groupCount(groupOf(role, font.classification)) < maxPerGroup;
  for (const { font } of ranked) if (!font.ubiquitous && underCap(font)) add(font.id);
  for (const { font } of ranked) if (underCap(font)) add(font.id);
  for (const { font } of ranked) add(font.id);

  const scoreOf = (id: string) => {
    const font = byId.get(id);
    return font ? scoreFont(font, role, tones) : 0;
  };
  const head = current && picked[0] === current ? [current] : [];
  const rest = picked.filter((id) => !head.includes(id)).sort((a, b) => scoreOf(b) - scoreOf(a));
  return [...head, ...rest];
}

export interface PairOptions {
  heading: readonly string[];
  body: readonly string[];
  tones: readonly Tone[];
  currentHeading?: string | null;
  currentBody?: string | null;
}

const serifClasses: readonly Classification[] = ['didone', 'garalde', 'transitional', 'softSerif', 'editorialSerif', 'slab'];

export function pairBonus(heading: PickerFont, body: PickerFont): number {
  if (heading.id === body.id) return -10;
  const headingSerif = serifClasses.includes(heading.classification);
  const bodySerif = serifClasses.includes(body.classification);
  if (headingSerif && !bodySerif) return 2;
  if (!headingSerif && bodySerif) return 1;
  if (groupOf('body', heading.classification) === groupOf('body', body.classification)) return -1;
  return 0.5;
}

/** Recommends a heading/body pair from the candidate lists, favouring contrast between them. */
export function recommendPair(
  fonts: readonly PickerFont[],
  options: PairOptions,
): { heading: string | null; body: string | null } {
  const byId = new Map(fonts.map((font) => [font.id, font]));
  const resolve = (ids: readonly string[]) => ids.map((id) => byId.get(id)).filter((font): font is PickerFont => !!font);
  const headings = resolve(options.heading);
  const bodies = resolve(options.body);

  const pickBest = <T extends PickerFont>(list: T[], score: (font: T) => number, current?: string | null) =>
    [...list].sort((a, b) => {
      const diff = score(b) - score(a);
      if (diff !== 0) return diff;
      return Number(a.id === current) - Number(b.id === current);
    })[0];

  const heading = pickBest(headings, (font) => scoreFont(font, 'heading', options.tones), options.currentHeading);
  const body = heading
    ? pickBest(bodies, (font) => scoreFont(font, 'body', options.tones) + pairBonus(heading, font), options.currentBody)
    : pickBest(bodies, (font) => scoreFont(font, 'body', options.tones), options.currentBody);

  return { heading: heading?.id ?? null, body: body?.id ?? null };
}
