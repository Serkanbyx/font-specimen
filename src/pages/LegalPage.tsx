import { useDocumentTitle } from '../hooks/useDocumentTitle.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';
import { fonts, licenseUrl } from '../lib/fonts.ts';

export function LegalPage() {
  const { t } = useI18n();
  useDocumentTitle(t.legal.title);
  const sorted = [...fonts].sort((a, b) => a.family.localeCompare(b.family));

  return (
    <div className="page prose">
      <header className="page-intro">
        <h1>{t.legal.title}</h1>
        <p className="lead">{t.legal.lead}</p>
      </header>

      <section className="section">
        <h2>{t.legal.softwareTitle}</h2>
        <p>{t.legal.software}</p>
        <p>
          <a href={`${import.meta.env.BASE_URL}THIRD_PARTY_NOTICES.txt`}>{t.legal.noticesLink}</a>
        </p>
      </section>

      <section className="section" aria-labelledby="legal-fonts">
        <h2 id="legal-fonts">{t.legal.fontsTitle}</h2>
        <p>{t.legal.fonts}</p>
        <div className="table-scroll" tabIndex={0} role="region" aria-labelledby="legal-fonts">
          <table className="data-table legal-table">
            <thead>
              <tr>
                <th scope="col">{t.legal.columns.family}</th>
                <th scope="col">{t.legal.columns.licence}</th>
                <th scope="col">{t.legal.columns.copyright}</th>
                <th scope="col">{t.legal.columns.files}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((font) => (
                <tr key={font.id}>
                  <th scope="row" lang="en">
                    {font.family}
                  </th>
                  <td lang="en">{font.meta.license}</td>
                  <td lang="en" className="small">
                    {font.meta.copyright}
                  </td>
                  <td>
                    <a href={licenseUrl(font)}>
                      {t.legal.licenceLink}
                      <span className="visually-hidden"> ({font.family})</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>{t.legal.rfnTitle}</h2>
        <p>{t.legal.rfn}</p>
      </section>
      <section className="section">
        <h2>{t.legal.affiliationTitle}</h2>
        <p>{t.legal.affiliation}</p>
      </section>
      <section className="section">
        <h2>{t.legal.contentTitle}</h2>
        <p>{t.legal.content}</p>
      </section>
      <section className="section">
        <h2>{t.legal.disclaimerTitle}</h2>
        <p>{t.legal.disclaimer}</p>
      </section>
    </div>
  );
}
