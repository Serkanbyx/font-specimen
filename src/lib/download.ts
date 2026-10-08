import { slugify } from './format.ts';
import type { Project } from './project.ts';

export function downloadText(fileName: string, text: string, type = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  // Revoking on the next task gives the browser time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadProject(project: Project): void {
  downloadText(`${slugify(project.name)}.font-specimen.json`, `${JSON.stringify(project, null, 2)}\n`);
}
