import { useId, useState } from 'react';
import { Badge } from '../../components/Badge.tsx';
import { ColorField, TextField } from '../../components/fields.tsx';
import { languageCodes, languageName, languages, requiredSubsets, type LanguageCode } from '../../data/languages.ts';
import { tones, type FontRole, type Tone } from '../../data/types.ts';
import { useI18n } from '../../i18n/I18nProvider.tsx';
import { contrastLevel, contrastRatio } from '../../lib/contrast.ts';
import { fonts } from '../../lib/fonts.ts';
import { format } from '../../lib/format.ts';
import { colorTokens, type ProjectContent, type ProjectInput } from '../../lib/project.ts';
import { inputOf } from '../../lib/projectOps.ts';
import type { TabProps } from '../ProjectPage.tsx';

const pillRadius = 999;

export function SetupTab({ project, update }: TabProps) {
  const { t, locale } = useI18n();
  const [draft, setDraft] = useState<ProjectInput>(() => inputOf(project));
  const [status, setStatus] = useState<string>('');
  const [chipsText, setChipsText] = useState(() => project.content.chips.join(', '));
  const ids = { primary: useId(), currentHeading: useId(), currentBody: useId(), transform: useId(), control: useId(), card: useId() };

  const change = (next: ProjectInput) => {
    setDraft(next);
    const error = update(() => next);
    setStatus(error ? format(t.setup.invalid, { error }) : t.setup.saved);
  };
  const setContent = (patch: Partial<ProjectContent>) => change({ ...draft, content: { ...draft.content, ...patch } });
  const contentLang = draft.languages[0];

  const toggleTone = (tone: Tone) => {
    const has = draft.tones.includes(tone);
    if (has && draft.tones.length === 1) return;
    if (!has && draft.tones.length >= 4) return;
    change({ ...draft, tones: has ? draft.tones.filter((item) => item !== tone) : [...draft.tones, tone] });
  };

  const toggleLanguage = (code: LanguageCode) => {
    const has = draft.languages.includes(code);
    if (has && draft.languages.length === 1) return;
    change({ ...draft, languages: has ? draft.languages.filter((item) => item !== code) : [...draft.languages, code] });
  };

  const setPrimary = (code: LanguageCode) => {
    change({ ...draft, languages: [code, ...draft.languages.filter((item) => item !== code)] });
  };

  const setCurrent = (role: FontRole, id: string) => {
    change({ ...draft, currentFonts: { ...draft.currentFonts, [role]: id === '' ? null : id } });
  };

  const colors = draft.theme.colors;
  const contrastChecks = [
    { key: 'textOnBackground', fg: colors.text, bg: colors.background },
    { key: 'mutedOnBackground', fg: colors.muted, bg: colors.background },
    { key: 'textOnSurface', fg: colors.text, bg: colors.surface },
    { key: 'accentText', fg: colors.accentText, bg: colors.accent },
    { key: 'contrastText', fg: colors.contrastText, bg: colors.contrastBackground },
  ] as const;

  const sortedFonts = [...fonts].sort((a, b) => a.family.localeCompare(b.family));
  const facts = draft.content.facts;

  return (
    <div className="page setup">
      <header className="page-intro">
        <h1>{t.setup.title}</h1>
        <p className="lead">{t.setup.lead}</p>
        <p className="setup__status" role="status">
          {status}
        </p>
      </header>

      <form className="setup__form" onSubmit={(event) => event.preventDefault()} noValidate>
        <fieldset className="panel">
          <legend>{t.setup.brand}</legend>
          <TextField label={t.setup.name} value={draft.name} maxLength={80} required onChange={(name) => change({ ...draft, name })} />
          <fieldset className="choice-group">
            <legend>{t.setup.tones}</legend>
            <p className="field-hint">{t.setup.tonesHint}</p>
            <div className="chip-options">
              {tones.map((tone) => {
                const index = draft.tones.indexOf(tone);
                return (
                  <label key={tone} className="chip-option">
                    <input type="checkbox" checked={index !== -1} onChange={() => toggleTone(tone)} />
                    <span>{t.labels.tone[tone]}</span>
                    {index === 0 && draft.tones.length > 1 && <Badge tone="accent">1</Badge>}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </fieldset>

        <fieldset className="panel">
          <legend>{t.setup.languages}</legend>
          <p className="field-hint">{t.setup.languagesHint}</p>
          <div className="chip-options">
            {languageCodes.map((code) => {
              const label = languageName(code, locale);
              const native = languages[code].nativeName;
              return (
                <label key={code} className="chip-option">
                  <input type="checkbox" checked={draft.languages.includes(code)} onChange={() => toggleLanguage(code)} />
                  <span>
                    {label}
                    {label !== native && (
                      <span lang={code} className="muted">
                        {' '}
                        ({native})
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="field">
            <label htmlFor={ids.primary}>{t.setup.primaryLanguage}</label>
            <select id={ids.primary} value={contentLang} onChange={(event) => setPrimary(event.target.value as LanguageCode)}>
              {draft.languages.map((code) => (
                <option key={code} value={code}>
                  {languageName(code, locale)}
                </option>
              ))}
            </select>
          </div>
          <p className="field-hint">{format(t.setup.subsetsRequired, { subsets: requiredSubsets(draft.languages).join(', ') })}</p>
        </fieldset>

        <fieldset className="panel">
          <legend>{t.setup.currentFonts}</legend>
          <p className="field-hint">{t.setup.currentFontsHint}</p>
          <div className="field-row">
            {(['heading', 'body'] as const).map((role) => (
              <div className="field" key={role}>
                <label htmlFor={role === 'heading' ? ids.currentHeading : ids.currentBody}>
                  {role === 'heading' ? t.setup.currentHeading : t.setup.currentBody}
                </label>
                <select
                  id={role === 'heading' ? ids.currentHeading : ids.currentBody}
                  value={draft.currentFonts[role] ?? ''}
                  onChange={(event) => setCurrent(role, event.target.value)}
                >
                  <option value="">{t.setup.noneCurrent}</option>
                  {sortedFonts.map((font) => (
                    <option key={font.id} value={font.id} lang="en">
                      {font.family}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend>{t.setup.colours}</legend>
          <div className="color-grid">
            {colorTokens.map((token) => (
              <ColorField
                key={token}
                label={t.setup.colourLabels[token]}
                hexLabel={format(t.setup.hexLabel, { name: t.setup.colourLabels[token] })}
                value={colors[token]}
                onChange={(value) => change({ ...draft, theme: { ...draft.theme, colors: { ...colors, [token]: value } } })}
              />
            ))}
          </div>
          <h3 className="panel__subtitle">{t.setup.contrastTitle}</h3>
          <table className="data-table">
            <tbody>
              {contrastChecks.map((check) => {
                const valid = /^#[0-9a-f]{6}$/i.test(check.fg) && /^#[0-9a-f]{6}$/i.test(check.bg);
                const ratio = valid ? contrastRatio(check.fg, check.bg) : 0;
                const level = contrastLevel(ratio);
                return (
                  <tr key={check.key}>
                    <th scope="row">{t.setup.contrastPairs[check.key]}</th>
                    <td className="numeric">{valid ? `${ratio.toFixed(2)}:1` : '—'}</td>
                    <td>
                      <Badge tone={level === 'fail' ? 'warning' : level === 'AA-large' ? 'neutral' : 'success'}>
                        {t.setup.contrastLevels[level]}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </fieldset>

        <fieldset className="panel">
          <legend>{t.setup.shape}</legend>
          <div className="field-row">
            <div className="field">
              <label htmlFor={ids.control}>
                {t.setup.controlRadius}: {draft.theme.radius.control === pillRadius ? t.setup.pill : `${draft.theme.radius.control}px`}
              </label>
              <input
                id={ids.control}
                type="range"
                min={0}
                max={32}
                value={Math.min(draft.theme.radius.control, 32)}
                disabled={draft.theme.radius.control === pillRadius}
                onChange={(event) => change({ ...draft, theme: { ...draft.theme, radius: { ...draft.theme.radius, control: Number(event.target.value) } } })}
              />
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={draft.theme.radius.control === pillRadius}
                  onChange={(event) =>
                    change({ ...draft, theme: { ...draft.theme, radius: { ...draft.theme.radius, control: event.target.checked ? pillRadius : 8 } } })
                  }
                />
                {t.setup.pill}
              </label>
            </div>
            <div className="field">
              <label htmlFor={ids.card}>
                {t.setup.cardRadius}: {draft.theme.radius.card}px
              </label>
              <input
                id={ids.card}
                type="range"
                min={0}
                max={48}
                value={draft.theme.radius.card}
                onChange={(event) => change({ ...draft, theme: { ...draft.theme, radius: { ...draft.theme.radius, card: Number(event.target.value) } } })}
              />
            </div>
            <div className="field">
              <label htmlFor={ids.transform}>{t.setup.headingTransform}</label>
              <select
                id={ids.transform}
                value={draft.theme.headingTransform}
                onChange={(event) => change({ ...draft, theme: { ...draft.theme, headingTransform: event.target.value === 'uppercase' ? 'uppercase' : 'none' } })}
              >
                <option value="none">{t.setup.transformNone}</option>
                <option value="uppercase">{t.setup.transformUpper}</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend>{t.setup.content}</legend>
          <p className="field-hint">{t.setup.contentHint}</p>
          <TextField label={t.setup.fields.headline} value={draft.content.headline} maxLength={160} required lang={contentLang} onChange={(headline) => setContent({ headline })} />
          <TextField label={t.setup.fields.intro} value={draft.content.intro} maxLength={420} multiline lang={contentLang} onChange={(intro) => setContent({ intro })} />
          <div className="field-row">
            <TextField label={t.setup.fields.primaryAction} value={draft.content.primaryAction} maxLength={40} lang={contentLang} onChange={(primaryAction) => setContent({ primaryAction })} />
            <TextField label={t.setup.fields.secondaryAction} value={draft.content.secondaryAction} maxLength={40} lang={contentLang} onChange={(secondaryAction) => setContent({ secondaryAction })} />
          </div>

          <fieldset className="subgroup">
            <legend>{t.setup.facts}</legend>
            {facts.map((fact, index) => (
              <div className="field-row" key={index}>
                <TextField
                  label={format(t.setup.fields.factValue, { n: index + 1 })}
                  value={fact.value}
                  maxLength={16}
                  lang={contentLang}
                  onChange={(value) => setContent({ facts: facts.map((item, i) => (i === index ? { ...item, value } : item)) })}
                />
                <TextField
                  label={format(t.setup.fields.factLabel, { n: index + 1 })}
                  value={fact.label}
                  maxLength={60}
                  lang={contentLang}
                  onChange={(label) => setContent({ facts: facts.map((item, i) => (i === index ? { ...item, label } : item)) })}
                />
              </div>
            ))}
            {facts.length < 3 ? (
              <button type="button" className="button button--small" onClick={() => setContent({ facts: [...facts, { value: '1', label: '…' }] })}>
                {t.setup.addFact}
              </button>
            ) : (
              <button type="button" className="button button--small" onClick={() => setContent({ facts: facts.slice(0, 2) })}>
                {t.setup.removeFact}
              </button>
            )}
          </fieldset>

          <fieldset className="subgroup">
            <legend>{t.setup.services}</legend>
            {draft.content.services.map((service, index) => (
              <div className="field-row" key={index}>
                <TextField
                  label={format(t.setup.fields.serviceTitle, { n: index + 1 })}
                  value={service.title}
                  maxLength={60}
                  lang={contentLang}
                  onChange={(title) => setContent({ services: draft.content.services.map((item, i) => (i === index ? { ...item, title } : item)) })}
                />
                <TextField
                  label={format(t.setup.fields.serviceDescription, { n: index + 1 })}
                  value={service.description}
                  maxLength={220}
                  lang={contentLang}
                  onChange={(description) =>
                    setContent({ services: draft.content.services.map((item, i) => (i === index ? { ...item, description } : item)) })
                  }
                />
              </div>
            ))}
          </fieldset>

          <fieldset className="subgroup">
            <legend>{t.setup.contrastSection}</legend>
            <TextField label={t.setup.fields.contrastHeading} value={draft.content.contrastHeading} maxLength={140} lang={contentLang} onChange={(contrastHeading) => setContent({ contrastHeading })} />
            <TextField label={t.setup.fields.contrastQuestion} value={draft.content.contrastQuestion} maxLength={160} lang={contentLang} onChange={(contrastQuestion) => setContent({ contrastQuestion })} />
            <TextField
              label={t.setup.fields.chips}
              value={chipsText}
              maxLength={6 * 34}
              lang={contentLang}
              onChange={(value) => {
                setChipsText(value);
                const chips = value.split(',').map((chip) => chip.trim().slice(0, 32)).filter(Boolean).slice(0, 6);
                setContent({ chips: chips.length > 0 ? chips : ['…'] });
              }}
            />
          </fieldset>

          <fieldset className="subgroup">
            <legend>{t.setup.textSection}</legend>
            <TextField label={t.setup.fields.textHeading} value={draft.content.textHeading} maxLength={140} lang={contentLang} onChange={(textHeading) => setContent({ textHeading })} />
            <TextField label={t.setup.fields.textBody} value={draft.content.textBody} maxLength={1200} multiline lang={contentLang} onChange={(textBody) => setContent({ textBody })} />
            <TextField label={t.setup.fields.labelLine} value={draft.content.labelLine} maxLength={90} lang={contentLang} onChange={(labelLine) => setContent({ labelLine })} />
          </fieldset>

          <fieldset className="subgroup">
            <legend>{t.setup.table}</legend>
            <TextField label={t.setup.fields.tableTitle} value={draft.content.tableTitle} maxLength={60} lang={contentLang} onChange={(tableTitle) => setContent({ tableTitle })} />
            {draft.content.table.map((row, index) => (
              <div className="field-row" key={index}>
                <TextField
                  label={format(t.setup.fields.rowLabel, { n: index + 1 })}
                  value={row.label}
                  maxLength={40}
                  lang={contentLang}
                  onChange={(label) => setContent({ table: draft.content.table.map((item, i) => (i === index ? { ...item, label } : item)) })}
                />
                <TextField
                  label={format(t.setup.fields.rowValue, { n: index + 1 })}
                  value={row.value}
                  maxLength={40}
                  lang={contentLang}
                  onChange={(value) => setContent({ table: draft.content.table.map((item, i) => (i === index ? { ...item, value } : item)) })}
                />
              </div>
            ))}
          </fieldset>
        </fieldset>
      </form>
    </div>
  );
}
