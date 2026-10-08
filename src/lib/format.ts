import type { ContentLocale, Locale, LocalizedText } from '../data/types.ts';

/** Catalogue copy exists in Turkish and English. Every other interface language reads the English text. */
export function contentText(text: LocalizedText, locale: Locale): string {
  const contentLocale: ContentLocale = locale === 'tr' ? 'tr' : 'en';
  return text[contentLocale];
}

export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function formatList(items: readonly string[], locale: Locale): string {
  return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(items);
}

export function formatKilobytes(bytes: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(bytes / 1024);
}

export function slugify(value: string): string {
  return (
    value
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/ı/g, 'i')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'project'
  );
}
