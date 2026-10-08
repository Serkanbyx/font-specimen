import type { CSSProperties } from 'react';
import { languages, type LanguageCode } from '../../data/languages.ts';
import type { FontRole } from '../../data/types.ts';
import { useI18n } from '../../i18n/I18nProvider.tsx';
import type { AuditEntry } from '../../lib/auditStore.ts';
import { fontStack, getFont, headingWeight } from '../../lib/fonts.ts';
import { contentText, format } from '../../lib/format.ts';
import type { Project } from '../../lib/project.ts';
import { Badge } from '../Badge.tsx';
import { FontName } from '../FontName.tsx';
import { GlyphStatus } from './GlyphStatus.tsx';

interface GalleryProps {
  project: Project;
  role: FontRole;
  audits: Map<string, AuditEntry>;
  onSelect: (role: FontRole, id: string) => void;
}

export function Gallery({ project, role, audits, onSelect }: GalleryProps) {
  const { t, locale } = useI18n();
  const ids = project.candidates[role];
  const selected = project.selection[role];
  const contentLanguage: LanguageCode = project.languages[0] ?? 'en';
  const language = languages[contentLanguage];
  const brandLine = [project.name, ...project.content.facts.map((fact) => fact.value)].join(' · ');

  return (
    <ul className={`gallery gallery--${role}`}>
      {ids.map((id) => {
        const font = getFont(id);
        if (!font) return null;
        const isSelected = selected === id;
        const sample = { fontFamily: fontStack(font) } as CSSProperties;
        const note = project.notes[id] ?? contentText(font.note, locale);
        return (
          <li key={id}>
            <button
              type="button"
              className="gallery-card"
              aria-pressed={isSelected}
              aria-label={format(role === 'heading' ? t.specimen.selectHeading : t.specimen.selectBody, { name: font.family })}
              aria-describedby={`${role}-${id}-status`}
              onClick={() => onSelect(role, id)}
            >
              <span className="gallery-card__header">
                <FontName font={font} className="gallery-card__name" />
                {project.currentFonts[role] === id && <Badge tone="accent">{t.common.current}</Badge>}
              </span>
              {role === 'heading' ? (
                <>
                  <span className="gallery-card__headline" lang={contentLanguage} style={{ ...sample, fontWeight: headingWeight(font) }}>
                    {project.content.headline}
                  </span>
                  <span className="gallery-card__brand" lang={contentLanguage} style={{ ...sample, fontWeight: headingWeight(font) }}>
                    {brandLine}
                  </span>
                </>
              ) : (
                <>
                  <span className="gallery-card__pangram" lang={contentLanguage} style={sample}>
                    {language.pangram}
                  </span>
                  <span className="gallery-card__sentence" lang={contentLanguage} style={sample}>
                    {project.content.intro}
                  </span>
                  <span className="gallery-card__label" lang={contentLanguage} style={sample}>
                    {project.content.labelLine}
                  </span>
                </>
              )}
              <span className="gallery-card__charset" lang={contentLanguage} style={sample}>
                {language.charset}
              </span>
              <span className="gallery-card__note">
                {note}
                {!font.meta.italic && ` ${t.specimen.noItalic}`}
                {font.caveat && ` ${contentText(font.caveat, locale)}`}
              </span>
              <span id={`${role}-${id}-status`}>
                <GlyphStatus entry={audits.get(id)} />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
