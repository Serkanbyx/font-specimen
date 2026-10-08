import { useI18n } from '../i18n/I18nProvider.tsx';
import { href, type Route } from '../router.ts';
import { LocaleSwitch } from './LocaleSwitch.tsx';

export function AppHeader({ route }: { route: Route }) {
  const { t } = useI18n();
  const links: { route: Route; label: string; active: boolean }[] = [
    { route: { name: 'home' }, label: t.nav.projects, active: ['home', 'project', 'share'].includes(route.name) },
    { route: { name: 'catalogue' }, label: t.nav.catalogue, active: route.name === 'catalogue' },
    { route: { name: 'guide' }, label: t.nav.guide, active: route.name === 'guide' },
    { route: { name: 'legal' }, label: t.nav.legal, active: route.name === 'legal' || route.name === 'privacy' },
  ];

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <a className="app-header__brand" href={href({ name: 'home' })}>
          {t.common.appName}
        </a>
        <nav className="app-header__nav" aria-label={t.nav.label}>
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <a href={href(link.route)} aria-current={link.active ? 'page' : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LocaleSwitch />
      </div>
    </header>
  );
}
