/** Languages the interface can be shown in. Keep this identical to `languageCodes`. */
export type Locale =
  | 'tr'
  | 'en'
  | 'de'
  | 'fr'
  | 'es'
  | 'it'
  | 'pt'
  | 'nl'
  | 'sv'
  | 'pl'
  | 'cs'
  | 'ro'
  | 'hu'
  | 'ru'
  | 'uk'
  | 'el';

/** Catalogue notes and presets are written in these two languages. */
export type ContentLocale = 'tr' | 'en';

export type LocalizedText = Record<ContentLocale, string>;

export type FontRole = 'heading' | 'body';

export type Classification =
  | 'didone'
  | 'garalde'
  | 'transitional'
  | 'softSerif'
  | 'editorialSerif'
  | 'inscriptional'
  | 'slab'
  | 'geometricSans'
  | 'humanistSans'
  | 'grotesk'
  | 'softSans'
  | 'condensedSans'
  | 'display'
  | 'mono';

export const tones = [
  'luxurious',
  'editorial',
  'classic',
  'calm',
  'warm',
  'friendly',
  'playful',
  'bold',
  'modern',
  'technical',
  'institutional',
] as const;

export type Tone = (typeof tones)[number];

export type Subset = 'latin' | 'latin-ext' | 'cyrillic' | 'cyrillic-ext' | 'greek' | 'greek-ext';

export type FontStyle = 'normal' | 'italic';

export interface FontFileMeta {
  subset: Subset;
  style: FontStyle;
  /** CSS font-weight descriptor: "400" or a variable range like "100 900". */
  weight: string;
  file: string;
  bytes: number;
}

export interface VariableAxis {
  min: number;
  max: number;
  default: number;
}

export interface FontMeta {
  family: string;
  license: string;
  version: string;
  lastModified: string;
  npmPackage: string;
  npmVersion: string;
  cdnBase: string;
  source: string;
  licenseUrl: string;
  copyright: string;
  subsets: Subset[];
  variable: boolean;
  axes: Record<string, VariableAxis>;
  weights: number[];
  italic: boolean;
  files: FontFileMeta[];
  /** Only present when a subset's range differs from the shared default. */
  unicodeRange?: Partial<Record<Subset, string>>;
}

export interface FontMetaFile {
  generatedAt: string;
  subsetRanges: Record<Subset, string>;
  fonts: Record<string, FontMeta>;
}

export interface CatalogueFont {
  /** Fontsource id, also used as the folder name under public/fonts. */
  id: string;
  family: string;
  classification: Classification;
  roles: readonly FontRole[];
  tones: readonly Tone[];
  note: LocalizedText;
  /** Seen on so many sites that it rarely gives a brand its own voice. */
  ubiquitous?: boolean;
  /** Weight used for headings when the face is variable or has several weights. */
  headingWeight?: number;
  caveat?: LocalizedText;
  /**
   * Languages whose letters this face draws wrongly despite listing the
   * subset, as found by the glyph audit. Never suggested for them.
   */
  glyphIssues?: readonly string[];
}
