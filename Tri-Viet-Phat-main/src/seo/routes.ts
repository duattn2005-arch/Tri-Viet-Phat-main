// URL scheme and per-page SEO data. Plain TypeScript with no Vite-only APIs, so the same code runs in
// the browser (App.tsx) and at build time (seo-plugin.ts, which writes sitemap.xml and per-page HTML).
import type { PageTab } from '../types';
import { brandBySlug, brandOf, BRANDS } from './brands';

export const SITE_NAME = 'Trí Việt Phát';
export const DEFAULT_IMAGE = '/images/hero-lab-analyzers.jpg';
const DEFAULT_DESCRIPTION =
  'Phân phối chính hãng máy xét nghiệm Dirui (sinh hóa, nước tiểu, huyết học), hóa chất xét nghiệm Dewei, máy điện giải, HbA1c. Lắp đặt, bảo hành toàn quốc.';
export const HOTLINE = '0392.123.688';

export interface Route {
  tab: PageTab;
  cat?: string;
  articleId?: string;
  productId?: string;
  /** Brand landing page (/thuong-hieu/<slug>), shown by the products screen */
  brand?: string;
}

// Keep in sync with the filter lists in ProductsScreen, DocumentsScreen and NEWS_CATEGORY_LABELS
export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  'may-xet-nghiem-sinh-hoa': 'Máy xét nghiệm sinh hóa',
  'may-xet-nghiem-nuoc-tieu': 'Máy xét nghiệm nước tiểu',
  'may-xet-nghiem-huyet-hoc': 'Máy xét nghiệm huyết học',
  'may-xet-nghiem-dien-giai': 'Máy xét nghiệm điện giải',
  'may-xet-nghiem-mien-dich': 'Máy xét nghiệm miễn dịch',
  'may-phan-tich-dong-mau': 'Máy phân tích đông máu',
  'may-xet-nghiem-hba1c': 'Máy xét nghiệm HbA1c',
  'hoa-chat-xet-nghiem': 'Hóa chất và thuốc thử xét nghiệm',
  'thiet-bi-khac': 'Máy ly tâm và thiết bị khác',
};

export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  'video-huong-dan': 'Video hướng dẫn sử dụng',
  'tai-lieu-san-pham': 'Tài liệu sản phẩm',
  'huong-dan-bao-tri': 'Hướng dẫn bảo trì sửa chữa',
};

export const NEWS_CATEGORY_TITLES: Record<string, string> = {
  'kien-thuc-suc-khoe': 'Kiến thức sức khỏe',
  'tin-y-te': 'Tin y tế',
  'tin-noi-bo': 'Tin nội bộ',
};

const TAB_PATHS: Record<PageTab, string> = {
  'trang-chu': '/',
  'gioi-thieu': '/gioi-thieu',
  'san-pham': '/san-pham',
  'tai-lieu': '/tai-lieu',
  'tin-tuc': '/tin-tuc',
  'tuyen-dung': '/tuyen-dung',
  'lien-he': '/lien-he',
};

const CATEGORY_LABELS: Partial<Record<PageTab, Record<string, string>>> = {
  'san-pham': PRODUCT_CATEGORY_LABELS,
  'tai-lieu': DOCUMENT_CATEGORY_LABELS,
  'tin-tuc': NEWS_CATEGORY_TITLES,
};

export function routePath(route: Route): string {
  if (route.productId) return `/san-pham/chi-tiet/${route.productId}`;
  if (route.brand && brandBySlug(route.brand)) return `/thuong-hieu/${route.brand}`;
  if (route.tab === 'tin-tuc' && route.articleId) return `/tin-tuc/bai-viet/${route.articleId}`;
  const base = TAB_PATHS[route.tab];
  return route.cat && route.cat !== 'all' && CATEGORY_LABELS[route.tab]?.[route.cat] ? `${base}/${route.cat}` : base;
}

