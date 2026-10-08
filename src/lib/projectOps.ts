import { requiredSubsets } from '../data/languages.ts';
import type { Preset } from '../data/presets.ts';
import type { ContentLocale, FontRole, Locale } from '../data/types.ts';

const newProjectName: Record<Locale, string> = {
  tr: 'Yeni proje',
  en: 'New project',
  de: 'Neues Projekt',
  fr: 'Nouveau projet',
  es: 'Proyecto nuevo',
  it: 'Nuovo progetto',
  pt: 'Novo projeto',
  nl: 'Nieuw project',
  sv: 'Nytt projekt',
  pl: 'Nowy projekt',
  cs: 'Nový projekt',
  ro: 'Proiect nou',
  hu: 'Új projekt',
  ru: 'Новый проект',
  uk: 'Новий проєкт',
  el: 'Νέο έργο',
};
import { fonts, getFont } from './fonts.ts';
import { recommendPair, suggestCandidates } from './picker.ts';
import { createProjectId, projectSchema, type Project, type ProjectInput } from './project.ts';

function knownOrNull(id: string | null): string | null {
  return id && getFont(id) ? id : null;
}

export function suggestFor(input: ProjectInput, role: FontRole, keep: readonly string[] = []): string[] {
  return suggestCandidates(fonts, {
    role,
    tones: input.tones,
    subsets: requiredSubsets(input.languages),
    languages: input.languages,
    current: knownOrNull(input.currentFonts[role]),
    excluded: input.excludedFonts,
    keep: keep.filter((id) => getFont(id)),
  });
}

export function recommendedPairFor(input: ProjectInput): { heading: string | null; body: string | null } {
  return recommendPair(fonts, {
    heading: input.candidates.heading,
    body: input.candidates.body,
    tones: input.tones,
    currentHeading: input.currentFonts.heading,
    currentBody: input.currentFonts.body,
  });
}

/**
 * Brings any input (preset, import, share link, older save) into a usable
 * state: unknown fonts dropped, both lists filled, selection inside the lists.
 */
export function normalizeInput(input: ProjectInput): ProjectInput {
  const currentFonts = {
    heading: knownOrNull(input.currentFonts.heading),
    body: knownOrNull(input.currentFonts.body),
  };
  const base: ProjectInput = {
    ...input,
    currentFonts,
    excludedFonts: input.excludedFonts.filter((id) => getFont(id)),
    notes: Object.fromEntries(Object.entries(input.notes).filter(([id, note]) => getFont(id) && note.trim() !== '')),
  };
  const candidates = {
    heading: suggestFor(base, 'heading', input.candidates.heading),
    body: suggestFor(base, 'body', input.candidates.body),
  };
  const withCandidates = { ...base, candidates };
  const recommended = recommendedPairFor(withCandidates);
  const selection = {
    heading: input.selection.heading && candidates.heading.includes(input.selection.heading) ? input.selection.heading : recommended.heading,
    body: input.selection.body && candidates.body.includes(input.selection.body) ? input.selection.body : recommended.body,
  };
  return { ...withCandidates, selection };
}

export function toProject(input: ProjectInput, id: string = createProjectId()): Project {
  return projectSchema.parse({
    ...normalizeInput(input),
    schemaVersion: 1,
    id,
    updatedAt: new Date().toISOString(),
  });
}

export function projectFromPreset(preset: Preset): Project {
  return toProject({
    ...structuredClone(preset.project),
    excludedFonts: [],
    candidates: { heading: [], body: [] },
    notes: {},
    selection: { heading: null, body: null },
  });
}

export function inputOf(project: Project): ProjectInput {
  const { schemaVersion: _version, id: _id, updatedAt: _updatedAt, ...input } = project;
  return input;
}

const blankContent: Record<ContentLocale, ProjectInput['content']> = {
  tr: {
    headline: 'Ana sayfanızdaki başlığı buraya yazın.',
    intro: 'Sitenizin giriş cümlesini ekleyin. Önizleme gerçek metinle çok daha doğru sonuç verir.',
    primaryAction: 'Birincil düğme',
    secondaryAction: 'İkincil düğme',
    facts: [
      { value: '12', label: 'ilk sayısal bilgi' },
      { value: '2026', label: 'ikinci sayısal bilgi' },
    ],
    services: [
      { title: 'Birinci hizmet', description: 'Bu hizmeti bir cümleyle anlatın.' },
      { title: 'İkinci hizmet', description: 'Bu hizmeti bir cümleyle anlatın.' },
      { title: 'Üçüncü hizmet', description: 'Bu hizmeti bir cümleyle anlatın.' },
    ],
    contrastHeading: 'Koyu bölümdeki başlık',
    contrastQuestion: 'Ziyaretçiye sorduğunuz soru',
    chips: ['Etiket', 'Etiket', 'Etiket'],
    textHeading: 'Metin bölümünün başlığı',
    textBody: 'Sitenizden üç dört cümlelik gerçek bir paragraf yapıştırın. Gövde yazısının ritmi en iyi uzun metinde görünür.',
    labelLine: 'Kısa · Etiket · Satırı',
    tableTitle: 'Küçük tablo',
    table: [
      { label: 'Birinci satır', value: '09:00–18:00' },
      { label: 'İkinci satır', value: '10:00–16:00' },
      { label: 'Üçüncü satır', value: '1.250' },
      { label: 'Dördüncü satır', value: '%25' },
    ],
  },
  en: {
    headline: 'Write the headline from your home page here.',
    intro: 'Add your site’s introductory sentence. The preview is far more telling with real copy.',
    primaryAction: 'Primary button',
    secondaryAction: 'Secondary button',
    facts: [
      { value: '12', label: 'first numeric fact' },
      { value: '2026', label: 'second numeric fact' },
    ],
    services: [
      { title: 'First service', description: 'Describe this service in one sentence.' },
      { title: 'Second service', description: 'Describe this service in one sentence.' },
      { title: 'Third service', description: 'Describe this service in one sentence.' },
    ],
    contrastHeading: 'Heading on the dark section',
    contrastQuestion: 'A question you ask visitors',
    chips: ['Label', 'Label', 'Label'],
    textHeading: 'Heading for the text section',
    textBody: 'Paste a real three or four sentence paragraph from your site. The rhythm of body text only shows in longer copy.',
    labelLine: 'Short · Label · Line',
    tableTitle: 'Small table',
    table: [
      { label: 'First row', value: '9:00–18:00' },
      { label: 'Second row', value: '10:00–16:00' },
      { label: 'Third row', value: '1,250' },
      { label: 'Fourth row', value: '25%' },
    ],
  },
};

export function blankProject(locale: Locale): Project {
  return toProject({
    name: newProjectName[locale],
    languages: [locale],
    tones: ['modern', 'friendly'],
    theme: {
      colors: {
        background: '#ffffff',
        surface: '#f5f5f4',
        text: '#1c1917',
        muted: '#57534e',
        accent: '#1c1917',
        accentText: '#ffffff',
        contrastBackground: '#1c1917',
        contrastText: '#fafaf9',
        border: '#e7e5e4',
      },
      radius: { control: 8, card: 12 },
      headingTransform: 'none',
    },
    currentFonts: { heading: null, body: null },
    excludedFonts: [],
    content: structuredClone(blankContent[locale === 'tr' ? 'tr' : 'en']),
    candidates: { heading: [], body: [] },
    notes: {},
    selection: { heading: null, body: null },
  });
}
