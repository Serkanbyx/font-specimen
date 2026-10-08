import { useSyncExternalStore } from 'react';
import { projectSchema, type Project } from './project.ts';

const projectsKey = 'font-specimen:projects:v1';
export const storageKeys = [projectsKey, 'font-specimen:locale'] as const;

let cache: Project[] | null = null;
let lastError: string | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): Project[] {
  try {
    const raw = localStorage.getItem(projectsKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Invalid entries (manual edits, older shapes) are skipped instead of breaking the app.
    return parsed.flatMap((item) => {
      const result = projectSchema.safeParse(item);
      return result.success ? [result.data] : [];
    });
  } catch {
    return [];
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function persist(projects: Project[]): void {
  cache = projects;
  try {
    localStorage.setItem(projectsKey, JSON.stringify(projects));
    lastError = null;
  } catch (error) {
    lastError = error instanceof Error ? error.message : 'Storage is unavailable.';
  }
  emit();
}

function getAll(): Project[] {
  cache ??= readFromStorage();
  return cache;
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== projectsKey && event.key !== null) return;
    cache = readFromStorage();
    emit();
  });
}

export const projectStore = {
  getAll,
  get(id: string): Project | undefined {
    return getAll().find((project) => project.id === id);
  },
  save(project: Project): void {
    const next = { ...project, updatedAt: new Date().toISOString() };
    const all = getAll();
    const index = all.findIndex((item) => item.id === project.id);
    persist(index === -1 ? [next, ...all] : all.map((item) => (item.id === project.id ? next : item)));
  },
  remove(id: string): void {
    persist(getAll().filter((project) => project.id !== id));
  },
  clearAll(): void {
    cache = [];
    try {
      for (const key of storageKeys) localStorage.removeItem(key);
    } catch {
      // Storage may be disabled; there is nothing left to clear then.
    }
    emit();
  },
  lastError(): string | null {
    return lastError;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useProjects(): Project[] {
  return useSyncExternalStore(projectStore.subscribe, getAll, getAll);
}

export function useProject(id: string): Project | undefined {
  const projects = useProjects();
  return projects.find((project) => project.id === id);
}
