import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { languageCodes } from '../data/languages.ts';
import type { Locale } from '../data/types.ts';
import { en, type Messages } from './en.ts';
import { tr } from './tr.ts';

const localeKey = 'font-specimen:locale';

const loaders: Record<Locale, () => Promise<Messages>> = {
  en: () => Promise.resolve(en),
  tr: () => Promise.resolve(tr),
  de: () => import('./de.ts').then((module) => module.de),
  fr: () => import('./fr.ts').then((module) => module.fr),
  es: () => import('./es.ts').then((module) => module.es),
  it: () => import('./it.ts').then((module) => module.it),
  pt: () => import('./pt.ts').then((module) => module.pt),
  nl: () => import('./nl.ts').then((module) => module.nl),
  sv: () => import('./sv.ts').then((module) => module.sv),
  pl: () => import('./pl.ts').then((module) => module.pl),
  cs: () => import('./cs.ts').then((module) => module.cs),
  ro: () => import('./ro.ts').then((module) => module.ro),
  hu: () => import('./hu.ts').then((module) => module.hu),
  ru: () => import('./ru.ts').then((module) => module.ru),
  uk: () => import('./uk.ts').then((module) => module.uk),
  el: () => import('./el.ts').then((module) => module.el),
};

const cache = new Map<Locale, Messages>([
  ['en', en],
  ['tr', tr],
]);

function isLocale(value: string): value is Locale {
  return (languageCodes as readonly string[]).includes(value);
}

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(localeKey);
    if (saved && isLocale(saved)) return saved;
  } catch {
    // Storage can be blocked; fall back to the browser language.
  }
  const browser = navigator.language.toLowerCase().split('-')[0] ?? '';
  return isLocale(browser) ? browser : 'en';
}

interface I18nValue {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Messages>(() => cache.get(initialLocale()) ?? en);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(localeKey, next);
    } catch {
      // Not persisting is acceptable; the choice still applies for this visit.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    const ready = cache.get(locale);
    if (ready) {
      setMessages(ready);
      return;
    }
    let cancelled = false;
    void loaders[locale]().then((next) => {
      cache.set(locale, next);
      if (!cancelled) setMessages(next);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, t: messages, setLocale }), [locale, messages, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}
