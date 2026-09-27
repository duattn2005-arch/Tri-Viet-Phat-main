// The content model (collections and fields from the Decap config, see admin-schema-plugin.ts)
// and the small helpers every admin screen shares.

export interface Field {
  name: string;
  label?: string;
  widget?: string;
  required?: boolean;
  hint?: string;
  default?: unknown;
  options?: (string | { label: string; value: string })[];
  /** list/object: the fields of each item; list with `field`: a list of single values. */
  fields?: Field[];
  field?: Field;
  label_singular?: string;
  summary?: string;
  collapsed?: boolean;
  value_type?: 'int' | 'float';
  min?: number;
  max?: number;
  pattern?: [string, string];
}

export interface PageFile {
  name: string;
  label: string;
  file: string;
  fields: Field[];
}

export interface Collection {
  name: string;
  label: string;
  label_singular?: string;
  description?: string;
  /** Folder collections: one JSON file per entry (products, news…). */
  folder?: string;
  /** Files collections: a fixed set of JSON files (page texts, settings). */
  files?: PageFile[];
  fields?: Field[];
  create?: boolean;
  delete?: boolean;
  identifier_field?: string;
  summary?: string;
}

export interface Schema {
  collections: Collection[];
}

export const SITE_URL = 'https://thietbiytegroup.com';

// ---- Wording and places on the website ----------------------------------------------------------

const WORDS: Record<string, { menu: string; all: string; add: string; singular?: string }> = {
  products: { menu: 'Sản phẩm', all: 'Tất cả sản phẩm', add: 'Thêm sản phẩm' },
  news: { menu: 'Tin tức', all: 'Tất cả bài viết', add: 'Viết bài mới', singular: 'bài viết' },
  documents: { menu: 'Tài liệu', all: 'Tất cả tài liệu', add: 'Thêm tài liệu' },
  jobs: { menu: 'Tuyển dụng', all: 'Tất cả tin tuyển dụng', add: 'Đăng tin tuyển dụng' },
  pages: { menu: 'Trang', all: 'Tất cả các trang', add: '' },
  settings: { menu: 'Cài đặt', all: 'Cài đặt chung', add: '' },
};

export function words(c: Collection) {
  const w = WORDS[c.name];
  const singular = w?.singular ?? c.label_singular ?? c.label.toLowerCase();
  return {
    menu: w?.menu ?? c.label,
    all: w?.all ?? `Tất cả ${singular}`,
    add: w?.add ?? `Thêm ${singular}`,
    singular,
  };
}

const PAGE_URLS: Record<string, string> = {
  'trang-chu': '/',
  'gioi-thieu': '/gioi-thieu',
  'san-pham': '/san-pham',
  'tai-lieu': '/tai-lieu',
  'tuyen-dung': '/tuyen-dung',
  'lien-he': '/lien-he',
};

/** Where an entry shows on the website (a path on SITE_URL). */
export function viewPath(c: Collection, slug: string): string {
  switch (c.name) {
    case 'products':
      return `/san-pham/chi-tiet/${slug}`;
    case 'news':
      return `/tin-tuc/bai-viet/${slug}`;
    case 'documents':
      return '/tai-lieu';
    case 'jobs':
      return '/tuyen-dung';
    case 'pages':
      return PAGE_URLS[slug] ?? '/';
    default:
      return '/';
  }
}

/** Folder collections whose entries have a page of their own (the permalink can be chosen). */
export const hasOwnPage = (c: Collection) => c.name === 'products' || c.name === 'news';

// ---- What each field is for, in the editor --------------------------------------------------------

