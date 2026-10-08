import type { Subset } from '../data/types.ts';
import { fallbackStack, headingWeight, unicodeRangeFor, type FontRecord } from './fonts.ts';

export interface SnippetFonts {
  heading: FontRecord;
  body: FontRecord;
  subsets: readonly Subset[];
}

interface Role {
  font: FontRecord;
  variable: string;
  identifier: string;
}

function rolesOf({ heading, body }: SnippetFonts): Role[] {
  const roles: Role[] = [{ font: heading, variable: '--font-heading', identifier: 'headingFont' }];
  roles.push({ font: body, variable: '--font-body', identifier: 'bodyFont' });
  return roles;
}

function quoteList(values: readonly string[]): string {
  return `[${values.map((value) => `'${value}'`).join(', ')}]`;
}

/** next/font/google downloads at build time and self-hosts, so visitors never contact Google. */
export function nextFontSnippet(input: SnippetFonts): string {
  const roles = rolesOf(input);
  const importNames = [...new Set(roles.map(({ font }) => font.family.replaceAll(' ', '_')))];
  const lines = [`import { ${importNames.join(', ')} } from 'next/font/google';`, ''];
  for (const { font, variable, identifier } of roles) {
    const options = [`subsets: ${quoteList(input.subsets.filter((subset) => font.meta.subsets.includes(subset)))}`];
    if (!font.meta.variable) options.push(`weight: ${quoteList(font.meta.weights.map(String))}`);
    if (font.meta.italic) options.push(`style: ['normal', 'italic']`);
    options.push(`variable: '${variable}'`, `display: 'swap'`);
    lines.push(
      `export const ${identifier} = ${font.family.replaceAll(' ', '_')}({`,
      ...options.map((option) => `  ${option},`),
      '});',
      '',
    );
  }
  lines.push(
    '// app/layout.tsx',
    `// <html className={\`\${headingFont.variable} \${bodyFont.variable}\`}>`,
  );
  return lines.join('\n');
}

export function fontsourcePackage(font: FontRecord): string {
  return font.meta.variable ? `@fontsource-variable/${font.id}` : `@fontsource/${font.id}`;
}

export function fontsourceFamily(font: FontRecord): string {
  return font.meta.variable ? `${font.family} Variable` : font.family;
}

export function fontsourceSnippet(input: SnippetFonts): { install: string; code: string } {
  const roles = rolesOf(input);
  const packages = [...new Set(roles.map(({ font }) => fontsourcePackage(font)))];
  const imports = new Set<string>();
  for (const { font } of roles) {
    const pkg = fontsourcePackage(font);
    if (font.meta.variable) {
      imports.add(`import '${pkg}';`);
      if (font.meta.italic) imports.add(`import '${pkg}/wght-italic.css';`);
    } else {
      for (const weight of font.meta.weights) imports.add(`import '${pkg}/${weight}.css';`);
      if (font.meta.italic) imports.add(`import '${pkg}/${font.meta.weights[0] ?? 400}-italic.css';`);
    }
  }
  const css = roles.map(
    ({ font, variable }) => `  ${variable}: '${fontsourceFamily(font)}', ${fallbackStack(font.classification)};`,
  );
  return {
    install: `npm install ${packages.join(' ')}`,
    code: [...imports, '', '/* global.css */', ':root {', ...new Set(css), '}'].join('\n'),
  };
}

export function fontFaceSnippet(input: SnippetFonts): string {
  const seen = new Set<string>();
  const blocks: string[] = [];
  for (const { font } of rolesOf(input)) {
    if (seen.has(font.id)) continue;
    seen.add(font.id);
    for (const file of font.meta.files) {
      if (!input.subsets.includes(file.subset)) continue;
      blocks.push(
        [
          '@font-face {',
          `  font-family: '${font.family}';`,
          `  font-style: ${file.style};`,
          `  font-weight: ${file.weight};`,
          '  font-display: swap;',
          `  src: url('/fonts/${font.id}/${file.file}') format('woff2');`,
          `  unicode-range: ${unicodeRangeFor(font, file.subset)};`,
          '}',
        ].join('\n'),
      );
    }
  }
  return blocks.join('\n\n');
}

export function cssVariablesSnippet(input: SnippetFonts): string {
  return [
    ':root {',
    `  --font-heading: '${input.heading.family}', ${fallbackStack(input.heading.classification)};`,
    `  --font-body: '${input.body.family}', ${fallbackStack(input.body.classification)};`,
    `  --font-heading-weight: ${headingWeight(input.heading)};`,
    '}',
  ].join('\n');
}

export function selectionSummary(heading: string, body: string, labels: { heading: string; body: string }): string {
  return `${labels.heading}: ${heading} · ${labels.body}: ${body}`;
}
