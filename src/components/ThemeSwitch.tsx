import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nProvider.tsx';
import { bindTheme, setThemeMode, themeModes, useThemeMode, type ThemeMode } from '../lib/theme.ts';

const labels = {
  system: 'themeSystem',
  light: 'themeLight',
  dark: 'themeDark',
} as const satisfies Record<ThemeMode, 'themeSystem' | 'themeLight' | 'themeDark'>;

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === 'light') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (mode === 'dark') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" />
    </svg>
  );
}

export function ThemeSwitch() {
  const { t } = useI18n();
  const mode = useThemeMode();

  useEffect(() => {
    bindTheme();
  }, []);

  return (
    <div className="theme-switch" role="radiogroup" aria-label={t.nav.theme}>
      {themeModes.map((item) => (
        <label key={item} className="theme-switch__option">
          <input type="radio" name="color-scheme" value={item} checked={mode === item} onChange={() => setThemeMode(item)} />
          <span className="theme-switch__face" aria-hidden="true">
            <ThemeIcon mode={item} />
          </span>
          <span className="visually-hidden">{t.nav[labels[item]]}</span>
        </label>
      ))}
    </div>
  );
}