export function fieldRoles(c: Collection, fields: Field[]) {
  const find = (test: (f: Field) => boolean) => fields.find(test);
  const title = find((f) => f.name === (c.identifier_field || 'title')) ?? find((f) => f.name === 'name');
  const body = find((f) => f.widget === 'html');
  const status = find((f) => f.name === 'status' && f.widget === 'select');
  const date = find((f) => f.name === 'date' && (f.widget ?? 'string') === 'string');
  const image = find((f) => f.name === 'image' && f.widget === 'image');
  const category = find((f) => (f.name === 'category' || f.name === 'categorySlug') && f.widget === 'select');
  const excerpt = find((f) => f.name === 'excerpt');
  const order = find((f) => f.name === 'order' && f.widget === 'number');
  const seo = ['seoKeyphrase', 'seoTitle', 'seoDescription'].every((n) => fields.some((f) => f.name === n));
  const placed = new Set([title, body, status, date, image, category, excerpt, order].filter(Boolean));
  const rest = fields.filter((f) => !placed.has(f) && f.widget !== 'hidden' && !(seo && f.name.startsWith('seo')));
  return { title, body, status, date, image, category, excerpt, order, seo, rest };
}

export const titleOf = (c: Collection, data: Record<string, any>) =>
  String(data[c.identifier_field || 'title'] ?? data.title ?? data.name ?? '').trim();

export const isDraft = (data: Record<string, any>) => data.status === 'Pending';

export const optionsOf = (f: Field) => (f.options ?? []).map((o) => (typeof o === 'string' ? { label: o, value: o } : o));

export const optionLabel = (f: Field | undefined, value: unknown) =>
  (f && optionsOf(f).find((o) => o.value === value)?.label) || String(value ?? '');

/** Values for a new entry: each field's default, today's date, published. */
export function defaultsFor(fields: Field[] = []): Record<string, any> {
  const data: Record<string, any> = {};
  for (const f of fields) {
    if (f.default !== undefined) data[f.name] = structuredClone(f.default);
    else if (f.widget === 'boolean') data[f.name] = false;
    else if (f.widget === 'object' && f.fields) data[f.name] = defaultsFor(f.fields);
    else if (f.widget === 'list') data[f.name] = [];
    else if (f.name === 'date') data[f.name] = todayVn();
  }
  return data;
}

/** A field must be filled unless the config says `required: false` (Decap's rule). */
export const isRequired = (f: Field) => f.required !== false && !['hidden', 'boolean', 'list', 'object'].includes(f.widget ?? '');

/** "{{fields.title}} — {{model}}" with an item's values. */
export function summarize(template: string | undefined, data: Record<string, any>): string {
  if (!template) return '';
  return template
    .replace(/\{\{\s*(?:fields\.)?([\w.-]+)\s*\}\}/g, (_, key: string) => {
      const v = key.split('.').reduce<any>((o, k) => (o == null ? o : o[k]), data);
      return v == null ? '' : String(v);
    })
    .replace(/^[\s—–:·-]+|[\s—–:·-]+$/g, '')
    .replace(/\(\s*\)/g, '')
    .trim();
}

// ---- Dates (the site writes them as dd/mm/yyyy) ---------------------------------------------------

export const vnToIso = (v: unknown) => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(v ?? '').trim());
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : '';
};

export const isoToVn = (v: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
};

export const todayVn = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export function formatDateTime(iso: string | number): string {
  const d = new Date(typeof iso === 'number' ? iso * 1000 : iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** "5 phút trước", "hôm qua"… */
export function timeAgo(iso: string | number): string {
  const d = new Date(typeof iso === 'number' ? iso * 1000 : iso);
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (Number.isNaN(s)) return '';
  if (s < 60) return 'vừa xong';
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  if (s < 172800) return 'hôm qua';
  if (s < 30 * 86400) return `${Math.floor(s / 86400)} ngày trước`;
  return formatDateTime(iso);
}

// ---- Text helpers ------------------------------------------------------------------------------------

/** Vietnamese title -> file name: "Máy xét nghiệm Đông máu" -> "may-xet-nghiem-dong-mau". */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .slice(0, 90)
    .replace(/-+$/, '');
}

export const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

export const looksLikeHtml = (s: string) => /<\/?(p|div|h[1-6]|ul|ol|li|table|img|br|span|strong|b|em|i|a|blockquote|figure)\b/i.test(s);

export function plainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export const formatBytes = (n: number) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : n >= 1024 ? `${Math.round(n / 1024)} KB` : `${n} B`;

export const fileName = (url: string) => decodeURIComponent(url.split('/').pop() || url);

export const isImage = (url: string) => /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(url.split('?')[0]);
