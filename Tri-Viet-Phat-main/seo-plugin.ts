// Build-time SEO for the single-page app:
// - fills the <!--seo--> placeholder in index.html with the home page's title, meta, Open Graph and JSON-LD tags
// - writes one HTML file per page (e.g. dist/gioi-thieu.html, dist/tin-tuc/bai-viet/<id>.html) with that page's tags,
//   so crawlers and link previews (Google, Facebook, Zalo) see the right title without running JavaScript
// - writes sitemap.xml and robots.txt
// SITE_URL (env) is the public domain used in canonical links and the sitemap.
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { allRoutes, routePath, seoFor, SITE_NAME, type Route, type SeoLookups } from './src/seo/routes';
import { headTagsHtml } from './src/seo/head';

export const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://trivp.vercel.app').replace(/\/$/, '');

const CONTENT_DIR = path.resolve(__dirname, 'src/content');
const START = '<!--seo:start-->';
const END = '<!--seo:end-->';

function readFolder<T>(folder: string): (T & { id: string })[] {
  const dir = path.join(CONTENT_DIR, folder);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ ...(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as T), id: f.replace(/\.json$/, '') }));
}

function loadContent() {
  const products = readFolder<{ name: string; shortDesc: string; image: string }>('products');
  const news = readFolder<{ title: string; excerpt: string; image: string; date: string }>('news');
  const company = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'settings/company.json'), 'utf-8'));
  const lookups: SeoLookups = {
    product: (id) => products.find((p) => p.id === id),
    article: (id) => news.find((a) => a.id === id),
  };
  return { products, news, company, lookups };
}

function organizationLd(company: Record<string, string>): string {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${company.logoUrl}`,
    email: company.email,
    telephone: company.hotline,
    address: { '@type': 'PostalAddress', streetAddress: company.address, addressLocality: 'Hà Nội', addressCountry: 'VN' },
    sameAs: [company.facebookUrl, company.zaloUrl].filter(Boolean),
  };
  return `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
}

/** "29/11/2024" → "2024-11-29" */
function isoDate(date?: string): string | undefined {
  const m = date?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : undefined;
}

export function seoPlugin(): Plugin {
  let outDir = 'dist';
  let isBuild = false;

  return {
    name: 'tvp-seo',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === 'build';
    },
    transformIndexHtml(html) {
      const { company, lookups } = loadContent();
      const home = headTagsHtml(seoFor({ tab: 'trang-chu' }, lookups), SITE_URL);
      return html.replace('<!--seo-->', `${START}\n    ${home}\n    ${END}\n    ${organizationLd(company)}`);
    },
    closeBundle() {
      if (!isBuild) return;
      const { products, news, lookups } = loadContent();
      const indexHtml = fs.readFileSync(path.join(outDir, 'index.html'), 'utf-8');
      const [before, rest] = indexHtml.split(START);
      const after = rest.split(END)[1];

      const routes: Route[] = allRoutes(
        products.map((p) => p.id),
        news.map((a) => a.id)
      );

      for (const route of routes) {
        const url = routePath(route);
        if (url === '/') continue;
        const html = `${before}${START}\n    ${headTagsHtml(seoFor(route, lookups), SITE_URL)}\n    ${END}${after}`;
        const file = path.join(outDir, `${url.slice(1)}.html`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
      }

      const today = new Date().toISOString().slice(0, 10);
      const urls = routes.map((route) => {
        const article = route.articleId ? news.find((a) => a.id === route.articleId) : undefined;
        const lastmod = isoDate(article?.date) ?? today;
        const priority = route.tab === 'trang-chu' ? '1.0' : route.cat || route.articleId || route.productId ? '0.7' : '0.8';
        return `  <url><loc>${SITE_URL}${routePath(route)}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
      });
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
      );
      fs.writeFileSync(
        path.join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
      );
    },
  };
}
