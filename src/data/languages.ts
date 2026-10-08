import type { Locale, LocalizedText, Subset } from './types.ts';

export const languageCodes = [
  'tr',
  'en',
  'de',
  'fr',
  'es',
  'it',
  'pt',
  'nl',
  'sv',
  'pl',
  'cs',
  'ro',
  'hu',
  'ru',
  'uk',
  'el',
] as const;

export type LanguageCode = (typeof languageCodes)[number];

export interface GlyphPairDefinition {
  glyph: string;
  base: string;
}

export interface LanguageInfo {
  code: LanguageCode;
  name: LocalizedText;
  nativeName: string;
  /** Subsets a font must ship, besides `latin`, to set this language. */
  subsets: readonly Subset[];
  /** Letters the language adds to the basic Latin alphabet, plus digits. */
  charset: string;
  pangram: string;
  /** Letters whose shape must differ from a lookalike but do not decompose under NFD. */
  extraPairs?: readonly GlyphPairDefinition[];
  /** The dotless ı must have no ink above the x-height. */
  checkDotlessI?: boolean;
}

const digits = '0123456789';

export const languages: Record<LanguageCode, LanguageInfo> = {
  tr: {
    code: 'tr',
    name: { tr: 'Türkçe', en: 'Turkish' },
    nativeName: 'Türkçe',
    subsets: ['latin-ext'],
    charset: `Aa Çç Ğğ Iı İi Öö Şş Üü — ${digits}`,
    pangram: 'Pijamalı hasta yağız şoföre çabucak güvendi.',
    extraPairs: [{ glyph: 'ı', base: 'i' }],
    checkDotlessI: true,
  },
  en: {
    code: 'en',
    name: { tr: 'İngilizce', en: 'English' },
    nativeName: 'English',
    subsets: [],
    charset: `Aa Bb Gg Qq Rr & ? ! “ ” — ${digits}`,
    pangram: 'The quick brown fox jumps over the lazy dog.',
  },
  de: {
    code: 'de',
    name: { tr: 'Almanca', en: 'German' },
    nativeName: 'Deutsch',
    subsets: [],
    charset: `Ää Öö Üü ß „ “ — ${digits}`,
    pangram: 'Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.',
  },
  fr: {
    code: 'fr',
    name: { tr: 'Fransızca', en: 'French' },
    nativeName: 'Français',
    subsets: [],
    charset: `Àà Ââ Çç Éé Èè Êê Ëë Îî Ïï Ôô Œœ Ùù Ûû « » — ${digits}`,
    pangram: 'Voix ambiguë d’un cœur qui, au zéphyr, préfère les jattes de kiwis.',
  },
  es: {
    code: 'es',
    name: { tr: 'İspanyolca', en: 'Spanish' },
    nativeName: 'Español',
    subsets: [],
    charset: `Áá Éé Íí Ññ Óó Úú Üü ¿ ¡ — ${digits}`,
    pangram: 'El veloz murciélago hindú comía feliz cardillo y kiwi.',
  },
  it: {
    code: 'it',
    name: { tr: 'İtalyanca', en: 'Italian' },
    nativeName: 'Italiano',
    subsets: [],
    charset: `Àà Èè Éé Ìì Òò Ùù — ${digits}`,
    pangram: 'Quel vituperabile xenofobo zelante assaggia il whisky ed esclama: alleluja!',
  },
  pt: {
    code: 'pt',
    name: { tr: 'Portekizce', en: 'Portuguese' },
    nativeName: 'Português',
    subsets: [],
    charset: `Áá Ââ Ãã Àà Çç Éé Êê Íí Óó Ôô Õõ Úú — ${digits}`,
    pangram: 'Zebras caolhas de Java querem passar fax para moças gigantes de New York.',
  },
  nl: {
    code: 'nl',
    name: { tr: 'Felemenkçe', en: 'Dutch' },
    nativeName: 'Nederlands',
    subsets: [],
    charset: `IJ ij Éé Ëë Ïï Öö — ${digits}`,
    pangram: 'Pa’s wijze lynx bezag vroom het fikse aquaduct.',
  },
  sv: {
    code: 'sv',
    name: { tr: 'İsveççe', en: 'Swedish' },
    nativeName: 'Svenska',
    subsets: [],
    charset: `Åå Ää Öö — ${digits}`,
    pangram: 'Flygande bäckasiner söka hwila på mjuka tuvor.',
  },
  pl: {
    code: 'pl',
    name: { tr: 'Lehçe', en: 'Polish' },
    nativeName: 'Polski',
    subsets: ['latin-ext'],
    charset: `Ąą Ćć Ęę Łł Ńń Óó Śś Źź Żż — ${digits}`,
    pangram: 'Pchnąć w tę łódź jeża lub ośm skrzyń fig.',
    extraPairs: [
      { glyph: 'ł', base: 'l' },
      { glyph: 'Ł', base: 'L' },
    ],
  },
  cs: {
    code: 'cs',
    name: { tr: 'Çekçe', en: 'Czech' },
    nativeName: 'Čeština',
    subsets: ['latin-ext'],
    charset: `Áá Čč Ďď Éé Ěě Íí Ňň Óó Řř Šš Ťť Úú Ůů Ýý Žž — ${digits}`,
    pangram: 'Příliš žluťoučký kůň úpěl ďábelské ódy.',
  },
  ro: {
    code: 'ro',
    name: { tr: 'Romence', en: 'Romanian' },
    nativeName: 'Română',
    subsets: ['latin-ext'],
    charset: `Ăă Ââ Îî Șș Țț — ${digits}`,
    pangram: 'Înjurând pițigăiat, zoofobul comandă vexat whisky și tequila.',
  },
  hu: {
    code: 'hu',
    name: { tr: 'Macarca', en: 'Hungarian' },
    nativeName: 'Magyar',
    subsets: ['latin-ext'],
    charset: `Áá Éé Íí Óó Öö Őő Úú Üü Űű — ${digits}`,
    pangram: 'Árvíztűrő tükörfúrógép.',
  },
  ru: {
    code: 'ru',
    name: { tr: 'Rusça', en: 'Russian' },
    nativeName: 'Русский',
    subsets: ['cyrillic'],
    charset: `Бб Гг Дд Ёё Жж Йй Лл Фф Щщ Ыы Ээ Юю Яя — ${digits}`,
    pangram: 'Съешь же ещё этих мягких французских булок, да выпей чаю.',
  },
  uk: {
    code: 'uk',
    name: { tr: 'Ukraynaca', en: 'Ukrainian' },
    nativeName: 'Українська',
    subsets: ['cyrillic'],
    charset: `Ґґ Єє Іі Її Йй Щщ Юю Яя — ${digits}`,
    pangram: 'Чуєш їх, доцю, га? Кумедна ж ти, прощайся без ґольфів!',
  },
  el: {
    code: 'el',
    name: { tr: 'Yunanca', en: 'Greek' },
    nativeName: 'Ελληνικά',
    subsets: ['greek'],
    charset: `Αα Ββ Γγ Δδ Θθ Λλ Ξξ Σσς Ψψ Ωω Άά Ώώ — ${digits}`,
    pangram: 'Ξεσκεπάζω την ψυχοφθόρα βδελυγμία.',
  },
};

type Assert<T extends true> = T;
export type LocalesMatchLanguageCodes = Assert<Locale extends LanguageCode ? (LanguageCode extends Locale ? true : false) : false>;

/** Name of a site language in the interface language; native name when the interface has no translation of it. */
export function languageName(code: LanguageCode, locale: Locale): string {
  const info = languages[code];
  return locale === 'tr' || locale === 'en' ? info.name[locale] : info.nativeName;
}

export function requiredSubsets(codes: readonly LanguageCode[]): Subset[] {
  const subsets = new Set<Subset>(['latin']);
  for (const code of codes) {
    for (const subset of languages[code].subsets) subsets.add(subset);
  }
  return [...subsets];
}
