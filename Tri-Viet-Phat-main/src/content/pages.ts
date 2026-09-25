import { marked } from 'marked';
import home from './pages/trang-chu.json';
import about from './pages/gioi-thieu.json';
import contact from './pages/lien-he.json';
import careers from './pages/tuyen-dung.json';
import products from './pages/san-pham.json';
import documents from './pages/tai-lieu.json';
import footer from './pages/chan-trang.json';

// Text and images of each page, edited in the CMS (/admin → "Nội dung các trang").
export const HOME_PAGE = home;
export const ABOUT_PAGE = about;
export const CONTACT_PAGE = contact;
export const CAREERS_PAGE = careers;
export const PRODUCTS_PAGE = products;
export const DOCUMENTS_PAGE = documents;
export const FOOTER_CONTENT = footer;

/** Short CMS text with **bold** / *italic* / links, rendered without a wrapping <p>. */
export function inlineMd(source = ''): string {
  return marked.parseInline(source, { async: false });
}

/** "16+" → { prefix: '', to: 16, suffix: '+' }; "2–4h" → { prefix: '2–', to: 4, suffix: 'h' }. No digits → null. */
export function splitCount(value: string): { prefix: string; to: number; suffix: string } | null {
  const m = value.trim().match(/^(.*?)(\d+)(\D*)$/);
  return m ? { prefix: m[1], to: parseInt(m[2], 10), suffix: m[3] } : null;
}
