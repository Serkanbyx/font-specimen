import { describe, expect, it } from 'vitest';
import { href, parseHash, type Route } from './router.ts';

describe('router', () => {
  it('parses known routes', () => {
    expect(parseHash('')).toEqual({ name: 'home' });
    expect(parseHash('#/')).toEqual({ name: 'home' });
    expect(parseHash('#/catalogue')).toEqual({ name: 'catalogue' });
    expect(parseHash('#/p/abc-123/audit')).toEqual({ name: 'project', id: 'abc-123', tab: 'audit' });
    expect(parseHash('#/p/abc-123')).toEqual({ name: 'project', id: 'abc-123', tab: 'specimen' });
    expect(parseHash('#/share/xyz')).toEqual({ name: 'share', payload: 'xyz' });
  });

  it('rejects unknown or unsafe paths', () => {
    expect(parseHash('#/p/abc/unknown')).toEqual({ name: 'notFound' });
    expect(parseHash('#/p/../etc/setup')).toEqual({ name: 'notFound' });
    expect(parseHash('#/constructor')).toEqual({ name: 'notFound' });
    expect(parseHash('#main')).toEqual({ name: 'notFound' });
  });

  it('round-trips through href', () => {
    const routes: Route[] = [
      { name: 'home' },
      { name: 'legal' },
      { name: 'project', id: 'x1', tab: 'export' },
      { name: 'share', payload: 'abc' },
    ];
    for (const route of routes) expect(parseHash(href(route))).toEqual(route);
  });
});
