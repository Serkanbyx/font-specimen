import type { LanguageCode } from '../data/languages.ts';
import { getFont } from './fonts.ts';
import { auditFont, type GlyphAuditResult } from './glyphAudit.ts';

export type AuditEntry =
  | { status: 'pending' }
  | { status: 'done'; result: GlyphAuditResult }
  | { status: 'error'; message: string };

const entries = new Map<string, AuditEntry>();
const listeners = new Set<() => void>();
const queue: { key: string; fontId: string; codes: LanguageCode[] }[] = [];
let running = false;
let version = 0;

export function auditKey(fontId: string, codes: readonly LanguageCode[]): string {
  return `${fontId}|${[...codes].sort().join(',')}`;
}

function notify(): void {
  version++;
  for (const listener of listeners) listener();
}

async function drain(): Promise<void> {
  if (running) return;
  running = true;
  for (let job = queue.shift(); job; job = queue.shift()) {
    const font = getFont(job.fontId);
    try {
      if (!font) throw new Error(`Unknown font ${job.fontId}`);
      entries.set(job.key, { status: 'done', result: await auditFont(font, job.codes) });
    } catch (error) {
      entries.set(job.key, { status: 'error', message: error instanceof Error ? error.message : String(error) });
    }
    notify();
    // Yield so a long audit queue never blocks input handling.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  running = false;
}

export function requestAudit(fontId: string, codes: readonly LanguageCode[]): void {
  const key = auditKey(fontId, codes);
  if (entries.has(key)) return;
  entries.set(key, { status: 'pending' });
  queue.push({ key, fontId, codes: [...codes] });
  void drain();
}

export function getAudit(fontId: string, codes: readonly LanguageCode[]): AuditEntry | undefined {
  return entries.get(auditKey(fontId, codes));
}

export function subscribeAudits(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function auditVersion(): number {
  return version;
}
