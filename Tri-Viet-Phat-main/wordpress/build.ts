// npm run build:wp — packs the website for WordPress into wordpress/dist/:
//   tri-duc-theme.zip     the theme (Giao diện → Thêm mới → Tải lên): the app built in Vite mode "wp" (src/wp.ts),
//                         the PHP in wordpress/theme, the site's own images, the form/chat endpoints of public/api,
//                         and data/*.json: brands, guides and labels of src/seo, the old-URL redirects of
//                         public/.htaccess, the default page texts and the admin form schema (Decap config.yml)
//   tri-duc-du-lieu.zip   the one-off import plugin (wordpress/importer): every news post, product, document and
//                         job of src/content as HTML, with the pictures they use
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DOCUMENT_CATEGORY_LABELS,
  HOTLINE,
  NEWS_CATEGORY_TITLES,
  PRODUCT_CATEGORY_LABELS,
  SITE_NAME,
  TAB_LABELS,
  routePath,
} from '../src/seo/routes';
import { BRANDS } from '../src/seo/brands';
import { CATEGORY_BLURBS, CATEGORY_GUIDES } from '../src/seo/guides';
import type { PageTab } from '../src/types';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const WP_DIR = path.join(ROOT, 'wordpress');
const OUT = path.join(WP_DIR, '.build');
const DIST = path.join(WP_DIR, 'dist');
const CONTENT = path.join(ROOT, 'src/content');
const PUBLIC = path.join(ROOT, 'public');
const THEME = path.join(OUT, 'tri-duc');
const PLUGIN = path.join(OUT, 'tri-duc-du-lieu');

const readJson = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file: string, data: unknown) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data));
};
const copy = (from: string, to: string) => fs.cpSync(from, to, { recursive: true });

function readFolder(folder: string): Record<string, any>[] {
  const dir = path.join(CONTENT, folder);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ ...readJson(path.join(dir, f)), id: f.replace(/\.json$/, '') }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// ---------------------------------------------------------------------------------------------
// Theme

// WordPress's own addresses, which the static site sent elsewhere but WordPress must keep
const WORDPRESS_PATHS = ['wp-admin', 'wp-login.php', 'feed'];

/**
 * The 301 redirects of the old WordPress addresses (public/.htaccess): exact paths { "old/path": "/new" } and
 * whole sections ("tag/…", "en/…") as prefixes, checked after the exact ones as in the .htaccess.
 */
