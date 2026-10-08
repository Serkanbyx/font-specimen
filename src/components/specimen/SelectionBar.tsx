import { useEffect, useId, useRef } from 'react';
import type { FontRole } from '../../data/types.ts';
import { useI18n } from '../../i18n/I18nProvider.tsx';
import { getFont, type FontRecord } from '../../lib/fonts.ts';
import { format } from '../../lib/format.ts';
import { Badge } from '../Badge.tsx';
import { CopyButton } from '../CopyButton.tsx';
import { FontName } from '../FontName.tsx';

interface SelectionBarProps {
  candidates: { heading: readonly string[]; body: readonly string[] };
  selection: { heading: FontRecord; body: FontRecord };
  current: { heading: string | null; body: string | null };
  onSelect: (role: FontRole, id: string) => void;
}

function RoleGroup({
  role,
  ids,
  selected,
  current,
  onSelect,
}: {
  role: FontRole;
  ids: readonly string[];
  selected: string;
  current: string | null;
  onSelect: (role: FontRole, id: string) => void;
}) {
  const { t } = useI18n();
  const name = useId();
  const optionsRef = useRef<HTMLDivElement>(null);

  // On mobile the options scroll sideways; without this the checked face can sit off-screen.
  useEffect(() => {
    const container = optionsRef.current;
    const checked = container?.querySelector<HTMLElement>('input:checked')?.closest('label');
    if (!container || !checked || container.scrollWidth <= container.clientWidth) return;
    const start = checked.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft;
    const end = start + checked.offsetWidth;
    if (start < container.scrollLeft) container.scrollLeft = start;
    else if (end > container.scrollLeft + container.clientWidth) container.scrollLeft = end - container.clientWidth;
  }, [selected]);

  return (
    <fieldset className="selection-bar__group">
      <legend>{role === 'heading' ? t.common.heading : t.common.body}</legend>
      <div className="selection-bar__options" ref={optionsRef}>
        {ids.map((id) => {
          const font = getFont(id);
          if (!font) return null;
          return (
            <label key={id} className="selection-option">
              <input
                type="radio"
                name={name}
                value={id}
                checked={selected === id}
                onChange={() => onSelect(role, id)}
              />
              <span className="selection-option__label">
                <FontName font={font} styled role={role} />
                {current === id && <Badge tone="accent">{t.common.current}</Badge>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SelectionBar({ candidates, selection, current, onSelect }: SelectionBarProps) {
  const { t } = useI18n();
  const summary = format(t.specimen.summary, { heading: selection.heading.family, body: selection.body.family });
  const barRef = useRef<HTMLElement>(null);

  // The bar's height changes with wrapping, so the page's scroll padding has to follow it.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--sticky-offset', `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    });
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--sticky-offset');
    };
  }, []);

  return (
    <section className="selection-bar" aria-label={t.specimen.selectionLabel} ref={barRef}>
      <div className="selection-bar__groups">
        <RoleGroup role="heading" ids={candidates.heading} selected={selection.heading.id} current={current.heading} onSelect={onSelect} />
        <RoleGroup role="body" ids={candidates.body} selected={selection.body.id} current={current.body} onSelect={onSelect} />
      </div>
      <div className="selection-bar__summary">
        <p aria-live="polite">{summary}</p>
        <CopyButton text={summary} label={t.specimen.copySelection} className="button button--primary button--small" />
      </div>
    </section>
  );
}
