import { useDocumentTitle } from '../hooks/useDocumentTitle.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';
import { href } from '../router.ts';

export function NotFoundPage() {
  const { t } = useI18n();
  useDocumentTitle(t.notFound.title);
  return (
    <div className="page">
      <h1>{t.notFound.title}</h1>
      <p>{t.notFound.text}</p>
      <p>
        <a className="button" href={href({ name: 'home' })}>
          {t.notFound.back}
        </a>
      </p>
    </div>
  );
}
