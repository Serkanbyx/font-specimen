import type { CSSProperties } from 'react';
import { fontStack, headingWeight, type FontRecord } from '../lib/fonts.ts';

interface FontNameProps {
  font: FontRecord;
  /** Render the name in its own typeface. */
  styled?: boolean;
  role?: 'heading' | 'body';
  className?: string;
}

/**
 * Family names are English proper nouns. Marking them lang="en" keeps a
 * Turkish page from uppercasing "i" in "Fraunces Italic" to "İ".
 */
export function FontName({ font, styled = false, role = 'body', className }: FontNameProps) {
  const style: CSSProperties | undefined = styled
    ? { fontFamily: fontStack(font), fontWeight: role === 'heading' ? headingWeight(font) : 400 }
    : undefined;
  return (
    <span lang="en" className={className} style={style}>
      {font.family}
    </span>
  );
}
