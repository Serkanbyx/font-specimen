import { useId } from 'react';
import { CopyButton } from './CopyButton.tsx';

interface CodeBlockProps {
  title: string;
  hint?: string;
  code: string;
}

export function CodeBlock({ title, hint, code }: CodeBlockProps) {
  const titleId = useId();
  return (
    <section className="code-block" aria-labelledby={titleId}>
      <div className="code-block__header">
        <div>
          <h3 id={titleId} className="code-block__title">
            {title}
          </h3>
          {hint && <p className="code-block__hint">{hint}</p>}
        </div>
        <CopyButton text={code} className="button button--small" />
      </div>
      {/* Scrollable regions need to be focusable so keyboard users can scroll them. */}
      <pre className="code-block__code" tabIndex={0} aria-labelledby={titleId}>
        <code>{code}</code>
      </pre>
    </section>
  );
}
