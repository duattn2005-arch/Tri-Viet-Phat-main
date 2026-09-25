// Build-time SEO for the single-page app:
// - fills the <!--seo--> placeholder in index.html with the home page's title, meta, Open Graph and JSON-LD tags
// - writes one HTML file per page (e.g. dist/gioi-thieu.html, dist/tin-tuc/bai-viet/<id>.html) with that page's tags,
//   so crawlers and link previews (Google, Facebook, Zalo) see the right title without running JavaScript
// - puts a plain-HTML version of each page's main content inside <div id="root"> (headings, text, specs and
//   links), which React replaces on load; search engines get real text and a crawlable link graph at once
// - writes sitemap.xml and robots.txt
// SITE_URL (env) is the public domain used in canonical links and the sitemap.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { marked } from 'marked';
import {
  allRoutes,
  routePath,
  seoFor,
  SITE_NAME,
  HOTLINE,
  PRODUCT_CATEGORY_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  NEWS_CATEGORY_TITLES,
  type Route,
  type SeoLookups,
} from './src/seo/routes';
import { headTagsHtml } from './src/seo/head';
import { BRANDS, brandBySlug, brandFaq, brandOf, brandSubject, type Brand, type BrandFaq } from './src/seo/brands';
import { demoteH1 } from './src/content/load';

export const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://thietbiytegroup.com').replace(/\/$/, '');

const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url));
const CONTENT_DIR = path.resolve(ROOT_DIR, 'src/content');
const START = '<!--seo:start-->';
const END = '<!--seo:end-->';
const ROOT = '<div id="root"></div>';

interface ProductEntry {
  order?: number;
  name: string;
  model?: string;
  shortDesc: string;
  fullDesc?: string;
  image: string;
  brand?: string;
  origin?: string;
  category: string;
  categoryLabel?: string;
  specs?: { label: string; value: string }[];
  features?: string[];
}

interface NewsEntry {
  order?: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  categorySlug?: string;
  content?: string;
}

function readFolder<T>(folder: string): (T & { id: string })[] {
  const dir = path.join(CONTENT_DIR, folder);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ ...(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as T), id: f.replace(/\.json$/, '') }));
}

function loadContent() {
  const byOrder = (a: { order?: number }, b: { order?: number }) => (a.order ?? 0) - (b.order ?? 0);
  const products = readFolder<ProductEntry>('products').sort(byOrder);
  const news = readFolder<NewsEntry>('news').sort(byOrder);
  const company = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'settings/company.json'), 'utf-8'));
  const lookups: SeoLookups = {
    product: (id) => products.find((p) => p.id === id),
    article: (id) => news.find((a) => a.id === id),
  };
  return { products, news, company, lookups };
}

type Content = ReturnType<typeof loadContent>;

const jsonScript = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function organizationLd(company: Record<string, string>): string {
  return jsonScript([
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#business`,
      name: company.name,
      alternateName: SITE_NAME,
      description:
        'Nhà phân phối chính hãng máy xét nghiệm Dirui, hóa chất xét nghiệm Dewei và thiết bị y tế cho bệnh viện, phòng khám toàn quốc.',
      url: SITE_URL,
      logo: `${SITE_URL}${company.logoUrl}`,
      image: `${SITE_URL}/images/hero-lab-analyzers.jpg`,
      email: company.email,
      telephone: company.hotline,
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.address,
        addressLocality: 'Hà Nội',
        addressRegion: 'Hà Nội',
        addressCountry: 'VN',
      },
      areaServed: { '@type': 'Country', name: 'Việt Nam' },
      knowsAbout: [
        'Máy xét nghiệm Dirui',
        'Máy xét nghiệm sinh hóa',
        'Máy xét nghiệm nước tiểu',
        'Máy xét nghiệm huyết học',
        'Hóa chất xét nghiệm',
        'Thiết bị y tế',
      ],
      sameAs: [company.facebookUrl, company.zaloUrl].filter(Boolean),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'vi-VN',
      publisher: { '@id': `${SITE_URL}/#business` },
    },
  ]);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const link = (route: Route, text: string) => `<a href="${routePath(route)}">${esc(text)}</a>`;
