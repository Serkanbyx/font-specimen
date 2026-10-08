import { useCopy } from '../hooks/useCopy.ts';
import { useI18n } from '../i18n/I18nProvider.tsx';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label, className = 'button' }: CopyButtonProps) {
  const { t } = useI18n();
  const [state, copy] = useCopy();
  const idleLabel = label ?? t.common.copy;
  return (
    <span className="copy-button">
      <button type="button" className={className} onClick={() => void copy(text)}>
        {state === 'copied' ? t.common.copied : idleLabel}
      </button>
      <span className="visually-hidden" role="status">
        {state === 'copied' ? t.common.copied : state === 'failed' ? t.common.copyFailed : ''}
      </span>
      {state === 'failed' && <span className="copy-button__error">{t.common.copyFailed}</span>}
    </span>
  );
}
