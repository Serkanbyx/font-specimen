/**
 * Self-hosts every catalogue font.
 *
 *   node scripts/fonts.ts          download files listed in src/generated/fontMeta.json
 *   node scripts/fonts.ts --sync   refresh metadata from the Fontsource API, then download
 *
 * Visitors never contact a font CDN: files land in public/fonts and ship with the build,
 * each family next to its own licence text.
 */
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { catalogue } from '../src/data/catalogue.ts';
import type { FontFileMeta, FontMeta, FontMetaFile, FontStyle, Subset, VariableAxis } from '../src/data/types.ts';

const root = path.resolve(import.meta.dirname, '..');
const metaPath = path.join(root, 'src', 'generated', 'fontMeta.json');
const fontsDir = path.join(root, 'public', 'fonts');

const supportedSubsets: readonly Subset[] = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext'];
const preferredStaticWeights = [400, 500, 600, 700];
const concurrency = 6;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface ApiFont {
  id: string;
  family: string;
  subsets: string[];
  weights: number[];
  styles: string[];
  variable: boolean;
  lastModified: string;
  license: string;
  type: string;
  version: string;
  source: string;
  npmVersion: string;
  unicodeRange: Record<string, string>;
}

interface ApiVariable {
  axes: Record<string, { min: string; max: string; default: string }>;
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'font-specimen build script' } });
      if (response.status === 404 || response.ok) return response;
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
  }
  throw new Error(`Request failed for ${url}: ${String(lastError)}`);
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return (await response.json()) as T;
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function runPool<T>(items: readonly T[], worker: (item: T) => Promise<void>): Promise<void> {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    for (let item = queue.shift(); item !== undefined; item = queue.shift()) {
      await worker(item);
    }
  });
  await Promise.all(runners);
}

async function download(url: string, target: string): Promise<number | null> {
  const response = await fetchWithRetry(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, buffer);
  return buffer.byteLength;
}

function extractCopyright(licenseText: string, family: string): string {
  const head = licenseText.split(/This Font Software is licensed|Apache License/i)[0] ?? '';
  const lines = head
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /copyright|\(c\)|©/i.test(line));
  const unique = [...new Set(lines)];
  return unique.length > 0 ? unique.join(' ') : `Copyright the ${family} project authors`;
}

interface LicenseInfo {
  text: string;
  url: string;
  copyright: string;
}

/**
 * Upstream google/fonts files are authoritative; some npm packages replace the
 * copyright line with a generic placeholder, which would misattribute the font.
 */
async function fetchLicense(id: string, api: ApiFont, npmPackage: string, npmVersion: string): Promise<LicenseInfo> {
  if (api.type === 'google') {
    const slug = id.replaceAll('-', '');
    const folder = api.license.startsWith('Apache') ? 'apache' : api.license.startsWith('UFL') ? 'ufl' : 'ofl';
    const fileName = folder === 'ofl' ? 'OFL.txt' : folder === 'ufl' ? 'UFL.txt' : 'LICENSE.txt';
    const base = `https://raw.githubusercontent.com/google/fonts/main/${folder}/${slug}/`;
    const [licenseResponse, metadataResponse] = await Promise.all([
      fetchWithRetry(base + fileName),
      fetchWithRetry(base + 'METADATA.pb'),
    ]);
    if (licenseResponse.ok) {
      const text = await licenseResponse.text();
      const metadata = metadataResponse.ok ? await metadataResponse.text() : '';
      const fromMetadata = /copyright:\s*"((?:[^"\\]|\\.)*)"/.exec(metadata)?.[1]?.replaceAll('\\"', '"');
      const fromLicense = extractCopyright(text, api.family);
      // METADATA.pb sometimes keeps a generic "Google Inc." line after the
      // licence text has been updated to name the project authors.
      const genericGoogle = fromMetadata !== undefined && /^Copyright \d{4} Google Inc\. All Rights Reserved\.?$/.test(fromMetadata);
      const copyright = fromMetadata && !(genericGoogle && /project authors/i.test(fromLicense)) ? fromMetadata : fromLicense;
      return { text, url: base + fileName, copyright };
    }
  }

  const url = `https://cdn.jsdelivr.net/npm/${npmPackage}@${npmVersion}/LICENSE`;
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`No licence file for ${id}; refusing to redistribute it.`);
  const text = await response.text();
  return { text, url, copyright: extractCopyright(text, api.family) };
}

function pickStaticWeights(available: number[]): number[] {
  const preferred = available.filter((weight) => preferredStaticWeights.includes(weight));
  if (preferred.length > 0) return preferred;
  const closest = [...available].sort((a, b) => Math.abs(a - 400) - Math.abs(b - 400))[0];
  return closest === undefined ? [] : [closest];
}

