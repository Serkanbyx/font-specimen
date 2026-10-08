import { useEffect, useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock.tsx';
import { CopyButton } from '../../components/CopyButton.tsx';
import { requiredSubsets } from '../../data/languages.ts';
import { useI18n } from '../../i18n/I18nProvider.tsx';
import { downloadProject } from '../../lib/download.ts';
import { getFont } from '../../lib/fonts.ts';
import { format } from '../../lib/format.ts';
import { inputOf } from '../../lib/projectOps.ts';
import { encodeShare } from '../../lib/share.ts';
import { cssVariablesSnippet, fontFaceSnippet, fontsourceSnippet, nextFontSnippet } from '../../lib/snippets.ts';
import { href } from '../../router.ts';
import type { TabProps } from '../ProjectPage.tsx';

function useShareLink(input: ReturnType<typeof inputOf>): string | null {
  const [link, setLink] = useState<string | null>(null);
  const serialized = JSON.stringify(input);
  useEffect(() => {
    let cancelled = false;
    void encodeShare(JSON.parse(serialized)).then((payload) => {
      if (cancelled) return;
      const base = `${window.location.origin}${window.location.pathname}`;
      setLink(`${base}${href({ name: 'share', payload })}`);
    });
    return () => {
      cancelled = true;
    };
  }, [serialized]);
  return link;
}

export function ExportTab({ project }: TabProps) {
  const { t } = useI18n();
  const heading = getFont(project.selection.heading);
  const body = getFont(project.selection.body);
  const shareLink = useShareLink(inputOf(project));

  if (!heading || !body) {
    return (
      <div className="page">
        <h1>{t.export.title}</h1>
        <p>{t.export.nothingSelected}</p>
      </div>
    );
  }

  const subsets = requiredSubsets(project.languages);
  const input = { heading, body, subsets };
  const fontsource = fontsourceSnippet(input);
  const prompt = format(t.export.prompt, { heading: heading.family, body: body.family, subsets: subsets.join(', ') });

  return (
    <div className="page export">
      <header className="page-intro">
        <h1>{t.export.title}</h1>
        <p className="lead">{t.export.lead}</p>
        <p className="export__summary">
          {format(t.specimen.summary, { heading: heading.family, body: body.family })}
        </p>
      </header>

      <section className="panel" aria-labelledby="single-file">
        <h2 id="single-file">{t.export.singleFileTitle}</h2>
        <p>{t.export.singleFileText}</p>
        <p className="muted small">{t.export.licenceReminder}</p>
      </section>

      <div className="code-stack">
        <CodeBlock title={t.export.nextTitle} hint={t.export.nextHint} code={nextFontSnippet(input)} />
        <CodeBlock title={t.export.fontsourceTitle} hint={t.export.fontsourceHint} code={`${fontsource.install}\n\n${fontsource.code}`} />
        <CodeBlock title={t.export.variablesTitle} code={cssVariablesSnippet(input)} />
        <CodeBlock title={t.export.fontFaceTitle} hint={t.export.fontFaceHint} code={fontFaceSnippet(input)} />
        <CodeBlock title={t.export.promptTitle} hint={t.export.promptHint} code={prompt} />
      </div>

      <section className="panel" aria-labelledby="share-title">
        <h2 id="share-title">{t.export.shareTitle}</h2>
        <p>{t.export.shareHint}</p>
        <div className="toolbar">
          {shareLink && <CopyButton text={shareLink} label={t.export.copyLink} />}
          <button type="button" className="button" onClick={() => downloadProject(project)}>
            {t.export.downloadJson}
          </button>
        </div>
      </section>
    </div>
  );
}
