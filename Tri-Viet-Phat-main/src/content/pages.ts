import { marked } from 'marked';
import home from './pages/trang-chu.json';
import about from './pages/gioi-thieu.json';
import contact from './pages/lien-he.json';
import careers from './pages/tuyen-dung.json';
import products from './pages/san-pham.json';
import documents from './pages/tai-lieu.json';
import footer from './pages/chan-trang.json';
import { WP } from '../wp';

// Text and images of each page, edited in the CMS (/admin → "Nội dung các trang"),
// or in WP Admin → "Trí Đức" → "Nội dung các trang" in the WordPress theme (src/wp.ts).
export const HOME_PAGE: typeof home = import.meta.env.MODE === 'wp' ? WP!.pages['trang-chu'] : home;
export const ABOUT_PAGE: typeof about = import.meta.env.MODE === 'wp' ? WP!.pages['gioi-thieu'] : about;
export const CONTACT_PAGE: typeof contact = import.meta.env.MODE === 'wp' ? WP!.pages['lien-he'] : contact;
export const CAREERS_PAGE: typeof careers = import.meta.env.MODE === 'wp' ? WP!.pages['tuyen-dung'] : careers;
export const PRODUCTS_PAGE: typeof products = import.meta.env.MODE === 'wp' ? WP!.pages['san-pham'] : products;
export const DOCUMENTS_PAGE: typeof documents = import.meta.env.MODE === 'wp' ? WP!.pages['tai-lieu'] : documents;
export const FOOTER_CONTENT: typeof footer = import.meta.env.MODE === 'wp' ? WP!.pages['chan-trang'] : footer;

/** Short CMS text with **bold** / *italic* / links, rendered without a wrapping <p>. */
export function inlineMd(source = ''): string {
  return marked.parseInline(source, { async: false });
}

/** "16+" → { prefix: '', to: 16, suffix: '+' }; "2–4h" → { prefix: '2–', to: 4, suffix: 'h' }. No digits → null. */
export function splitCount(value: string): { prefix: string; to: number; suffix: string } | null {
  const m = value.trim().match(/^(.*?)(\d+)(\D*)$/);
  return m ? { prefix: m[1], to: parseInt(m[2], 10), suffix: m[3] } : null;
}