async function syncFont(id: string): Promise<{ meta: FontMeta; ranges: Record<string, string> }> {
  if (!idPattern.test(id)) throw new Error(`Invalid font id: ${id}`);
  const api = await fetchJson<ApiFont>(`https://api.fontsource.org/v1/fonts/${id}`);
  const subsets = supportedSubsets.filter((subset) => api.subsets.includes(subset));
  const hasItalic = api.styles.includes('italic');

  let axes: Record<string, VariableAxis> = {};
  if (api.variable) {
    const variable = await fetchJson<ApiVariable>(`https://api.fontsource.org/v1/variable/${id}`);
    axes = Object.fromEntries(
      Object.entries(variable.axes).map(([axis, value]) => [
        axis,
        { min: Number(value.min), max: Number(value.max), default: Number(value.default) },
      ]),
    );
  }
  const useVariable = api.variable && axes['wght'] !== undefined;

  const npmPackage = useVariable ? `@fontsource-variable/${id}` : `@fontsource/${id}`;
  const npmVersion = useVariable
    ? (await fetchJson<{ version: string }>(`https://registry.npmjs.org/${npmPackage}/latest`)).version
    : api.npmVersion;
  const cdnBase = `https://cdn.jsdelivr.net/fontsource/fonts/${id}${useVariable ? ':vf' : ''}@${npmVersion}/`;

  const planned: Omit<FontFileMeta, 'bytes'>[] = [];
  const styles: FontStyle[] = hasItalic ? ['normal', 'italic'] : ['normal'];
  const staticWeights = pickStaticWeights(api.weights);
  for (const subset of subsets) {
    for (const style of styles) {
      if (useVariable) {
        const wght = axes['wght']!;
        planned.push({ subset, style, weight: `${wght.min} ${wght.max}`, file: `${subset}-wght-${style}.woff2` });
      } else {
        // Static italics are limited to the regular weight to keep the download small.
        const weights = style === 'italic' ? staticWeights.slice(0, 1) : staticWeights;
        for (const weight of weights) {
          planned.push({ subset, style, weight: String(weight), file: `${subset}-${weight}-${style}.woff2` });
        }
      }
    }
  }

  const fontDir = path.join(fontsDir, id);
  await rm(fontDir, { recursive: true, force: true });
  const files: FontFileMeta[] = [];
  await runPool(planned, async (entry) => {
    const bytes = await download(cdnBase + entry.file, path.join(fontDir, entry.file));
    if (bytes === null) {
      if (entry.style === 'italic') return;
      throw new Error(`Missing file ${entry.file} for ${id}`);
    }
    files.push({ ...entry, bytes });
  });
  files.sort((a, b) => a.file.localeCompare(b.file));

  const license = await fetchLicense(id, api, npmPackage, npmVersion);
  await writeFile(path.join(fontDir, 'LICENSE.txt'), license.text);

  const ranges = Object.fromEntries(subsets.map((subset) => [subset, api.unicodeRange[subset] ?? '']));
  const meta: FontMeta = {
    family: api.family,
    license: api.license,
    version: api.version,
    lastModified: api.lastModified,
    npmPackage,
    npmVersion,
    cdnBase,
    source: api.source,
    licenseUrl: license.url,
    copyright: license.copyright,
    subsets,
    variable: useVariable,
    axes,
    weights: useVariable ? api.weights : staticWeights,
    italic: files.some((file) => file.style === 'italic'),
    files,
  };
  return { meta, ranges };
}

function mostCommon(values: string[]): string {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
}

async function sync(): Promise<void> {
  const ids = [...new Set(catalogue.map((font) => font.id))];
  const results = new Map<string, { meta: FontMeta; ranges: Record<string, string> }>();
  let done = 0;
  // Fonts are processed one by one; each font downloads its own files in parallel.
  for (const id of ids) {
    results.set(id, await syncFont(id));
    done++;
    process.stdout.write(`\r  synced ${done}/${ids.length} ${id}`.padEnd(70));
  }
  process.stdout.write('\n');

  const subsetRanges = Object.fromEntries(
    supportedSubsets.map((subset) => [
      subset,
      mostCommon([...results.values()].map((result) => result.ranges[subset]).filter((range): range is string => !!range)),
    ]),
  ) as Record<Subset, string>;

  const fonts: Record<string, FontMeta> = {};
  for (const id of ids) {
    const { meta, ranges } = results.get(id)!;
    const overrides = Object.fromEntries(
      Object.entries(ranges).filter(([subset, range]) => range !== subsetRanges[subset as Subset]),
    );
    fonts[id] = Object.keys(overrides).length > 0 ? { ...meta, unicodeRange: overrides } : meta;
  }

  const output: FontMetaFile = { generatedAt: new Date().toISOString(), subsetRanges, fonts };
  await mkdir(path.dirname(metaPath), { recursive: true });
  await writeFile(metaPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, metaPath)} for ${ids.length} families.`);
}

async function ensureDownloaded(): Promise<void> {
  if (!(await exists(metaPath))) {
    throw new Error('src/generated/fontMeta.json is missing. Run `npm run fonts:sync` first.');
  }
  const meta = JSON.parse(await readFile(metaPath, 'utf8')) as FontMetaFile;
  const missingFromMeta = catalogue.filter((font) => !meta.fonts[font.id]).map((font) => font.id);
  if (missingFromMeta.length > 0) {
    throw new Error(`Catalogue fonts without metadata: ${missingFromMeta.join(', ')}. Run \`npm run fonts:sync\`.`);
  }

  const tasks: { url: string; target: string }[] = [];
  for (const [id, font] of Object.entries(meta.fonts)) {
    if (!idPattern.test(id)) throw new Error(`Invalid font id in metadata: ${id}`);
    const dir = path.join(fontsDir, id);
    for (const file of font.files) {
      const target = path.join(dir, file.file);
      if (!(await exists(target))) tasks.push({ url: font.cdnBase + file.file, target });
    }
    const licenseTarget = path.join(dir, 'LICENSE.txt');
    if (!(await exists(licenseTarget))) tasks.push({ url: font.licenseUrl, target: licenseTarget });
  }

  if (tasks.length === 0) {
    console.log('Fonts are up to date.');
    return;
  }
  console.log(`Downloading ${tasks.length} font files…`);
  await runPool(tasks, async ({ url, target }) => {
    const bytes = await download(url, target);
    if (bytes === null) throw new Error(`Not found: ${url}. Run \`npm run fonts:sync\` to refresh metadata.`);
  });
  console.log('Fonts are ready.');
}

try {
  if (process.argv.includes('--sync')) await sync();
  await ensureDownloaded();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
