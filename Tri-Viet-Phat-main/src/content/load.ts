import { marked } from 'marked';

/**
 * Content under src/content/ is edited through the Decap CMS admin at /admin.
 * Folder collections store one JSON file per entry; the file name is the entry id.
 */

type Ordered = { order?: number };

/** Turns an import.meta.glob result into a list sorted by the `order` field, id taken from the file name. */
export function fromFolder<T extends Ordered>(modules: Record<string, T>): (T & { id: string })[] {
  return Object.entries(modules)
    .map(([file, entry]) => ({ ...entry, id: file.split('/').pop()!.replace(/\.json$/, '') }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** CMS body fields are Markdown; older entries are plain HTML, which Markdown passes through unchanged. */
export function renderRich(source = ''): string {
  return marked.parse(source, { async: false });
}

export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
