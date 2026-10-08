import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { languageCodes, languages } from '../data/languages.ts';
import type { Locale } from '../data/types.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';

export function LocaleSwitch() {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    rootRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
  }, [open]);

  const choose = (code: Locale) => {
    setLocale(code);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    const next =
      event.key === 'ArrowDown' ? index + 1
      : event.key === 'ArrowUp' ? index - 1
      : event.key === 'Home' ? 0
      : event.key === 'End' ? options.length - 1
      : null;
    if (next === null) return;
    event.preventDefault();
    options[(next + options.length) % options.length]?.focus();
  };

  return (
    <div className="app-header__locale" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${t.nav.language}: ${languages[locale].nativeName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if ((event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {locale.toLocaleUpperCase('en')}
      </button>
      {open && (
        <ul id={listId} className="app-header__locale-menu" role="listbox" aria-label={t.nav.language} onKeyDown={onListKeyDown}>
          {languageCodes.map((code) => (
            <li key={code} role="none">
              <button type="button" role="option" lang={code} aria-selected={code === locale} onClick={() => choose(code)}>
                {languages[code].nativeName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
