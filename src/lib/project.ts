// zod/mini tree-shakes; the classic chained API pulls the whole library into the entry chunk.
import { z } from 'zod/mini';
import { languageCodes } from '../data/languages.ts';
import { tones } from '../data/types.ts';

const hexColor = z.string().check(z.regex(/^#[0-9a-fA-F]{6}$/));
const fontId = z.string().check(z.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), z.maxLength(64));
const line = (max: number, min = 0) => z.string().check(z.trim(), z.minLength(min), z.maxLength(max));
const sized = <T extends z.ZodMiniType>(item: T, min: number, max: number) =>
  z.array(item).check(z.minLength(min), z.maxLength(max));

export const colorTokens = [
  'background',
  'surface',
  'text',
  'muted',
  'accent',
  'accentText',
  'contrastBackground',
  'contrastText',
  'border',
] as const;

export type ColorToken = (typeof colorTokens)[number];

export const themeSchema = z.object({
  colors: z.object(Object.fromEntries(colorTokens.map((token) => [token, hexColor])) as Record<ColorToken, typeof hexColor>),
  radius: z.object({
    control: z.int().check(z.minimum(0), z.maximum(999)),
    card: z.int().check(z.minimum(0), z.maximum(48)),
  }),
  headingTransform: z.enum(['none', 'uppercase']),
});

export const contentSchema = z.object({
  headline: line(160, 1),
  intro: line(420),
  primaryAction: line(40),
  secondaryAction: line(40),
  facts: sized(z.object({ value: line(16), label: line(60) }), 2, 3),
  services: sized(z.object({ title: line(60), description: line(220) }), 3, 3),
  contrastHeading: line(140),
  contrastQuestion: line(160),
  chips: sized(line(32), 1, 6),
  textHeading: line(140),
  textBody: line(1200),
  labelLine: line(90),
  tableTitle: line(60),
  table: sized(z.object({ label: line(40), value: line(40) }), 4, 4),
});

/** Everything a user can describe about their site; shared by presets, imports and share links. */
export const projectInputSchema = z.object({
  name: line(80, 1),
  languages: sized(z.enum(languageCodes), 1, 8),
  tones: sized(z.enum(tones), 1, 4),
  theme: themeSchema,
  currentFonts: z.object({ heading: z.nullable(fontId), body: z.nullable(fontId) }),
  excludedFonts: sized(fontId, 0, 100),
  content: contentSchema,
  candidates: z.object({ heading: sized(fontId, 0, 10), body: sized(fontId, 0, 10) }),
  notes: z.record(fontId, line(240)),
  selection: z.object({ heading: z.nullable(fontId), body: z.nullable(fontId) }),
});

export const projectSchema = z.extend(projectInputSchema, {
  schemaVersion: z.literal(1),
  id: z.string().check(z.regex(/^[a-z0-9-]{1,64}$/)),
  updatedAt: z.string().check(z.maxLength(40)),
});

export type Theme = z.infer<typeof themeSchema>;
export type ProjectContent = z.infer<typeof contentSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type Project = z.infer<typeof projectSchema>;

/** zod/mini ships no message locale, so point at the field instead: "content.headline (too_big)". */
export function describeIssue(error: z.core.$ZodError): string {
  const issue = error.issues[0];
  if (!issue) return 'invalid data';
  const path = issue.path.map(String).join('.') || 'root';
  return `${path} (${issue.code})`;
}

export function createProjectId(): string {
  return crypto.randomUUID();
}
