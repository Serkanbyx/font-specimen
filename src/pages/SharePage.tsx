import { useEffect, useState } from 'react';
import { languageName } from '../data/languages.ts';
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';
import { getFont } from '../lib/fonts.ts';
import { format, formatList } from '../lib/format.ts';
import type { ProjectInput } from '../lib/project.ts';
import { normalizeInput, toProject } from '../lib/projectOps.ts';
import { decodeShare } from '../lib/share.ts';
import { projectStore } from '../lib/storage.ts';
import { href, navigate } from '../router.ts';

type State = { status: 'loading' } | { status: 'error'; error: string } | { status: 'ready'; input: ProjectInput };

export function SharePage({ payload }: { payload: string }) {
  const { t, locale } = useI18n();
  useDocumentTitle(t.share.title);
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    void decodeShare(payload).then((result) => {
      if (cancelled) return;
      setState(result.ok ? { status: 'ready', input: normalizeInput(result.input) } : { status: 'error', error: result.error });
    });
    return () => {
      cancelled = true;
    };
  }, [payload]);

  const save = (input: ProjectInput) => {
    const project = toProject(input);
    projectStore.save(project);
    navigate({ name: 'project', id: project.id, tab: 'specimen' });
  };

  return (
    <div className="page">
      <h1>{t.share.title}</h1>
      {state.status === 'loading' && <p>{t.common.loading}</p>}
      {state.status === 'error' && (
        <>
          <p role="alert">{format(t.share.invalid, { error: state.error })}</p>
          <p>
            <a className="button" href={href({ name: 'home' })}>
              {t.notFound.back}
            </a>
          </p>
        </>
      )}
      {state.status === 'ready' && (
        <div className="panel">
          <p>{t.share.intro}</p>
          <h2>{state.input.name}</h2>
          <p className="muted">
            {format(t.share.languages, { languages: formatList(state.input.languages.map((code) => languageName(code, locale)), locale) })}
          </p>
          <p>
            {format(t.specimen.summary, {
              heading: getFont(state.input.selection.heading)?.family ?? '—',
              body: getFont(state.input.selection.body)?.family ?? '—',
            })}
          </p>
          <button type="button" className="button button--primary" onClick={() => save(state.input)}>
            {t.share.save}
          </button>
        </div>
      )}
    </div>
  );
}
