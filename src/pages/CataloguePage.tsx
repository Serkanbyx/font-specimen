import { useDeferredValue, useId, useState } from 'react';
import { Badge } from '../components/Badge.tsx';
import { FontName } from '../components/FontName.tsx';
import { languageCodes, languageName, languages, requiredSubsets, type LanguageCode } from '../data/languages.ts';
import { tones, type Classification, type FontRole, type Tone } from '../data/types.ts';
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts';
import { useRegisterFonts } from '../hooks/useFonts.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';
import { fonts, fontStack, supportsSubsets, totalBytes } from '../lib/fonts.ts';
import { contentText, format, formatKilobytes } from '../lib/format.ts';

const classifications = [...new Set(fonts.map((font) => font.classification))];

export function CataloguePage() {
  const { t, locale } = useI18n();
  useDocumentTitle(t.catalogue.title);
  const ids = { search: useId(), role: useId(), classification: useId(), tone: useId(), language: useId() };
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<FontRole | ''>('');
  const [classification, setClassification] = useState<Classification | ''>('');
  const [tone, setTone] = useState<Tone | ''>('');
  const [language, setLanguage] = useState<LanguageCode | ''>('');
  const [variableOnly, setVariableOnly] = useState(false);
  const [italicOnly, setItalicOnly] = useState(false);
  const query = useDeferredValue(search.trim().toLowerCase());

  useRegisterFonts(fonts.map((font) => font.id));

  const sampleLanguage: LanguageCode = language || locale;
  const subsets = language ? requiredSubsets([language]) : [];
  const results = fonts.filter(
    (font) =>
      (!query || font.family.toLowerCase().includes(query)) &&
      (!role || font.roles.includes(role)) &&
      (!classification || font.classification === classification) &&
      (!tone || font.tones.includes(tone)) &&
      supportsSubsets(font, subsets) &&
      (!variableOnly || font.meta.variable) &&
      (!italicOnly || font.meta.italic),
  );

  return (
    <div className="page">
      <header className="page-intro">
        <h1>{t.catalogue.title}</h1>
        <p className="lead">{t.catalogue.lead}</p>
      </header>

      <form className="filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor={ids.search}>{t.catalogue.search}</label>
          <input id={ids.search} type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={ids.role}>{t.catalogue.role}</label>
          <select id={ids.role} value={role} onChange={(event) => setRole(event.target.value as FontRole | '')}>
            <option value="">{t.catalogue.all}</option>
            <option value="heading">{t.common.heading}</option>
            <option value="body">{t.common.body}</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={ids.classification}>{t.catalogue.classification}</label>
          <select id={ids.classification} value={classification} onChange={(event) => setClassification(event.target.value as Classification | '')}>
            <option value="">{t.catalogue.all}</option>
            {classifications.map((item) => (
              <option key={item} value={item}>
                {t.labels.classification[item]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={ids.tone}>{t.catalogue.tone}</label>
          <select id={ids.tone} value={tone} onChange={(event) => setTone(event.target.value as Tone | '')}>
            <option value="">{t.catalogue.all}</option>
            {tones.map((item) => (
              <option key={item} value={item}>
                {t.labels.tone[item]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={ids.language}>{t.catalogue.language}</label>
          <select id={ids.language} value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode | '')}>
            <option value="">{t.catalogue.anyLanguage}</option>
            {languageCodes.map((code) => (
              <option key={code} value={code}>
                {languageName(code, locale)}
              </option>
            ))}
          </select>
        </div>
        <div className="filters__checks">
          <label className="checkbox">
            <input type="checkbox" checked={variableOnly} onChange={(event) => setVariableOnly(event.target.checked)} />
            {t.catalogue.variableOnly}
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={italicOnly} onChange={(event) => setItalicOnly(event.target.checked)} />
            {t.catalogue.italicOnly}
          </label>
        </div>
      </form>

      <p className="muted" role="status">
        {format(t.catalogue.results, { count: results.length })}
      </p>

      {results.length === 0 ? (
        <p>{t.catalogue.noResults}</p>
      ) : (
        <ul className="catalogue-grid">
          {results.map((font) => (
            <li key={font.id} className="catalogue-card">
              <h2 className="catalogue-card__name">
                <FontName font={font} styled role={font.roles.includes('heading') ? 'heading' : 'body'} />
              </h2>
              <p className="catalogue-card__sample" lang={sampleLanguage} style={{ fontFamily: fontStack(font) }}>
                {languages[sampleLanguage].pangram}
              </p>
              <p className="catalogue-card__charset" lang={sampleLanguage} style={{ fontFamily: fontStack(font) }}>
                {languages[sampleLanguage].charset}
              </p>
              <p className="catalogue-card__badges">
                <Badge>{t.labels.classification[font.classification]}</Badge>
                {font.roles.map((item) => (
                  <Badge key={item}>{t.labels.role[item]}</Badge>
                ))}
                <Badge>{font.meta.variable ? t.catalogue.variable : t.catalogue.static}</Badge>
                <Badge>{font.meta.italic ? t.catalogue.italic : t.catalogue.noItalic}</Badge>
                {font.ubiquitous && <Badge tone="warning">{t.catalogue.ubiquitous}</Badge>}
              </p>
              <p className="catalogue-card__note">
                {contentText(font.note, locale)}
                {font.caveat && ` ${contentText(font.caveat, locale)}`}
              </p>
              <p className="catalogue-card__meta">
                <span lang="en">{font.meta.license}</span> · {font.meta.subsets.join(', ')} · {format(t.catalogue.size, { size: formatKilobytes(totalBytes(font), locale) })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
