import { useEffect, useSyncExternalStore } from 'react';
import type { LanguageCode } from '../data/languages.ts';
import { auditVersion, getAudit, requestAudit, subscribeAudits, type AuditEntry } from '../lib/auditStore.ts';
import { registerFonts } from '../lib/fontLoader.ts';
import { getFont } from '../lib/fonts.ts';

export function useRegisterFonts(ids: readonly (string | null | undefined)[]): void {
  const key = ids.join(',');
  useEffect(() => {
    registerFonts(key.split(',').map((id) => getFont(id)));
  }, [key]);
}

export function useGlyphAudits(ids: readonly string[], codes: readonly LanguageCode[], enabled = true): Map<string, AuditEntry> {
  useSyncExternalStore(subscribeAudits, auditVersion, auditVersion);
  const idKey = ids.join(',');
  const codeKey = codes.join(',');

  useEffect(() => {
    if (!enabled || codeKey === '') return;
    const languageList = codeKey.split(',') as LanguageCode[];
    for (const id of idKey.split(',')) if (id) requestAudit(id, languageList);
  }, [idKey, codeKey, enabled]);

  const result = new Map<string, AuditEntry>();
  for (const id of ids) {
    const entry = getAudit(id, codes);
    if (entry) result.set(id, entry);
  }
  return result;
}
