import { useId, useState } from 'react';
import { Badge } from '../../components/Badge.tsx';
import { FontName } from '../../components/FontName.tsx';
import { GlyphStatus } from '../../components/specimen/GlyphStatus.tsx';
import { requiredSubsets } from '../../data/languages.ts';
import type { FontRole } from '../../data/types.ts';
import { useGlyphAudits, useRegisterFonts } from '../../hooks/useFonts.ts';
import { useI18n } from '../../i18n/I18nProvider.tsx';
import type { AuditEntry } from '../../lib/auditStore.ts';
import { fontsForRole, getFont } from '../../lib/fonts.ts';
import { contentText, format } from '../../lib/format.ts';
import { candidateCount } from '../../lib/picker.ts';
import { recommendedPairFor, inputOf } from '../../lib/projectOps.ts';
import type { TabProps } from '../ProjectPage.tsx';

interface RoleTableProps extends TabProps {
  role: FontRole;
  audits: Map<string, AuditEntry>;
  recommended: string | null;
}

function NoteField({ label, value, placeholder, onSave }: { label: string; value: string; placeholder: string; onSave: (value: string) => void }) {
  const [text, setText] = useState(value);
  return (
    <textarea
      aria-label={label}
      className="note-field"
      value={text}
      placeholder={placeholder}
      maxLength={240}
      rows={3}
      onChange={(event) => setText(event.target.value)}
      onBlur={() => {
        if (text !== value) onSave(text);
      }}
    />
  );
}