export function parseRoute(pathname: string): Route {
  const parts = pathname.replace(/\.html$/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'thuong-hieu' && brandBySlug(parts[1])) return { tab: 'san-pham', brand: parts[1] };
  const tab = (Object.keys(TAB_PATHS) as PageTab[]).find((t) => TAB_PATHS[t] === `/${parts[0] ?? ''}`);
  if (!tab || tab === 'trang-chu') return { tab: 'trang-chu' };
  if (tab === 'san-pham' && parts[1] === 'chi-tiet' && parts[2]) return { tab, productId: parts[2] };
  if (tab === 'tin-tuc' && parts[1] === 'bai-viet' && parts[2]) return { tab, articleId: parts[2] };
  if (parts[1] && CATEGORY_LABELS[tab]?.[parts[1]]) return { tab, cat: parts[1] };
  return { tab };
}

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  image: string;
  type: 'website' | 'article' | 'product';
  published?: string;
  /** Trail from the home page to this page, for BreadcrumbList structured data */
  breadcrumbs?: { name: string; path: string }[];
}

export interface SeoLookups {
  article?: (id: string) => { title: string; excerpt: string; image: string; date: string } | undefined;
  product?: (id: string) => { name: string; shortDesc: string; image: string; brand?: string; categoryLabel?: string; origin?: string } | undefined;
}

