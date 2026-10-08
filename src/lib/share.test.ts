import { describe, expect, it } from 'vitest';
import { presets } from '../data/presets.ts';
import { inputOf, projectFromPreset } from './projectOps.ts';
import { decodeShare, encodeShare, maxEncodedLength } from './share.ts';

describe('share links', () => {
  it('round-trips a project', async () => {
    const input = inputOf(projectFromPreset(presets[0]!));
    const payload = await encodeShare(input);
    expect(payload).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(payload.length).toBeLessThan(maxEncodedLength);
    const result = await decodeShare(payload);
    expect(result).toEqual({ ok: true, input });
  });

  it('rejects garbage', async () => {
    expect((await decodeShare('not*base64')).ok).toBe(false);
    expect((await decodeShare('AAAA')).ok).toBe(false);
  });

  it('rejects oversized payloads before decoding', async () => {
    expect((await decodeShare('A'.repeat(maxEncodedLength + 1))).ok).toBe(false);
  });

  it('rejects valid compression that decodes to an invalid project', async () => {
    const bytes = new TextEncoder().encode(JSON.stringify({ name: '<script>' }));
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    const compressed = new Uint8Array(await new Response(stream).arrayBuffer());
    const payload = btoa(String.fromCharCode(...compressed)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
    expect((await decodeShare(payload)).ok).toBe(false);
  });

  it('stops a decompression bomb', async () => {
    const bytes = new TextEncoder().encode(' '.repeat(5_000_000));
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    const compressed = new Uint8Array(await new Response(stream).arrayBuffer());
    let binary = '';
    for (const byte of compressed) binary += String.fromCharCode(byte);
    const payload = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
    const result = await decodeShare(payload);
    expect(result.ok).toBe(false);
  });
});