const list = (items: string[]) => (items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '');

/** Product name with its brand, as people search for it ("… CS-600B Dirui"). */
function productTitle(p: ProductEntry): string {
  const brand = brandOf(p.brand);
  return brand && !p.name.toLowerCase().includes(brand.name.toLowerCase()) ? `${p.name} ${brand.name}` : p.name;
}

/** Same comparison spec as BrandGuide in the app: throughput first, otherwise the first listed spec. */
function keySpec(p: ProductEntry): string {
  const specs = p.specs ?? [];
  const spec = specs.find((s) => /tốc độ|công suất|test\/h|mẫu\/giờ/i.test(`${s.label} ${s.value}`)) ?? specs[0];
  return spec ? `${spec.label}: ${spec.value}` : p.shortDesc;
}

function brandGroups<T extends ProductEntry>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const p of items) {
    const label = PRODUCT_CATEGORY_LABELS[p.category] || p.categoryLabel || 'Sản phẩm';
    (groups[label] ??= []).push(p);
  }
  return groups;
}

function brandFaqFor(brand: Brand, items: ProductEntry[], hotline: string): BrandFaq[] {
  const byCategory = Object.fromEntries(
    Object.entries(brandGroups(items)).map(([label, list]) => [label, list.map((p) => p.model || p.name)])
  );
  return brandFaq(brand, byCategory, hotline);
}

/** FAQPage structured data for a brand page (Google can quote these answers). */
function faqLd(faq: BrandFaq[]): string {
  return jsonScript({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  });
}

