import { demoteH1, fromFolder, renderRich, toPlainText } from '../content/load';
import newsIndex from 'virtual:news-index';
import { WP, type WpEntry } from '../wp';

export interface SiteArticle {
  id: string;
  slug?: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  url: string;
  contentHtml: string;
  plainText: string;
  category?: string;
  categorySlug?: string;
  /** Written in the admin's SEO box; the title and excerpt are used when empty. */
  seoTitle?: string;
  seoDescription?: string;
}

export interface JobItem {
  id: string;
  slug?: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  url: string;
  quantity: string;
  location: string;
  contentHtml: string;
  plainText: string;
}

// Keep in sync with the news "categorySlug" options in public/admin/config.yml
export const NEWS_CATEGORY_LABELS: Record<string, string> = {
  'kien-thuc-suc-khoe': 'Kiến thức sức khỏe',
  'tin-y-te': 'Tin y tế',
  'tin-noi-bo': 'Tin nội bộ',
};

type ArticleEntry = Omit<SiteArticle, 'id' | 'url' | 'contentHtml' | 'plainText'> & { order?: number; content?: string };

function toSiteArticles<T extends ArticleEntry>(modules: Record<string, T>) {
  return fromFolder(modules).map(({ content, ...entry }) => {
    const contentHtml = renderRich(content);
    return { ...entry, url: '', contentHtml, plainText: toPlainText(contentHtml) };
  });
}

/** Documents and jobs from WordPress (src/wp.ts): the body is already HTML. */
function fromWordPress(entries: WpEntry[]) {
  return entries.map(({ contentHtml, ...entry }) => {
    const html = demoteH1(contentHtml);
    return { ...entry, url: '', contentHtml: html, plainText: toPlainText(html) };
  });
}

// Editable in the CMS (/admin): news, documents and job openings.
// News lists come from a small build-time index; each body is a separate chunk loaded on demand
// (contentHtml stays '' until then, and search covers title + excerpt).
export const REAL_NEWS_ARTICLES: SiteArticle[] = (import.meta.env.MODE === 'wp' ? WP!.news : newsIndex).map(
  ({ order: _order, ...entry }: { order?: number } & Omit<SiteArticle, 'url' | 'contentHtml' | 'plainText'>) => ({
    ...entry,
    url: '',
    contentHtml: '',
    plainText: entry.excerpt,
  })
);

const newsBodies: Record<string, () => Promise<ArticleEntry>> =
  import.meta.env.MODE === 'wp' ? {} : import.meta.glob<ArticleEntry>('../content/news/*.json', { import: 'default' });

/** Rendered HTML body of a news article, or '' if it does not exist. */
export async function loadNewsHtml(id: string): Promise<string> {
  if (import.meta.env.MODE === 'wp') {
    // WordPress: the article the visitor landed on comes with the page, any other one from the theme's endpoint
    if (WP!.article?.id === id) return demoteH1(WP!.article.html);
    const res = await fetch(`${WP!.endpoints.news}${encodeURIComponent(id)}`).catch(() => null);
    const data = res?.ok ? await res.json().catch(() => null) : null;
    return data?.html ? demoteH1(data.html) : '';
  }
  const load = newsBodies[`../content/news/${id}.json`];
  return load ? renderRich((await load()).content) : '';
}

export const REAL_DOCUMENTS: SiteArticle[] =
  import.meta.env.MODE === 'wp'
    ? fromWordPress(WP!.documents)
    : toSiteArticles(import.meta.glob<ArticleEntry>('../content/documents/*.json', { eager: true, import: 'default' }));

export const REAL_JOBS: JobItem[] =
  import.meta.env.MODE === 'wp'
    ? (fromWordPress(WP!.jobs) as JobItem[])
    : toSiteArticles(
        import.meta.glob<ArticleEntry & Pick<JobItem, 'quantity' | 'location'>>('../content/jobs/*.json', {
          eager: true,
          import: 'default',
        })
      );

export const SIDEBAR_CATEGORIES = [
  { name: 'Bán thiết bị y tế Hà Nội', link: '/tin-tuc' },
  { name: 'Bán thiết bị y tế Việt', link: '/tin-tuc' },
  { name: 'Bán vật tư tiêu hao Hà Nội', link: '/tin-tuc' },
  { name: 'Bán vật tư tiêu hao Việt', link: '/tin-tuc' },
  { name: 'Kiến thức sức khỏe', link: '/tin-tuc/kien-thuc-suc-khoe' },
  { name: 'Tài liệu', link: '/tai-lieu' },
  { name: 'Tài liệu hướng dẫn bảo trì sửa chữa', link: '/tai-lieu/huong-dan-bao-tri' },
  { name: 'Tài liệu sản phẩm', link: '/tai-lieu/tai-lieu-san-pham' },
  { name: 'Thiết bị y tế', link: '/san-pham' },
  { name: 'Tin nội bộ', link: '/tin-tuc/tin-noi-bo' },
  { name: 'Tin tức', link: '/tin-tuc' },
  { name: 'Tin y tế', link: '/tin-tuc/tin-y-te' },
  { name: 'Video hướng dẫn sử dụng máy', link: '/tai-lieu/video-huong-dan' },
  { name: 'Video giới thiệu', link: '/gioi-thieu' },
];

export const SIDEBAR_WEBSITE_LINKS = [
  { name: 'Thiết bị y tế tiêu hao', link: '/' },
  { name: 'Thiết bị y tế trí đức', link: '/' },
  { name: 'Thiết bị y tế trí đức', link: '/' },
  { name: 'Hóa chất xét nghiệm y tế', link: '/san-pham/hoa-chat-xet-nghiem' },
  { name: 'Máy xét nghiệm y tế', link: '/san-pham' },
];
