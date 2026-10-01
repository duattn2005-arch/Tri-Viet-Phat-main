// WordPress theme build (`npm run build:wp`, Vite mode "wp", see wordpress/build.ts). The theme's PHP
// (wordpress/theme/inc/data.php) loads the site content from WordPress into window.__TD__ before the app
// starts, so news, products, documents, jobs and page texts are edited in WP Admin instead of src/content/.
// Code that must drop the bundled content from the WordPress build checks `import.meta.env.MODE === 'wp'`
// inline (Vite replaces it with a constant, so the unused branch and its imports are left out).
// This file also runs in Node at build time (seo-plugin.ts imports src/seo/), hence globalThis, not window.
import type { Product } from './types';

export interface WpNewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  categorySlug?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface WpEntry extends WpNewsItem {
  /** Body rendered by WordPress (the_content) */
  contentHtml: string;
  quantity?: string;
  location?: string;
}

export type WpProduct = Omit<Product, 'categoryLabel' | 'alt'> & {
  order?: number;
  categoryLabel?: string;
  alt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export interface WpData {
  /** Theme folder with the site's own images (logo, banners, partner logos), no trailing slash */
  assets: string;
  endpoints: { lead: string; chat: string; news: string };
  news: WpNewsItem[];
  documents: WpEntry[];
  jobs: WpEntry[];
  products: WpProduct[];
  /** Page texts by file name in src/content/pages ("trang-chu", "seo", …) */
  pages: Record<string, any>;
  /** src/content/settings: company, about, partners, testimonials */
  settings: Record<string, any>;
  /** Body of the article the visitor landed on, so it shows without a second request */
  article?: { id: string; html: string };
}

export const WP: WpData | undefined = (globalThis as { __TD__?: WpData }).__TD__;

/** An image of the site itself ("/images/…", "/logo-tri-duc.png"): in the WordPress theme it lives in the theme folder. */
export function staticUrl(path: string): string {
  return WP && path.startsWith('/') && !path.startsWith('//') ? `${WP.assets}${path}` : path;
}
