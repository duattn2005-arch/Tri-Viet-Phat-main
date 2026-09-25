// Virtual module `virtual:news-index`: the list fields of every news entry (title, date, image, excerpt,
// category), without the article bodies. Lists, search and the home page import this small index, and an
// article body is fetched only when it is opened (see loadNewsHtml in src/data/realSiteContent.ts), so the
// main bundle stays small however many posts the CMS holds.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url));
const ID = 'virtual:news-index';
const RESOLVED = '\0' + ID;
const NEWS_DIR = path.resolve(ROOT_DIR, 'src/content/news');

interface NewsEntry {
  order?: number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  categorySlug?: string;
}

function buildIndex() {
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const e = JSON.parse(fs.readFileSync(path.join(NEWS_DIR, f), 'utf-8')) as NewsEntry;
      return {
        id: f.replace(/\.json$/, ''),
        order: e.order ?? 0,
        title: e.title,
        date: e.date,
        image: e.image,
        // Cards show three lines at most, so a short excerpt keeps the index light
        excerpt: e.excerpt.length > 220 ? `${e.excerpt.slice(0, 220).replace(/\s+\S*$/, '')}…` : e.excerpt,
        categorySlug: e.categorySlug,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function newsIndexPlugin(): Plugin {
  return {
    name: 'tvp-news-index',
    resolveId(id) {
      return id === ID ? RESOLVED : undefined;
    },
    load(id) {
      if (id !== RESOLVED) return;
      this.addWatchFile(NEWS_DIR);
      const serializedIndex = JSON.stringify(buildIndex())
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
      return `export default ${serializedIndex};`;
    },
    handleHotUpdate({ file, server }) {
      if (path.resolve(file).startsWith(NEWS_DIR)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
      }
    },
  };
}
