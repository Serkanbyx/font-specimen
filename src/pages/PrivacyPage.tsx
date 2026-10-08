import { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';
import { projectStore } from '../lib/storage.ts';

export function PrivacyPage() {
  const { t } = useI18n();
  useDocumentTitle(t.privacy.title);
  const [deleted, setDeleted] = useState(false);

  const clear = () => {
    if (!window.confirm(t.privacy.deleteConfirm)) return;
    projectStore.clearAll();
    setDeleted(true);
  };

  return (
    <div className="page prose">
      <header className="page-intro">
        <h1>{t.privacy.title}</h1>
        <p className="lead">{t.privacy.lead}</p>
      </header>
      {t.privacy.sections.map((section) => (
        <section key={section.title} className="section">
          <h2>{section.title}</h2>
          <p>{section.text}</p>
        </section>
      ))}
      <section className="section panel">
        <h2>{t.privacy.deleteTitle}</h2>
        <p>{t.privacy.deleteText}</p>
        <button type="button" className="button button--danger" onClick={clear}>
          {t.privacy.deleteButton}
        </button>
        <p role="status">{deleted ? t.privacy.deleted : ''}</p>
      </section>
    </div>
  );
}
