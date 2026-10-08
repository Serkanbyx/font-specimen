import { useCallback } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';
import type { Project, ProjectInput } from '../lib/project.ts';
import { inputOf, toProject } from '../lib/projectOps.ts';
import { projectStore, useProject } from '../lib/storage.ts';
import { href, projectTabs, type ProjectTab } from '../router.ts';
import { AuditTab } from './project/AuditTab.tsx';
import { CandidatesTab } from './project/CandidatesTab.tsx';
import { ExportTab } from './project/ExportTab.tsx';
import { SetupTab } from './project/SetupTab.tsx';
import { SpecimenTab } from './project/SpecimenTab.tsx';

export type UpdateProject = (change: (input: ProjectInput) => ProjectInput) => string | null;

export interface TabProps {
  project: Project;
  update: UpdateProject;
}

export function ProjectPage({ id, tab }: { id: string; tab: ProjectTab }) {
  const { t } = useI18n();
  const project = useProject(id);
  useDocumentTitle(project ? `${t.project.tabs[tab]} · ${project.name}` : t.project.notFoundTitle);

  const update = useCallback<UpdateProject>(
    (change) => {
      const current = projectStore.get(id);
      if (!current) return 'missing';
      try {
        projectStore.save(toProject(change(inputOf(current)), id));
        return null;
      } catch (error) {
        return error instanceof Error ? error.message : String(error);
      }
    },
    [id],
  );

  if (!project) {
    return (
      <div className="page">
        <h1>{t.project.notFoundTitle}</h1>
        <p>{t.project.notFoundText}</p>
        <p>
          <a className="button" href={href({ name: 'home' })}>
            {t.notFound.back}
          </a>
        </p>
      </div>
    );
  }

  const props: TabProps = { project, update };
  return (
    <div className="project">
      <div className="project__bar">
        <p className="project__name">{project.name}</p>
        <nav aria-label={t.project.tabsLabel} className="tabs">
          <ul>
            {projectTabs.map((item) => (
              <li key={item}>
                <a href={href({ name: 'project', id, tab: item })} aria-current={item === tab ? 'page' : undefined}>
                  {t.project.tabs[item]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {tab === 'setup' && <SetupTab {...props} />}
      {tab === 'candidates' && <CandidatesTab {...props} />}
      {tab === 'specimen' && <SpecimenTab {...props} />}
      {tab === 'audit' && <AuditTab {...props} />}
      {tab === 'export' && <ExportTab {...props} />}
    </div>
  );
}
