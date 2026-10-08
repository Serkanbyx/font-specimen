import { useCallback } from 'react';
import { Gallery } from '../../components/specimen/Gallery.tsx';
import { Preview } from '../../components/specimen/Preview.tsx';
import { SelectionBar } from '../../components/specimen/SelectionBar.tsx';
import '../../components/specimen/specimen.css';
import type { FontRole } from '../../data/types.ts';
import { useGlyphAudits, useRegisterFonts } from '../../hooks/useFonts.ts';
import { useI18n } from '../../i18n/I18nProvider.tsx';
import { getFont } from '../../lib/fonts.ts';
import { href } from '../../router.ts';
import type { TabProps } from '../ProjectPage.tsx';

export function SpecimenTab({ project, update }: TabProps) {
  const { t } = useI18n();
  const allIds = [...project.candidates.heading, ...project.candidates.body];
  useRegisterFonts(allIds);
  const audits = useGlyphAudits(allIds, project.languages);

  const select = useCallback(
    (role: FontRole, id: string) => {
      update((input) => ({ ...input, selection: { ...input.selection, [role]: id } }));
    },
    [update],
  );

  const heading = getFont(project.selection.heading);
  const body = getFont(project.selection.body);

  return (
    <div className="specimen">
      <div className="page">
        <header className="page-intro">
          <h1>{t.specimen.title}</h1>
          <p className="lead">{t.specimen.lead}</p>
        </header>
      </div>

      {!heading || !body ? (
        <p className="page">
          {t.specimen.emptyList} <a href={href({ name: 'project', id: project.id, tab: 'candidates' })}>{t.project.tabs.candidates}</a>
        </p>
      ) : (
        <>
          <SelectionBar
            candidates={project.candidates}
            selection={{ heading, body }}
            current={project.currentFonts}
            onSelect={select}
          />
          <div className="page">
            <Preview project={project} heading={heading} body={body} label={t.specimen.previewLabel} />
          </div>
        </>
      )}

      <section className="page section" aria-labelledby="gallery-title">
        <h2 id="gallery-title">{t.specimen.galleryTitle}</h2>
        <h3 className="gallery-title">{t.specimen.galleryHeading}</h3>
        <Gallery project={project} role="heading" audits={audits} onSelect={select} />
        <h3 className="gallery-title">{t.specimen.galleryBody}</h3>
        <Gallery project={project} role="body" audits={audits} onSelect={select} />
      </section>
    </div>
  );
}
