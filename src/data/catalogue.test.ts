import { describe, expect, it } from 'vitest';
import rawMeta from '../generated/fontMeta.json';
import { requiredSubsets } from './languages.ts';
import { presets } from './presets.ts';
import { catalogue } from './catalogue.ts';
import type { FontMetaFile } from './types.ts';
import { getFont } from '../lib/fonts.ts';
import { projectFromPreset } from '../lib/projectOps.ts';
import { projectSchema } from '../lib/project.ts';

const meta = rawMeta as FontMetaFile;

describe('catalogue', () => {
  it('has unique ids, each with downloaded metadata and a licence', () => {
    const ids = catalogue.map((font) => font.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      const font = meta.fonts[id];
      expect(font, id).toBeDefined();
      expect(font!.files.length, id).toBeGreaterThan(0);
      expect(font!.license, id).toMatch(/^(OFL-1\.1|Apache-2\.0)$/);
      expect(font!.copyright, id).not.toMatch(/^Copyright the .* project authors$/);
    }
  });

  it('writes a note in both languages for every font', () => {
    for (const font of catalogue) {
      expect(font.note.tr.length, font.id).toBeGreaterThan(20);
      expect(font.note.en.length, font.id).toBeGreaterThan(20);
    }
  });

  it('has at least ten Turkish-capable faces for each role', () => {
    const turkish = requiredSubsets(['tr']);
    for (const role of ['heading', 'body'] as const) {
      const count = catalogue.filter(
        (font) => font.roles.includes(role) && !font.ubiquitous && turkish.every((subset) => meta.fonts[font.id]?.subsets.includes(subset)),
      ).length;
      expect(count, role).toBeGreaterThanOrEqual(10);
    }
  });
});

describe('presets', () => {
  it.each(presets.map((preset) => [preset.id, preset] as const))('%s builds a complete, valid project', (_id, preset) => {
    const project = projectFromPreset(preset);
    expect(projectSchema.safeParse(project).success).toBe(true);
    expect(project.candidates.heading).toHaveLength(10);
    expect(project.candidates.body).toHaveLength(10);
    expect(project.selection.heading).not.toBeNull();
    expect(project.selection.body).not.toBeNull();
    if (preset.project.currentFonts.heading) expect(project.candidates.heading).toContain(preset.project.currentFonts.heading);
    if (preset.project.currentFonts.body) expect(project.candidates.body).toContain(preset.project.currentFonts.body);
    const subsets = requiredSubsets(project.languages);
    for (const id of [...project.candidates.heading, ...project.candidates.body]) {
      if (id === preset.project.currentFonts.heading || id === preset.project.currentFonts.body) continue;
      expect(subsets.every((subset) => getFont(id)!.meta.subsets.includes(subset)), id).toBe(true);
    }
  });
});
