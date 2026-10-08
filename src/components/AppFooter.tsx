import { useI18n } from '../i18n/I18nProvider.tsx';
import { href } from '../router.ts';

export function AppFooter() {
  const { t } = useI18n();
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__text">
          <p>{t.footer.fonts}</p>
          <p>{t.footer.privacy}</p>
          <p>{t.footer.affiliation}</p>
        </div>
        <ul className="app-footer__links">
          <li>
            <a href={href({ name: 'legal' })}>{t.nav.legal}</a>
          </li>
          <li>
            <a href={href({ name: 'privacy' })}>{t.nav.privacy}</a>
          </li>
          <li>
            <a href={href({ name: 'guide' })}>{t.nav.guide}</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
