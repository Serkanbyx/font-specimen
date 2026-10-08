import { useState } from 'react';
import { FontName } from '../../components/FontName.tsx';
import { describeIssue } from '../../components/specimen/GlyphStatus.tsx';
import { languageName, requiredSubsets } from '../../data/languages.ts';
import { useGlyphAudits, useRegisterFonts } from '../../hooks/useFonts.ts';
import { useI18n } from '../../i18n/I18nProvider.tsx';
import type { AuditEntry } from '../../lib/auditStore.ts';
import { fontStack, fonts, getFont, supportsSubsets } from '../../lib/fonts.ts';
import { format, formatList } from '../../lib/format.ts';
import type { TabProps } from '../ProjectPage.tsx';

interface AuditRow {
  id: string;
  role?: string;
}

function AuditTable({ rows, audits, caption }: { rows: AuditRow[]; audits: Map<string, AuditEntry>; caption: string }) {
  const { t } = useI18n();
  const done = rows.filter((row) => audits.get(row.id)?.status === 'done');
  const passed = done.filter((row) => {
    const entry = audits.get(row.id);
    return entry?.status === 'done' && entry.result.issues.length === 0;
  });

  return (
    <>
      <p className="muted" aria-live="polite">
        {format(t.audit.summary, { ok: passed.length, total: rows.length })}
      </p>
      <div className="table-scroll" tabIndex={0} role="region" aria-label={caption}>
        <table className="data-table audit-table">
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">{t.audit.columns.font}</th>
              {rows.some((row) => row.role) && <th scope="col">{t.audit.columns.role}</th>}
              <th scope="col">{t.audit.columns.status}</th>
              <th scope="col">{t.audit.columns.details}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const font = getFont(row.id);
              if (!font) return null;
              const entry = audits.get(row.id);
              return (
                <tr key={`${row.role ?? ''}-${row.id}`}>
                  <th scope="row">
                    <FontName font={font} />
                  </th>
                  {rows.some((item) => item.role) && <td>{row.role}</td>}
                  <td>
                    {!entry || entry.status === 'pending' ? (
                      <span className="glyph-status glyph-status--pending">{t.audit.status.pending}</span>
                    ) : entry.status === 'error' ? (
                      <span className="glyph-status glyph-status--error">{t.audit.status.error}</span>
                    ) : entry.result.issues.length === 0 ? (
                      <span className="glyph-status glyph-status--ok">{t.audit.status.ok}</span>
                    ) : (
                      <span className="glyph-status glyph-status--issues">{t.audit.status.issues}</span>
                    )}
                  </td>
                  <td>
                    {entry?.status === 'done' && (
                      <>
                        <span className="muted small">
                          {format(t.audit.checked, { letters: entry.result.checkedLetters, pairs: entry.result.checkedPairs })}
                        </span>
                        {entry.result.issues.length > 0 && (
                          <ul className="issue-list">
                            {entry.result.issues.map((issue, index) => (
                              <li key={index}>
                                <span className="issue-list__glyphs" lang={issue.language} style={{ fontFamily: fontStack(font) }} aria-hidden="true">
                                  {issue.glyph}
                                  {issue.base && <span className="issue-list__base">{issue.base}</span>}
                                </span>
                                <span>{describeIssue(issue, t)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                    {entry?.status === 'error' && <span className="small">{entry.message}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AuditTab({ project }: TabProps) {
  const { t, locale } = useI18n();
  const [catalogueRequested, setCatalogueRequested] = useState(false);
  const rows: AuditRow[] = [
    ...project.candidates.heading.map((id) => ({ id, role: t.labels.role.heading })),
    ...project.candidates.body.map((id) => ({ id, role: t.labels.role.body })),
  ];
  const subsets = requiredSubsets(project.languages);
  const catalogueRows: AuditRow[] = fonts.filter((font) => supportsSubsets(font, subsets)).map((font) => ({ id: font.id }));

  const candidateIds = rows.map((row) => row.id);
  const catalogueIds = catalogueRows.map((row) => row.id);
  useRegisterFonts(catalogueRequested ? catalogueIds : candidateIds);
  const candidateAudits = useGlyphAudits(candidateIds, project.languages);
  const catalogueAudits = useGlyphAudits(catalogueIds, project.languages, catalogueRequested);

  return (
    <div className="page">
      <header className="page-intro">
        <h1>{t.audit.title}</h1>
        <p className="lead">{t.audit.lead}</p>
        <p>{t.audit.method}</p>
        <p className="muted">
          {format(t.audit.languagesLine, { languages: formatList(project.languages.map((code) => languageName(code, locale)), locale) })}
        </p>
      </header>

      <section className="section" aria-labelledby="audit-candidates">
        <h2 id="audit-candidates">{t.audit.candidatesTitle}</h2>
        <AuditTable rows={rows} audits={candidateAudits} caption={t.audit.candidatesTitle} />
      </section>

      <section className="section" aria-labelledby="audit-catalogue">
        <h2 id="audit-catalogue">{t.audit.catalogueTitle}</h2>
        <p className="muted">{t.audit.catalogueHint}</p>
        {catalogueRequested ? (
          <AuditTable rows={catalogueRows} audits={catalogueAudits} caption={t.audit.catalogueTitle} />
        ) : (
          <button type="button" className="button" onClick={() => setCatalogueRequested(true)}>
            {t.audit.runCatalogue}
          </button>
        )}
      </section>
    </div>
  );
}
