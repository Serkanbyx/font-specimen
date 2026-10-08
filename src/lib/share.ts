import { describeIssue, projectInputSchema, type ProjectInput } from './project.ts';

/** Fragment payloads are capped before and after decompression so a crafted link cannot exhaust memory. */
export const maxEncodedLength = 24_000;
export const maxDecodedBytes = 64_000;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  if (!/^[A-Za-z0-9_-]*$/.test(value)) throw new Error('Invalid characters in share link.');
  const padded = value.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function readLimited(stream: ReadableStream<Uint8Array>, limit: number): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new Error('Share link is too large.');
    }
    chunks.push(value);
  }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

export async function encodeShare(input: ProjectInput): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(input));
  const compressed = new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return toBase64Url(await readLimited(compressed, maxDecodedBytes));
}

export type DecodeResult = { ok: true; input: ProjectInput } | { ok: false; error: string };

export async function decodeShare(payload: string): Promise<DecodeResult> {
  try {
    if (payload.length > maxEncodedLength) throw new Error('Share link is too large.');
    const bytes = fromBase64Url(payload);
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    const json = new TextDecoder().decode(await readLimited(stream, maxDecodedBytes));
    const parsed = projectInputSchema.safeParse(JSON.parse(json));
    if (!parsed.success) return { ok: false, error: describeIssue(parsed.error) };
    return { ok: true, input: parsed.data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid share link.' };
  }
}
