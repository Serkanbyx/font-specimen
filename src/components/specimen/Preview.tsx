import type { CSSProperties } from 'react';
import type { LanguageCode } from '../../data/languages.ts';
import { fontStack, headingWeight, type FontRecord } from '../../lib/fonts.ts';
import type { Project } from '../../lib/project.ts';

interface PreviewProps {
  project: Project;
  heading: FontRecord;
  body: FontRecord;
  label: string;
}

/**
 * Rebuilds the parts of a site that reveal a typeface: headline, buttons,
 * numbers, cards, a dark section, long copy and a table. The project's
 * tokens and the selected fonts are custom properties scoped to this element.
 */
export function Preview({ project, heading, body, label }: PreviewProps) {
  const { colors, radius, headingTransform } = project.theme;
  const { content } = project;
  const contentLanguage: LanguageCode = project.languages[0] ?? 'en';
  const style = {
    '--p-font-heading': fontStack(heading),
    '--p-font-body': fontStack(body),
    '--p-heading-weight': headingWeight(heading),
    '--p-heading-transform': headingTransform,
    '--p-bg': colors.background,
    '--p-surface': colors.surface,
    '--p-text': colors.text,
    '--p-muted': colors.muted,
    '--p-accent': colors.accent,
    '--p-accent-text': colors.accentText,
    '--p-contrast-bg': colors.contrastBackground,
    '--p-contrast-text': colors.contrastText,
    '--p-border': colors.border,
    '--p-radius-control': `${radius.control}px`,
    '--p-radius-card': `${radius.card}px`,
  } as CSSProperties;

  return (
    <section className="preview" style={style} lang={contentLanguage} aria-label={label}>
      <div className="preview__hero">
        <div className="preview__hero-text">
          <h2 className="preview__headline">{content.headline}</h2>
          <p className="preview__intro">{content.intro}</p>
          <div className="preview__actions">
            <span className="preview__button preview__button--primary">{content.primaryAction}</span>
            <span className="preview__button">{content.secondaryAction}</span>
          </div>
          <dl className="preview__facts">
            {content.facts.map((fact, index) => (
              <div key={index} className="preview__fact">
                <dt className="preview__fact-label">{fact.label}</dt>
                <dd className="preview__fact-value">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ul className="preview__services">
          {content.services.map((service, index) => (
            <li key={index} className="preview__service">
              <h3 className="preview__service-title">{service.title}</h3>
              <p className="preview__service-text">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="preview__contrast">
        <h2 className="preview__contrast-heading">{content.contrastHeading}</h2>
        <p className="preview__input">{content.contrastQuestion}</p>
        <ul className="preview__chips">
          {content.chips.map((chip, index) => (
            <li key={index} className="preview__chip">
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <div className="preview__text">
        <h2 className="preview__text-heading">{content.textHeading}</h2>
        <p className="preview__paragraph">{content.textBody}</p>
        <p className="preview__label">{content.labelLine}</p>
      </div>

      <div className="preview__table-wrap">
        <table className="preview__table">
          <caption>{content.tableTitle}</caption>
          <tbody>
            {content.table.map((row, index) => (
              <tr key={index}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
