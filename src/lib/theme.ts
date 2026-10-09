import { useSyncExternalStore } from 'react';

/** Keep in sync with public/theme-init.js. */
export const themeKey = 'font-specimen:theme';

export const themeModes = ['system', 'light', 'dark'] as const;
export type ThemeMode = (typeof themeModes)[number];
export type ResolvedTheme = 'light' | 'dark';

export function resolveTheme(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (mode === 'system') return prefersDark ? 'dark' : 'light';
  return mode;
}

function readStored(): ThemeMode {
  try {
    const stored = localStorage.getItem(themeKey);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // Storage can be blocked; follow the system for this visit.
  }
  return 'system';
}

let mode: ThemeMode = 'system';
let initialized = false;
let bound = false;
const listeners = new Set<() => void>();

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(): void {
  if (typeof document === 'undefined') return;
  const resolved = resolveTheme(mode, prefersDark());
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

function publish(): void {
  applyTheme();
  for (const listener of listeners) listener();
}

function ensureMode(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  mode = readStored();
}

export function bindTheme(): void {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  ensureMode();
  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (mode === 'system') publish();
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== null && event.key !== themeKey) return;
    mode = readStored();
    initialized = true;
    publish();
  });
}

export function getThemeMode(): ThemeMode {
  ensureMode();
  return mode;
}

export function setThemeMode(next: ThemeMode): void {
  mode = next;
  initialized = true;
  try {
    if (next === 'system') localStorage.removeItem(themeKey);
    else localStorage.setItem(themeKey, next);
  } catch {
    // The choice still applies for this visit.
  }
  publish();
}

/** Drops a saved choice. Called when local site data is deleted. */
export function resetTheme(): void {
  mode = 'system';
  initialized = true;
  try {
    localStorage.removeItem(themeKey);
  } catch {
    // Already gone, or storage is blocked.
  }
  publish();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, getThemeMode, () => 'system');
}
