/**
 * Writes public/THIRD_PARTY_NOTICES.txt: licences of the JavaScript packages
 * bundled into the build, followed by every redistributed font family.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { FontMetaFile } from '../src/data/types.ts';

const root = path.resolve(import.meta.dirname, '..');
const runtimePackages = ['react', 'react-dom', 'scheduler', 'zod'];
const licenceFileNames = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license'];

async function readPackageLicence(name: string): Promise<string> {
  const dir = path.join(root, 'node_modules', name);
  const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8')) as { version: string; license?: string };
  for (const file of licenceFileNames) {
    try {
      const text = await readFile(path.join(dir, file), 'utf8');
      return `${name}@${pkg.version} (${pkg.license ?? 'see below'})\n\n${text.trim()}`;
    } catch {
      // Try the next common licence file name.
    }
  }
  throw new Error(`No licence file found for ${name}; refusing to ship it without notice.`);
}

const sections = await Promise.all(runtimePackages.map(readPackageLicence));
const meta = JSON.parse(await readFile(path.join(root, 'src', 'generated', 'fontMeta.json'), 'utf8')) as FontMetaFile;
const fontLines = Object.entries(meta.fonts).map(
  ([id, font]) => `${font.family} — ${font.license} — ${font.copyright}\n  Licence text: fonts/${id}/LICENSE.txt`,
);

const separator = `\n\n${'-'.repeat(72)}\n\n`;
const output = [
  'Font Specimen bundles the following third-party software and fonts.',
  'JAVASCRIPT PACKAGES',
  sections.join(separator),
  'FONTS (redistributed unmodified, each with its licence text next to its files)',
  fontLines.join('\n'),
].join(separator);

await writeFile(path.join(root, 'public', 'THIRD_PARTY_NOTICES.txt'), `${output}\n`);
console.log(`Wrote public/THIRD_PARTY_NOTICES.txt (${runtimePackages.length} packages, ${fontLines.length} font families).`);
