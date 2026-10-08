import { useDocumentTitle } from '../hooks/useDocumentTitle.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';

export function GuidePage() {
  const { t } = useI18n();
  useDocumentTitle(t.guide.title);
  return (
    <div className="page prose">
      <header className="page-intro">
        <h1>{t.guide.title}</h1>
        <p className="lead">{t.guide.lead}</p>
      </header>
      {t.guide.sections.map((section) => (
        <section key={section.title} className="section">
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
