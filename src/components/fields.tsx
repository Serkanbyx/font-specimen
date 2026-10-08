import { useId } from 'react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  multiline?: boolean;
  required?: boolean;
  lang?: string;
}

export function TextField({ label, value, onChange, maxLength, multiline = false, required = false, lang }: TextFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          maxLength={maxLength}
          required={required}
          rows={4}
          lang={lang}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          maxLength={maxLength}
          required={required}
          lang={lang}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  hexLabel: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, hexLabel, value, onChange }: ColorFieldProps) {
  const id = useId();
  return (
    <div className="field field--color">
      <label htmlFor={id}>{label}</label>
      <div className="field__color-row">
        <input id={id} type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <input
          type="text"
          aria-label={hexLabel}
          value={value}
          maxLength={7}
          spellCheck={false}
          pattern="#[0-9a-fA-F]{6}"
          onChange={(event) => onChange(event.target.value.trim())}
        />
      </div>
    </div>
  );
}
