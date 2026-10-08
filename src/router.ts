import { useSyncExternalStore } from 'react';

export const projectTabs = ['setup', 'candidates', 'specimen', 'audit', 'export'] as const;
export type ProjectTab = (typeof projectTabs)[number];

export type Route =
  | { name: 'home' }
  | { name: 'catalogue' }
  | { name: 'guide' }
  | { name: 'legal' }
  | { name: 'privacy' }
  | { name: 'project'; id: string; tab: ProjectTab }
  | { name: 'share'; payload: string }
  | { name: 'notFound' };

const staticRoutes = { catalogue: 'catalogue', guide: 'guide', legal: 'legal', privacy: 'privacy' } as const;

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  const [first = '', second = '', third = ''] = path.split('/');
  if (first === '') return { name: 'home' };
  if (Object.hasOwn(staticRoutes, first)) return { name: first as keyof typeof staticRoutes };
  if (first === 'p' && /^[a-z0-9-]{1,64}$/.test(second)) {
    const tab = (projectTabs as readonly string[]).includes(third) ? (third as ProjectTab) : third === '' ? 'specimen' : null;
    return tab ? { name: 'project', id: second, tab } : { name: 'notFound' };
  }
  if (first === 'share' && second !== '') return { name: 'share', payload: second };
  return { name: 'notFound' };
}

export function href(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'project':
      return `#/p/${route.id}/${route.tab}`;
    case 'share':
      return `#/share/${route.payload}`;
    case 'notFound':
      return '#/404';
    default:
      return `#/${route.name}`;
  }
}

export function navigate(route: Route): void {
  window.location.hash = href(route);
}

function subscribe(listener: () => void): () => void {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}

function getHash(): string {
  return window.location.hash;
}

export function useHash(): string {
  return useSyncExternalStore(subscribe, getHash, () => '');
}

export function useRoute(): Route {
  return parseHash(useHash());
}