function oldUrlRedirects() {
  const htaccess = fs.readFileSync(path.join(PUBLIC, '.htaccess'), 'utf8').replace(/\r/g, '');
  const block = htaccess.split('# BEGIN old WordPress URLs')[1]?.split('# END old WordPress URLs')[0] ?? '';
  const exact: Record<string, string> = {};
  const prefixes: Record<string, string> = {};
  let rules = 0;
  const plain = (pattern: string) => {
    const p = pattern.replace(/\\(.)/g, '$1');
    if (/[\\^$*+?()[\]{}|]/.test(p)) throw new Error(`build:wp: redirect pattern is not a plain path: ${pattern}`);
    return p;
  };
  for (const line of block.split('\n')) {
    if (!line.startsWith('RewriteRule ')) continue;
    rules++;
    const section = line.match(/^RewriteRule \^(.+?)\(\/\.\*\)\?\$ (\S+) \[R=30[12]/);
    const single = line.match(/^RewriteRule \^(.+?)\/\?\$ (\S+) \[R=30[12]/);
    const from = section ? plain(section[1]) : single ? plain(single[1]) : null;
    if (from === null) throw new Error(`build:wp: unexpected redirect rule: ${line}`);
    if (WORDPRESS_PATHS.includes(from)) continue;
    const to = (section ?? single)![2];
    if (to.replace(/^\//, '') === from || (section && to.replace(/^\//, '').startsWith(`${from}/`))) {
      throw new Error(`build:wp: redirect loop: ${line}`);
    }
    if (section) prefixes[from] = section[2];
    else exact[from] = single![2];
  }
  // Same guard as seo-plugin.ts: these carry the old pages' Google rankings
  if (rules < 415) throw new Error(`build:wp: only ${rules} old-URL redirects found`);
  return { exact, prefixes };
}

function siteData() {
  const tabs = Object.keys(TAB_LABELS) as PageTab[];
  return {
    siteName: SITE_NAME,
    hotline: HOTLINE,
    defaultDescription: DEFAULT_DESCRIPTION,
    defaultImage: DEFAULT_IMAGE,
    tabPaths: Object.fromEntries(tabs.map((tab) => [tab, routePath({ tab })])),
    tabLabels: TAB_LABELS,
    productCategories: PRODUCT_CATEGORY_LABELS,
    documentCategories: DOCUMENT_CATEGORY_LABELS,
    newsCategories: NEWS_CATEGORY_TITLES,
    brands: BRANDS.map(({ pattern, ...b }) => ({ ...b, pattern: { source: pattern.source, flags: pattern.flags } })),
    guides: CATEGORY_GUIDES,
    blurbs: CATEGORY_BLURBS,
    redirects: oldUrlRedirects(),
  };
}

/** The page-text and settings forms of the previous editor (Decap config.yml), for WP Admin → Trí Đức. */
function adminSchema() {
  const config = parseYaml(fs.readFileSync(path.join(PUBLIC, 'admin/decap/config.yml'), 'utf8'));
  const keep = ['name', 'label', 'label_singular', 'widget', 'hint', 'options', 'collapsed', 'summary', 'value_type', 'min', 'max', 'default'];
  const field = (f: Record<string, any>): Record<string, any> => ({
    ...Object.fromEntries(keep.filter((k) => k in f).map((k) => [k, f[k]])),
    ...(f.fields ? { fields: f.fields.map(field) } : {}),
    ...(f.field ? { field: field(f.field) } : {}),
  });
  const collection = (name: string) => config.collections.find((c: { name: string }) => c.name === name);
  return {
    groups: ['settings', 'pages'].map((name) => ({
      label: collection(name).label,
      files: collection(name).files.map((f: Record<string, any>) => ({ name: f.name, label: f.label, fields: f.fields.map(field) })),
    })),
  };
}

function defaultTexts() {
  const out: Record<string, unknown> = {};
  for (const folder of ['pages', 'settings']) {
    for (const f of fs.readdirSync(path.join(CONTENT, folder))) {
      if (f.endsWith('.json')) out[f.replace(/\.json$/, '')] = readJson(path.join(CONTENT, folder, f));
    }
  }
  return out;
}

async function buildTheme() {
  await build({ root: ROOT, mode: 'wp', logLevel: 'warn' });
  fs.rmSync(THEME, { recursive: true, force: true });
  copy(path.join(WP_DIR, 'theme'), THEME);
  copy(path.join(OUT, 'app'), path.join(THEME, 'app'));
  fs.rmSync(path.join(THEME, 'app/index.html'), { force: true });

  // The site's own images, at the paths the page texts use ("/images/…", "/partners/…")
  for (const item of ['images', 'partners', 'logo-tri-duc.png', 'favicon.ico', 'favicon-192.png', 'apple-touch-icon.png']) {
    copy(path.join(PUBLIC, item), path.join(THEME, 'static', item));
  }
  // The enquiry form and AI chat, run inside WordPress (inc/frontend.php); not reachable directly
  for (const file of ['lien-he.php', 'chat.php']) {
    copy(path.join(PUBLIC, 'api', file), path.join(THEME, 'api', file));
  }
  // lien-he.php requires td-common.php; in WordPress the enquiries are stored by td_leads_add() of inc/frontend.php
  // (the real file cannot be included: PHP declares its functions even when it returns early)
  fs.writeFileSync(
    path.join(THEME, 'api/td-common.php'),
    '<?php\n// WordPress theme: td_leads_add() is in inc/frontend.php; the static hosting\'s td-common.php is not used here.\n'
  );
  fs.writeFileSync(path.join(THEME, 'api/.htaccess'), 'Require all denied\nDeny from all\n');
  fs.writeFileSync(path.join(THEME, 'api/index.php'), '<?php\n// Silence is golden.\n');

  writeJson(path.join(THEME, 'data/site.json'), siteData());
  writeJson(path.join(THEME, 'data/defaults.json'), defaultTexts());
  writeJson(path.join(THEME, 'data/schema.json'), adminSchema());
}

// ---------------------------------------------------------------------------------------------
// Import plugin

const html = (source = '') => marked.parse(source, { async: false }) as string;

/** "29/11/2024" → "2024-11-29 HH:MM:00"; earlier `order` gets a later time, so same-day posts keep their order. */
function wpDate(date: string | undefined, order = 0): string {
  const m = date?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const day = m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : new Date().toISOString().slice(0, 10);
  const minutes = Math.max(0, 23 * 60 - order);
  return `${day} ${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:00`;
}

const seo = (e: Record<string, any>) => ({
  ...(e.seoTitle ? { seoTitle: e.seoTitle } : {}),
  ...(e.seoDescription ? { seoDescription: e.seoDescription } : {}),
});

function importItems() {
  const status = (e: Record<string, any>) => (e.status === 'Pending' ? { status: 'draft' } : {});
  const products = readFolder('products').map((p) => ({
    type: 'td_product',
    slug: p.id,
    title: p.name,
    content: p.detailHtml ? html(p.detailHtml) : '',
    excerpt: p.shortDesc ?? '',
    date: wpDate(undefined),
    order: p.order ?? 0,
    image: p.image ?? '',
    alt: p.alt || p.name,
    ...status(p),
    meta: {
      category: p.category ?? '',
      model: p.model ?? '',
      brand: p.brand ?? '',
      manufacturer: p.manufacturer ?? '',
      origin: p.origin ?? '',
      countryOfOrigin: p.countryOfOrigin ?? '',
      alt: p.alt ?? '',
      fullDesc: p.fullDesc ?? '',
      specs: p.specs ?? [],
      features: p.features ?? [],
      detailedFeatures: p.detailedFeatures ?? [],
      benefits: p.benefits ?? [],
      certifications: p.certifications ?? [],
      ...seo(p),
    },
  }));
  const entries = (folder: string, type: string, meta: (e: Record<string, any>) => Record<string, unknown>) =>
    readFolder(folder).map((e) => ({
      type,
      slug: e.id,
      title: e.title,
      content: html(e.content),
      excerpt: e.excerpt ?? '',
      date: wpDate(e.date, e.order ?? 0),
      order: type === 'post' ? 0 : (e.order ?? 0),
      image: e.image ?? '',
      ...(type === 'post' && e.categorySlug ? { category: e.categorySlug } : {}),
      ...status(e),
      meta: meta(e),
    }));
  return [
    ...products,
    ...entries('documents', 'td_document', seo),
    ...entries('jobs', 'td_job', (e) => ({ quantity: e.quantity ?? '', location: e.location ?? '' })),
    ...entries('news', 'post', seo),
  ];
}

function buildPlugin() {
  fs.rmSync(PLUGIN, { recursive: true, force: true });
  copy(path.join(WP_DIR, 'importer'), PLUGIN);
  const items = importItems();
  writeJson(path.join(PLUGIN, 'data/content.json'), { categories: NEWS_CATEGORY_TITLES, items });

  // The pictures and files the content uses (same pattern as tdi_replace_images in the plugin)
  const paths = new Set<string>();
  for (const item of items) {
    if (item.image.startsWith('/')) paths.add(item.image);
    for (const m of item.content.matchAll(/(?<=["'\s,(=])(\/uploads\/[^"'\s,)<>\\]+)/g)) paths.add(m[1]);
  }
  let missing = 0;
  for (const p of paths) {
    const decoded = (() => {
      try {
        return decodeURIComponent(p.replace(/&amp;/g, '&'));
      } catch {
        return p;
      }
    })();
    const from = path.join(PUBLIC, decoded);
    if (!decoded.includes('..') && fs.existsSync(from) && fs.statSync(from).isFile()) copy(from, path.join(PLUGIN, 'files', decoded));
    else missing++;
  }
  return { items: items.length, files: paths.size - missing, missing };
}

// ---------------------------------------------------------------------------------------------
// Zip (WordPress uploads themes and plugins as .zip with the folder at the top)

function zipFolder(folder: string, file: string) {
  const entries: { name: string; data: Buffer; dir: boolean }[] = [];
  const base = path.basename(folder);
  const walk = (dir: string, rel: string) => {
    entries.push({ name: `${rel}/`, data: Buffer.alloc(0), dir: true });
    for (const f of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) walk(full, `${rel}/${f}`);
      else entries.push({ name: `${rel}/${f}`, data: fs.readFileSync(full), dir: false });
    }
  };
  walk(folder, base);

  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, 'utf8');
    const deflated = e.dir ? e.data : zlib.deflateRawSync(e.data, { level: 9 });
    const stored = e.dir || deflated.length >= e.data.length;
    const body = stored ? e.data : deflated;
    const crc = zlib.crc32(e.data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(stored ? 0 : 8, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(e.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(stored ? 0 : 8, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(e.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(e.dir ? 0x10 : 0, 38);
    central.writeUInt32LE(offset, 42);
    locals.push(local, name, body);
    centrals.push(central, name);
    offset += local.length + name.length + body.length;
  }
  const centralSize = centrals.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.concat([...locals, ...centrals, end]));
  return { files: entries.filter((e) => !e.dir).length, bytes: offset + centralSize + 22 };
}

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

await buildTheme();
const imported = buildPlugin();
const theme = zipFolder(THEME, path.join(DIST, 'tri-duc-theme.zip'));
const plugin = zipFolder(PLUGIN, path.join(DIST, 'tri-duc-du-lieu.zip'));
console.log(`wordpress/dist/tri-duc-theme.zip     ${theme.files} files, ${mb(theme.bytes)}`);
console.log(
  `wordpress/dist/tri-duc-du-lieu.zip   ${imported.items} entries, ${imported.files} pictures` +
    `${imported.missing ? ` (${imported.missing} referenced but not in public/)` : ''}, ${mb(plugin.bytes)}`
);