/** Plain-HTML content for one page, shown until the app loads (and read by crawlers). */
function fallbackBody(route: Route, content: Content): string {
  const { products, news, company, lookups } = content;
  const meta = seoFor(route, lookups);
  const productItem = (p: ProductEntry & { id: string }) =>
    `${link({ tab: 'san-pham', productId: p.id }, productTitle(p))}${p.shortDesc ? ` – ${esc(p.shortDesc)}` : ''}`;
  const categoryLinks = Object.entries(PRODUCT_CATEGORY_LABELS).map(([cat, label]) => link({ tab: 'san-pham', cat }, label));
  const brandLinks = BRANDS.map((b) => link({ tab: 'san-pham', brand: b.slug }, b.heading));
  let main = '';

  if (route.productId) {
    const p = products.find((x) => x.id === route.productId);
    if (p) {
      const brand = brandOf(p.brand);
      const specs = p.specs?.length
        ? `<h2>Thông số kỹ thuật</h2><table>${p.specs
            .map((s) => `<tr><th>${esc(s.label)}</th><td>${esc(s.value)}</td></tr>`)
            .join('')}</table>`
        : '';
      const features = p.features?.length ? `<h2>Tính năng nổi bật</h2>${list(p.features.map(esc))}` : '';
      const catLink = link({ tab: 'san-pham', cat: p.category }, PRODUCT_CATEGORY_LABELS[p.category] || p.categoryLabel || 'Sản phẩm');
      const brandLink = brand ? ` · Thương hiệu: ${link({ tab: 'san-pham', brand: brand.slug }, brand.heading)}` : '';
      main = [
        `<h1>${esc(productTitle(p))}</h1>`,
        `<p>${esc(p.shortDesc)}</p>`,
        p.fullDesc ? `<p>${esc(p.fullDesc)}</p>` : '',
        specs,
        features,
        `<p>Danh mục: ${catLink}${brandLink}</p>`,
        `<p>Liên hệ báo giá ${esc(productTitle(p))}: hotline ${esc(HOTLINE)}.</p>`,
      ].join('\n');
    }
  } else if (route.articleId) {
    const a = news.find((x) => x.id === route.articleId);
    if (a) {
      const body = demoteH1(marked.parse(a.content || a.excerpt, { async: false }) as string);
      main = `<article><h1>${esc(a.title)}</h1><p><time>${esc(a.date)}</time></p>${body}</article>`;
    }
  } else if (route.brand) {
    const brand = brandBySlug(route.brand)!;
    const items = products.filter((p) => brandOf(p.brand)?.slug === brand.slug);
    const groups = brandGroups(items);
    const tables = Object.entries(groups)
      .map(
        ([label, list]) =>
          `<h3>${esc(label)}</h3><table><tr><th>Model</th><th>Thông số nổi bật</th><th>Xuất xứ</th></tr>${list
            .map(
              (p) =>
                `<tr><td>${link({ tab: 'san-pham', productId: p.id }, productTitle(p))}</td><td>${esc(keySpec(p))}</td><td>${esc(p.origin || '')}</td></tr>`
            )
            .join('')}</table>`
      )
      .join('');
    const faq = brandFaqFor(brand, items, content.company.hotline)
      .map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`)
      .join('');
    main = [
      `<h1>${esc(brand.heading)}</h1><p>${esc(brand.intro)}</p>`,
      `<h2>Sản phẩm ${esc(brand.name)}</h2>${list(items.map(productItem))}`,
      items.length ? `<h2>So sánh các dòng ${esc(brandSubject(brand))}</h2>${tables}` : '',
      items.length ? `<h2>Câu hỏi thường gặp về ${esc(brand.name)}</h2>${faq}` : '',
    ].join('\n');
  } else if (route.tab === 'san-pham') {
    const items = route.cat ? products.filter((p) => p.category === route.cat) : products;
    const heading = route.cat ? PRODUCT_CATEGORY_LABELS[route.cat] : 'Máy xét nghiệm và hóa chất xét nghiệm chính hãng';
    main = [
      `<h1>${esc(heading)}</h1>`,
      `<p>${esc(meta.description)}</p>`,
      list(items.map(productItem)),
      `<h2>Danh mục sản phẩm</h2>${list(categoryLinks)}`,
      `<h2>Thương hiệu</h2>${list(brandLinks)}`,
    ].join('\n');
  } else if (route.tab === 'tin-tuc') {
    const items = route.cat ? news.filter((a) => a.categorySlug === route.cat) : news;
    const heading = route.cat ? NEWS_CATEGORY_TITLES[route.cat] : 'Tin tức và kiến thức xét nghiệm';
    const articles = items.map((a) => `${link({ tab: 'tin-tuc', articleId: a.id }, a.title)} – ${esc(a.excerpt.slice(0, 200))}`);
    main = `<h1>${esc(heading)}</h1><p>${esc(meta.description)}</p>${list(articles)}`;
  } else if (route.tab === 'tai-lieu') {
    const heading = route.cat ? DOCUMENT_CATEGORY_LABELS[route.cat] : 'Tài liệu kỹ thuật và video hướng dẫn';
    const cats = Object.entries(DOCUMENT_CATEGORY_LABELS).map(([cat, label]) => link({ tab: 'tai-lieu', cat }, label));
    main = `<h1>${esc(heading)}</h1><p>${esc(meta.description)}</p>${list(cats)}`;
  } else if (route.tab === 'trang-chu') {
    main = [
      `<h1>Máy xét nghiệm Dirui, hóa chất xét nghiệm chính hãng – ${esc(SITE_NAME)}</h1>`,
      `<p>${esc(meta.description)}</p>`,
      `<h2>Danh mục máy xét nghiệm</h2>${list(categoryLinks)}`,
      `<h2>Thương hiệu phân phối</h2>${list(brandLinks)}`,
      `<h2>Sản phẩm</h2>${list(products.map(productItem))}`,
      `<h2>Tin tức mới</h2>${list(news.slice(0, 20).map((a) => link({ tab: 'tin-tuc', articleId: a.id }, a.title)))}`,
    ].join('\n');
  } else {
    main = `<h1>${esc(meta.title.replace(` | ${SITE_NAME}`, ''))}</h1><p>${esc(meta.description)}</p>`;
  }

  const nav = list([
    link({ tab: 'trang-chu' }, 'Trang chủ'),
    link({ tab: 'gioi-thieu' }, 'Giới thiệu'),
    link({ tab: 'san-pham' }, 'Sản phẩm'),
    link({ tab: 'san-pham', brand: 'dirui' }, 'Máy xét nghiệm Dirui'),
    link({ tab: 'tai-lieu' }, 'Tài liệu'),
    link({ tab: 'tin-tuc' }, 'Tin tức'),
    link({ tab: 'tuyen-dung' }, 'Tuyển dụng'),
    link({ tab: 'lien-he' }, 'Liên hệ'),
  ]);
  const tel = `tel:${String(company.hotline).replace(/\./g, '')}`;
  const contact = `<p>${esc(company.name)} – ${esc(company.address)}. Hotline: <a href="${tel}">${esc(company.hotline)}</a>${
    company.hotline2 ? `, ${esc(company.hotline2)}` : ''
  }. Email: ${esc(company.email)}.</p>`;

  return `<div id="seo-fallback" style="max-width:1100px;margin:0 auto;padding:24px 16px;font-family:system-ui,sans-serif;line-height:1.6;color:#111">
<nav aria-label="Điều hướng">${nav}</nav>
<main>${main}</main>
<footer>${contact}</footer>
</div>`;
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
      const content = loadContent();
      const { products, news, lookups } = content;
      const indexHtml = fs.readFileSync(path.join(outDir, 'index.html'), 'utf-8');
      const [before, rest] = indexHtml.split(START);
      const after = rest.split(END)[1];
      if (!after.includes(ROOT)) throw new Error(`seo-plugin: ${ROOT} not found in index.html`);

      const routes: Route[] = allRoutes(
        products.map((p) => p.id),
        news.map((a) => a.id)
      );

      for (const route of routes) {
        const url = routePath(route);
        const body = after.replace(ROOT, `<div id="root">${fallbackBody(route, content)}</div>`);
        const brand = brandBySlug(route.brand);
        const brandItems = brand ? products.filter((p) => brandOf(p.brand)?.slug === brand.slug) : [];
        const extraLd = brand && brandItems.length ? `\n    ${faqLd(brandFaqFor(brand, brandItems, content.company.hotline))}` : '';
        const html = `${before}${START}\n    ${headTagsHtml(seoFor(route, lookups), SITE_URL)}${extraLd}\n    ${END}${body}`;
        const file = url === '/' ? path.join(outDir, 'index.html') : path.join(outDir, `${url.slice(1)}.html`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
      }

      const today = new Date().toISOString().slice(0, 10);
      const urls = routes.map((route) => {
        const article = route.articleId ? news.find((a) => a.id === route.articleId) : undefined;
        const lastmod = isoDate(article?.date) ?? today;
        const priority =
          route.tab === 'trang-chu' ? '1.0' : route.brand === 'dirui' ? '0.9' : route.cat || route.articleId || route.productId || route.brand ? '0.7' : '0.8';
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

      // Facts for the AI chat (api/chat.php): the current catalogue and company details, so answers
      // follow what the CMS holds instead of a hand-written prompt
      const knowledge = {
        company: {
          name: content.company.name,
          hotline: content.company.hotline,
          hotline2: content.company.hotline2 || undefined,
          email: content.company.email,
          address: content.company.address,
          website: SITE_URL,
        },
        products: products.map((p) => ({
          name: productTitle(p),
          brand: brandOf(p.brand)?.name ?? p.brand,
          category: PRODUCT_CATEGORY_LABELS[p.category] || p.categoryLabel,
          origin: p.origin,
          url: `${SITE_URL}${routePath({ tab: 'san-pham', productId: p.id })}`,
          summary: p.shortDesc,
          specs: (p.specs ?? []).slice(0, 15).map((s) => `${s.label}: ${s.value}`),
        })),
        brands: BRANDS.map((b) => ({ name: b.name, page: `${SITE_URL}/thuong-hieu/${b.slug}`, about: b.intro })),
      };
      fs.mkdirSync(path.join(outDir, 'api'), { recursive: true });
      fs.writeFileSync(path.join(outDir, 'api', 'ai-knowledge.json'), JSON.stringify(knowledge));
    },
  };
}
