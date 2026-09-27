// Turns the Decap config (public/admin/decap/config.yml) into api/admin-schema.json at build time.
// The WordPress-style admin at /admin/ builds its menus and forms from it, and public/api/admin.php
// uses it to decide which content files may be read and written. One config serves both editors.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import type { Plugin } from 'vite';

const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url));
const CONFIG = path.resolve(ROOT_DIR, 'public/admin/decap/config.yml');

const KEEP = ['name', 'label', 'label_singular', 'description', 'folder', 'files', 'fields', 'create', 'delete', 'identifier_field', 'summary'];

export function adminSchemaPlugin(): Plugin {
  return {
    name: 'td-admin-schema',
    apply: 'build',
    generateBundle() {
      const config = parse(fs.readFileSync(CONFIG, 'utf8')) as { collections?: Record<string, unknown>[] };
      const collections = (config.collections ?? []).map((c) => Object.fromEntries(KEEP.filter((k) => k in c).map((k) => [k, c[k]])));
      this.emitFile({ type: 'asset', fileName: 'api/admin-schema.json', source: JSON.stringify({ collections }) });
    },
  };
}