function RoleTable({ project, update, role, audits, recommended }: RoleTableProps) {
  const { t, locale } = useI18n();
  const addId = useId();
  const [toAdd, setToAdd] = useState('');
  const ids = project.candidates[role];
  const subsets = requiredSubsets(project.languages);

  const remove = (id: string) => {
    update((input) => ({
      ...input,
      excludedFonts: [...new Set([...input.excludedFonts, id])],
      candidates: { ...input.candidates, [role]: input.candidates[role].filter((item) => item !== id) },
    }));
  };

  const add = () => {
    if (!toAdd) return;
    update((input) => ({
      ...input,
      excludedFonts: input.excludedFonts.filter((item) => item !== toAdd),
      // Listed first so it survives the trim to ten; the lowest-ranked face drops out.
      candidates: { ...input.candidates, [role]: [toAdd, ...input.candidates[role]] },
    }));
    setToAdd('');
  };

  const saveNote = (id: string, note: string) => {
    update((input) => ({ ...input, notes: { ...input.notes, [id]: note } }));
  };

  const addable = fontsForRole(role)
    .filter((font) => !ids.includes(font.id))
    .sort((a, b) => a.family.localeCompare(b.family));
  const full = ids.length >= candidateCount;
  const titleId = `${role}-candidates-title`;

  return (
    <section className="section" aria-labelledby={titleId}>
      <h2 id={titleId}>{role === 'heading' ? t.candidates.headingTitle : t.candidates.bodyTitle}</h2>
      <div className="table-scroll" tabIndex={0} role="region" aria-labelledby={titleId}>
        <table className="data-table candidates-table">
          <thead>
            <tr>
              <th scope="col">{t.candidates.columns.font}</th>
              <th scope="col">{t.candidates.columns.classification}</th>
              <th scope="col">{t.candidates.columns.italic}</th>
              <th scope="col">{t.candidates.columns.languages}</th>
              <th scope="col">{t.candidates.columns.glyphs}</th>
              <th scope="col">{t.candidates.columns.note}</th>
              <th scope="col">{t.candidates.columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {ids.map((id) => {
              const font = getFont(id);
              if (!font) return null;
              const missing = subsets.filter((subset) => !font.meta.subsets.includes(subset));
              const isCurrent = project.currentFonts[role] === id;
              return (
                <tr key={id}>
                  <th scope="row">
                    <FontName font={font} styled role={role} className="candidates-table__name" />
                    <span className="candidates-table__badges">
                      {isCurrent && <Badge tone="accent">{t.common.current}</Badge>}
                      {recommended === id && <Badge tone="success">{t.common.recommended}</Badge>}
                    </span>
                  </th>
                  <td>{t.labels.classification[font.classification]}</td>
                  <td>{font.meta.italic ? t.common.yes : t.common.no}</td>
                  <td>
                    {missing.length === 0 ? (
                      t.candidates.supported
                    ) : (
                      <Badge tone="warning">{format(t.candidates.unsupported, { subsets: missing.join(', ') })}</Badge>
                    )}
                  </td>
                  <td>
                    <GlyphStatus entry={audits.get(id)} compact />
                  </td>
                  <td>
                    <NoteField
                      key={`${id}-${project.notes[id] ?? ''}`}
                      label={format(t.candidates.noteLabel, { name: font.family })}
                      value={project.notes[id] ?? ''}
                      placeholder={contentText(font.note, locale)}
                      onSave={(note) => saveNote(id, note)}
                    />
                  </td>
                  <td>
                    {!isCurrent && (
                      <button
                        type="button"
                        className="button button--small"
                        aria-label={format(t.candidates.removeLabel, { name: font.family })}
                        onClick={() => remove(id)}
                      >
                        {t.candidates.remove}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="add-row">
        <label htmlFor={addId}>{format(t.candidates.addLabel, { role: t.labels.role[role] })}</label>
        <div className="add-row__controls">
          <select id={addId} value={toAdd} aria-describedby={full ? `${addId}-hint` : undefined} onChange={(event) => setToAdd(event.target.value)}>
            <option value="">{t.candidates.addPlaceholder}</option>
            {addable.map((font) => (
              <option key={font.id} value={font.id} lang="en">
                {font.family}
              </option>
            ))}
          </select>
          <button type="button" className="button button--small" disabled={!toAdd} onClick={add}>
            {t.candidates.add}
          </button>
        </div>
        {full && (
          <p id={`${addId}-hint`} className="field-hint">
            {t.candidates.full}
          </p>
        )}
      </div>
    </section>
  );
}

export function CandidatesTab(props: TabProps) {
  const { t } = useI18n();
  const { project, update } = props;
  const ids = [...project.candidates.heading, ...project.candidates.body];
  useRegisterFonts(ids);
  const audits = useGlyphAudits(ids, project.languages);
  const recommended = recommendedPairFor(inputOf(project));

  const resuggest = () => {
    update((input) => ({ ...input, candidates: { heading: [], body: [] }, selection: { heading: null, body: null } }));
  };

  const restore = (id: string) => {
    update((input) => ({ ...input, excludedFonts: input.excludedFonts.filter((item) => item !== id) }));
  };

  return (
    <div className="page">
      <header className="page-intro">
        <h1>{t.candidates.title}</h1>
        <p className="lead">{t.candidates.lead}</p>
        <div className="toolbar">
          <button type="button" className="button" onClick={resuggest} aria-describedby="resuggest-hint">
            {t.candidates.resuggest}
          </button>
          <p id="resuggest-hint" className="field-hint">
            {t.candidates.resuggestHint}
          </p>
        </div>
      </header>
      <RoleTable {...props} role="heading" audits={audits} recommended={recommended.heading} />
      <RoleTable {...props} role="body" audits={audits} recommended={recommended.body} />
      <section className="section" aria-labelledby="excluded-title">
        <h2 id="excluded-title">{t.candidates.excludedTitle}</h2>
        {project.excludedFonts.length === 0 ? (
          <p className="muted">{t.candidates.excludedEmpty}</p>
        ) : (
          <ul className="inline-list">
            {project.excludedFonts.map((id) => {
              const font = getFont(id);
              if (!font) return null;
              return (
                <li key={id}>
                  <button type="button" className="button button--small" onClick={() => restore(id)}>
                    {format(t.candidates.restore, { name: font.family })}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
