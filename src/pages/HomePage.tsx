import { useId, useState, type ChangeEvent, type CSSProperties } from 'react';
import { FontName } from '../components/FontName.tsx';
import { languageName } from '../data/languages.ts';
import { presets } from '../data/presets.ts';
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts';
import { useRegisterFonts } from '../hooks/useFonts.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';
import { downloadProject } from '../lib/download.ts';
import { getFont } from '../lib/fonts.ts';
import { contentText, format, formatDate, formatList } from '../lib/format.ts';
import { describeIssue, projectSchema, projectInputSchema, type Project } from '../lib/project.ts';
import { blankProject, inputOf, projectFromPreset, toProject } from '../lib/projectOps.ts';
import { projectStore, useProjects } from '../lib/storage.ts';
import { href, navigate } from '../router.ts';

const maxImportBytes = 200_000;

function ProjectCard({ project }: { project: Project }) {
  const { t, locale } = useI18n();
  const heading = getFont(project.selection.heading);
  const body = getFont(project.selection.body);

  const duplicate = () => {
    const copy = toProject({ ...inputOf(project), name: `${project.name} (${t.common.copySuffix})`.slice(0, 80) });
    projectStore.save(copy);
  };

  const remove = () => {
    if (window.confirm(format(t.home.deleteConfirm, { name: project.name }))) projectStore.remove(project.id);
  };

  return (
    <li className="project-card">
      <h3 className="project-card__title">
        <a href={href({ name: 'project', id: project.id, tab: 'specimen' })}>{project.name}</a>
      </h3>
      <p className="project-card__meta">
        {formatList(project.languages.map((code) => languageName(code, locale)), locale)}
        {' · '}
        {project.tones.map((tone) => t.labels.tone[tone]).join(', ')}
      </p>
      {heading && body && (
        <p className="project-card__pair">
          <FontName font={heading} styled role="heading" className="project-card__heading" />
          <FontName font={body} styled className="project-card__body" />
        </p>
      )}
      <p className="project-card__updated">{format(t.home.updated, { date: formatDate(project.updatedAt, locale) })}</p>
      <div className="project-card__actions">
        <a
          className="button button--small button--primary"
          href={href({ name: 'project', id: project.id, tab: 'specimen' })}
          aria-label={`${t.common.open}: ${project.name}`}
        >
          {t.common.open}
        </a>
        <button type="button" className="button button--small" onClick={duplicate} aria-label={`${t.common.duplicate}: ${project.name}`}>
          {t.common.duplicate}
        </button>
        <button
          type="button"
          className="button button--small"
          onClick={() => downloadProject(project)}
          aria-label={`${t.common.exportJson}: ${project.name}`}
        >
          {t.common.exportJson}
        </button>
        <button type="button" className="button button--small button--danger" onClick={remove} aria-label={`${t.common.delete}: ${project.name}`}>
          {t.common.delete}
        </button>
      </div>
    </li>
  );
}

export function HomePage() {
  const { t, locale } = useI18n();
  const projects = useProjects();
  const importId = useId();
  const [importError, setImportError] = useState<string | null>(null);
  useDocumentTitle('');
  useRegisterFonts(projects.flatMap((project) => [project.selection.heading, project.selection.body]));

  const create = (project: Project) => {
    projectStore.save(project);
    navigate({ name: 'project', id: project.id, tab: 'specimen' });
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > maxImportBytes) throw new Error('file is too large');
      const data: unknown = JSON.parse(await file.text());
      // Accept both full saved projects and bare inputs; the id is always regenerated.
      const full = projectSchema.safeParse(data);
      const input = full.success ? { success: true as const, data: inputOf(full.data) } : projectInputSchema.safeParse(data);
      if (!input.success) throw new Error(describeIssue(input.error));
      setImportError(null);
      create(toProject(input.data));
    } catch (error) {
      setImportError(format(t.home.importError, { error: error instanceof Error ? error.message : String(error) }));
    }
  };

  return (
    <div className="page">
      <header className="page-intro">
        <h1>{t.home.title}</h1>
        <p className="lead">{t.home.lead}</p>
      </header>

      <section className="section" aria-labelledby="projects-title">
        <h2 id="projects-title">{t.home.projectsTitle}</h2>
        {projects.length === 0 ? (
          <p className="muted">{t.home.empty}</p>
        ) : (
          <ul className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
        )}
        <p className="muted small">{t.home.storageNote}</p>
      </section>

      <section className="section" aria-labelledby="new-title">
        <h2 id="new-title">{t.home.newTitle}</h2>
        <p className="muted">{t.home.presetsLead}</p>
        <ul className="preset-grid">
          {presets.map((preset) => {
            const swatches = [preset.project.theme.colors.background, preset.project.theme.colors.accent, preset.project.theme.colors.contrastBackground];
            return (
              <li key={preset.id} className="preset-card">
                <button type="button" className="preset-card__button" onClick={() => create(projectFromPreset(preset))}>
                  <span className="preset-card__swatches" aria-hidden="true">
                    {swatches.map((color) => (
                      <span key={color} className="swatch" style={{ '--swatch': color } as CSSProperties} />
                    ))}
                  </span>
                  <span className="preset-card__name">{preset.project.name}</span>
                  <span className="preset-card__summary">{contentText(preset.summary, locale)}</span>
                </button>
              </li>
            );
          })}
          <li className="preset-card">
            <button type="button" className="preset-card__button" onClick={() => create(blankProject(locale))}>
              <span className="preset-card__name">{t.home.blank}</span>
              <span className="preset-card__summary">{t.home.blankHint}</span>
            </button>
          </li>
        </ul>
        <div className="import-field">
          <label htmlFor={importId}>{t.home.importLabel}</label>
          <input id={importId} type="file" accept="application/json,.json" onChange={(event) => void handleImport(event)} />
          {importError && (
            <p className="field-error" role="alert">
              {importError}
            </p>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <h2 id="how-title">{t.home.howTitle}</h2>
        <ol className="steps">
          {t.home.steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
