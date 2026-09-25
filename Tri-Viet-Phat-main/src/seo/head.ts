// Renders the per-page <head> tags: as an HTML string at build time (seo-plugin.ts) and by updating the
// live DOM when the visitor navigates inside the app (App.tsx). Both produce the same set of tags.
import { SITE_NAME, type SeoMeta } from './routes';

function absolute(siteUrl: string, pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteUrl.replace(/\/$/, '')}${pathOrUrl}`;
}

function jsonLd(meta: SeoMeta, siteUrl: string): Record<string, unknown> | null {
  const url = absolute(siteUrl, meta.path);
  const image = absolute(siteUrl, meta.image);
  if (meta.type === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.title,
      description: meta.description,
      image,
      url,
      ...(meta.published ? { datePublished: meta.published } : {}),
      publisher: { '@type': 'Organization', name: SITE_NAME, logo: absolute(siteUrl, '/tri-viet-phat1.jpg') },
    };
  }
  if (meta.type === 'product') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: meta.title.replace(` | ${SITE_NAME}`, ''),
      description: meta.description,
      image,
      url,
      brand: { '@type': 'Organization', name: SITE_NAME },
    };
  }
  return null;
}

interface Tag {
  kind: 'meta-name' | 'meta-property' | 'link';
  key: string;
  value: string;
}

function tagsFor(meta: SeoMeta, siteUrl: string): Tag[] {
  const url = absolute(siteUrl, meta.path);
  const image = absolute(siteUrl, meta.image);
  const tags: Tag[] = [
    { kind: 'meta-name', key: 'description', value: meta.description },
    { kind: 'link', key: 'canonical', value: url },
    { kind: 'meta-property', key: 'og:site_name', value: SITE_NAME },
    { kind: 'meta-property', key: 'og:locale', value: 'vi_VN' },
    { kind: 'meta-property', key: 'og:type', value: meta.type === 'article' ? 'article' : 'website' },
    { kind: 'meta-property', key: 'og:title', value: meta.title },
    { kind: 'meta-property', key: 'og:description', value: meta.description },
    { kind: 'meta-property', key: 'og:url', value: url },
    { kind: 'meta-property', key: 'og:image', value: image },
    { kind: 'meta-name', key: 'twitter:card', value: 'summary_large_image' },
    { kind: 'meta-name', key: 'twitter:title', value: meta.title },
    { kind: 'meta-name', key: 'twitter:description', value: meta.description },
    { kind: 'meta-name', key: 'twitter:image', value: image },
  ];
  if (meta.published) tags.push({ kind: 'meta-property', key: 'article:published_time', value: meta.published });
  return tags;
}

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** HTML for the block between <!--seo:start--> and <!--seo:end--> in index.html. */
export function headTagsHtml(meta: SeoMeta, siteUrl: string): string {
  const lines = [`<title>${escapeAttr(meta.title)}</title>`];
  for (const t of tagsFor(meta, siteUrl)) {
    if (t.kind === 'link') lines.push(`<link rel="${t.key}" href="${escapeAttr(t.value)}" />`);
    else if (t.kind === 'meta-name') lines.push(`<meta name="${t.key}" content="${escapeAttr(t.value)}" />`);
    else lines.push(`<meta property="${t.key}" content="${escapeAttr(t.value)}" />`);
  }
  const ld = jsonLd(meta, siteUrl);
  if (ld) lines.push(`<script type="application/ld+json" id="ld-page">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  return lines.join('\n    ');
}

/** Updates the live document head after in-app navigation. */
export function applySeo(meta: SeoMeta, siteUrl: string): void {
  document.title = meta.title;
  const tags = tagsFor(meta, siteUrl);
  const wanted = new Set(tags.map((t) => t.key));

  for (const t of tags) {
    const selector =
      t.kind === 'link' ? `link[rel="${t.key}"]` : t.kind === 'meta-name' ? `meta[name="${t.key}"]` : `meta[property="${t.key}"]`;
    let el = document.head.querySelector<HTMLElement>(selector);
    if (!el) {
      el = document.createElement(t.kind === 'link' ? 'link' : 'meta');
      if (t.kind === 'link') el.setAttribute('rel', t.key);
      else el.setAttribute(t.kind === 'meta-name' ? 'name' : 'property', t.key);
      document.head.appendChild(el);
    }
    el.setAttribute(t.kind === 'link' ? 'href' : 'content', t.value);
  }
  if (!wanted.has('article:published_time')) document.head.querySelector('meta[property="article:published_time"]')?.remove();

  const ld = jsonLd(meta, siteUrl);
  let script = document.getElementById('ld-page');
  if (!ld) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = 'ld-page';
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(ld);
}
