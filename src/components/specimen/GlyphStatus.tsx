import { useI18n } from '../../i18n/I18nProvider.tsx';
import type { AuditEntry } from '../../lib/auditStore.ts';
import { format } from '../../lib/format.ts';
import type { GlyphIssue } from '../../lib/glyphCheck.ts';
import type { Messages } from '../../i18n/en.ts';

export function describeIssue(issue: GlyphIssue, t: Messages): string {
  return format(t.audit.issue[issue.kind], { glyph: issue.glyph, base: issue.base ?? '' });
}

export function GlyphStatus({ entry, compact = false }: { entry: AuditEntry | undefined; compact?: boolean }) {
  const { t } = useI18n();
  if (!entry || entry.status === 'pending') {
    return <span className="glyph-status glyph-status--pending">{compact ? t.audit.status.pending : t.specimen.glyphPending}</span>;
  }
  if (entry.status === 'error') {
    return <span className="glyph-status glyph-status--error">{t.audit.status.error}</span>;
  }
  const { issues } = entry.result;
  if (issues.length === 0) {
    return <span className="glyph-status glyph-status--ok">{compact ? t.audit.status.ok : t.specimen.glyphOk}</span>;
  }
  const list = issues.map((issue) => describeIssue(issue, t)).join(', ');
  return (
    <span className="glyph-status glyph-status--issues">
      {compact ? `${t.audit.status.issues}: ${list}` : format(t.specimen.glyphIssues, { list })}
    </span>
  );
}