/** Google shows about 60 title characters and 160 description characters. */
function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max * 0.6))}…`;
}

function withBrand(title: string): string {
  const full = `${title} | ${SITE_NAME}`;
  return full.length <= 60 ? full : clip(title, 60);
}

/** "29/11/2024" → "2024-11-29" */
function isoDate(date: string): string | undefined {
  const m = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : undefined;
}

const PAGES: Record<PageTab, { title: string; description: string }> = {
  'trang-chu': {
    title: 'Máy xét nghiệm Dirui, hóa chất xét nghiệm | Trí Việt Phát',
    description: DEFAULT_DESCRIPTION,
  },
  'gioi-thieu': {
    title: withBrand('Giới thiệu công ty'),
    description:
      'Hơn 16 năm cung ứng thiết bị và hóa chất xét nghiệm IVD chính hãng cho bệnh viện, phòng khám trên toàn quốc. Tầm nhìn, sứ mệnh và năng lực của Trí Việt Phát.',
  },
  'san-pham': {
    title: withBrand('Máy xét nghiệm, hóa chất xét nghiệm'),
    description:
      'Máy xét nghiệm sinh hóa, nước tiểu, huyết học Dirui, máy điện giải, HbA1c, miễn dịch, đông máu và hóa chất xét nghiệm chính hãng, có CO/CQ. Báo giá nhanh.',
  },
  'tai-lieu': {
    title: withBrand('Tài liệu kỹ thuật & video hướng dẫn'),
    description:
      'Catalog, tài liệu kỹ thuật, video hướng dẫn sử dụng và cẩm nang bảo trì máy xét nghiệm y khoa do kỹ sư Trí Việt Phát biên soạn.',
  },
  'tin-tuc': {
    title: withBrand('Tin tức & kiến thức xét nghiệm'),
    description:
      'Tin y tế, kiến thức sức khỏe và kinh nghiệm vận hành phòng xét nghiệm, cập nhật bởi đội ngũ kỹ sư Trí Việt Phát.',
  },
  'tuyen-dung': {
    title: withBrand('Tuyển dụng'),
    description:
      'Cơ hội việc làm tại Trí Việt Phát: kỹ sư thiết bị y tế, nhân viên kinh doanh và các vị trí khác. Nộp hồ sơ trực tuyến nhanh chóng.',
  },
  'lien-he': {
    title: withBrand('Liên hệ báo giá & tư vấn'),
    description:
      'Liên hệ Trí Việt Phát để nhận báo giá thiết bị, hóa chất xét nghiệm và hỗ trợ kỹ thuật. Hotline 0392.123.688, văn phòng tại Hoàng Mai, Hà Nội.',
  },
};

function seoCore(route: Route, lookups: SeoLookups): SeoMeta {
  const path = routePath(route);

  if (route.productId) {
    const p = lookups.product?.(route.productId);
    if (p) {
      // Put the manufacturer in the title ("… CS-600B Dirui") since people search by brand
      const brand = brandOf(p.brand);
      const name = p.name.replace(/\s+/g, ' ').trim();
      const title = brand && !name.toLowerCase().includes(brand.name.toLowerCase()) ? `${name} ${brand.name}` : name;
      const origin = p.origin ? ` (${p.origin})` : '';
      const description = `${title} chính hãng${origin}, đủ CO/CQ, bảo hành 12 tháng, lắp đặt tận nơi. Báo giá nhanh: ${HOTLINE}.`;
      return {
        title: withBrand(title),
        description: clip(description.length >= 110 ? description : `${description} ${p.shortDesc}`, 160),
        path,
        image: p.image || DEFAULT_IMAGE,
        type: 'product',
      };
    }
  }

  if (route.articleId) {
    const a = lookups.article?.(route.articleId);
    if (a) {
      return {
        title: withBrand(a.title),
        description: clip(a.excerpt, 160),
        path,
        image: a.image || DEFAULT_IMAGE,
        type: 'article',
        published: isoDate(a.date),
      };
    }
  }

  const brand = brandBySlug(route.brand);
  if (brand) {
    return {
      title: withBrand(`${brand.heading}, giá tốt`),
      description: clip(brand.intro, 160),
      path,
      image: DEFAULT_IMAGE,
      type: 'website',
    };
  }

  const page = PAGES[route.tab];
  const catLabel = route.cat ? CATEGORY_LABELS[route.tab]?.[route.cat] : undefined;
  if (catLabel) {
    const keyword = route.tab === 'san-pham' ? `${catLabel} chính hãng, giá tốt` : catLabel;
    return {
      title: withBrand(keyword.length <= 44 ? keyword : catLabel),
      description: clip(
        route.tab === 'san-pham'
          ? `${catLabel} chính hãng Dirui, DFI, Audicom… đủ CO/CQ. Báo giá tốt, lắp đặt, đào tạo và bảo hành tận nơi toàn quốc. Hotline ${HOTLINE}.`
          : `${catLabel}: ${page.description}`,
        160
      ),
      path,
      image: DEFAULT_IMAGE,
      type: 'website',
    };
  }
  return { ...page, path, image: DEFAULT_IMAGE, type: 'website' };
}

const TAB_LABELS: Record<PageTab, string> = {
  'trang-chu': 'Trang chủ',
  'gioi-thieu': 'Giới thiệu',
  'san-pham': 'Sản phẩm',
  'tai-lieu': 'Tài liệu',
  'tin-tuc': 'Tin tức',
  'tuyen-dung': 'Tuyển dụng',
  'lien-he': 'Liên hệ',
};

export function seoFor(route: Route, lookups: SeoLookups = {}): SeoMeta {
  const meta = seoCore(route, lookups);
  if (route.tab === 'trang-chu') return meta;

  const trail = [
    { name: TAB_LABELS['trang-chu'], path: '/' },
    { name: TAB_LABELS[route.tab], path: routePath({ tab: route.tab }) },
  ];
  const product = route.productId ? lookups.product?.(route.productId) : undefined;
  const catLabel = route.cat ? CATEGORY_LABELS[route.tab]?.[route.cat] : undefined;
  const brand = brandBySlug(route.brand);
  if (product) {
    const cat = Object.entries(PRODUCT_CATEGORY_LABELS).find(([, label]) => label === product.categoryLabel)?.[0];
    if (cat) trail.push({ name: PRODUCT_CATEGORY_LABELS[cat], path: routePath({ tab: 'san-pham', cat }) });
    trail.push({ name: product.name, path: meta.path });
  } else if (brand) {
    trail.push({ name: brand.heading, path: meta.path });
  } else if (catLabel) {
    trail.push({ name: catLabel, path: meta.path });
  } else if (route.articleId) {
    const article = lookups.article?.(route.articleId);
    if (article) trail.push({ name: article.title, path: meta.path });
  }
  return { ...meta, breadcrumbs: trail };
}

/** Every indexable page, for sitemap.xml and the per-page HTML written at build time. */
export function allRoutes(productIds: string[], articleIds: string[]): Route[] {
  const tabs = Object.keys(TAB_PATHS) as PageTab[];
  return [
    ...tabs.map((tab) => ({ tab })),
    ...tabs.flatMap((tab) => Object.keys(CATEGORY_LABELS[tab] ?? {}).map((cat) => ({ tab, cat }))),
    ...BRANDS.map((b) => ({ tab: 'san-pham' as PageTab, brand: b.slug })),
    ...productIds.map((productId) => ({ tab: 'san-pham' as PageTab, productId })),
    ...articleIds.map((articleId) => ({ tab: 'tin-tuc' as PageTab, articleId })),
  ];
}
