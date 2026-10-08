import { useCallback, useEffect, useRef, useState } from 'react';

export type CopyState = 'idle' | 'copied' | 'failed';

/** Embedded browsers and insecure origins can deny the async clipboard; a selected textarea still works there. */
function copyWithSelection(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.className = 'visually-hidden';
  document.body.appendChild(textarea);
  const previousFocus = document.activeElement as HTMLElement | null;
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    textarea.remove();
    previousFocus?.focus();
  }
  return copied;
}

export function useCopy(resetAfter = 2000): [CopyState, (text: string) => Promise<void>] {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setState('copied');
      } catch {
        setState(copyWithSelection(text) ? 'copied' : 'failed');
      }
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState('idle'), resetAfter);
    },
    [resetAfter],
  );

  return [state, copy];
}
