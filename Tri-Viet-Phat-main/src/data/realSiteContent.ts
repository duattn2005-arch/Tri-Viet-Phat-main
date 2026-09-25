import { fromFolder, renderRich, toPlainText } from '../content/load';
import newsIndex from 'virtual:news-index';

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

// Editable in the CMS (/admin): news, documents and job openings.
// News lists come from a small build-time index; each body is a separate chunk loaded on demand
// (contentHtml stays '' until then, and search covers title + excerpt).
export const REAL_NEWS_ARTICLES: SiteArticle[] = newsIndex.map(({ order: _order, ...entry }) => ({
  ...entry,
  url: '',
  contentHtml: '',
  plainText: entry.excerpt,
}));

const newsBodies = import.meta.glob<ArticleEntry>('../content/news/*.json', { import: 'default' });

/** Rendered HTML body of a news article, or '' if it does not exist. */
export async function loadNewsHtml(id: string): Promise<string> {
  const load = newsBodies[`../content/news/${id}.json`];
  return load ? renderRich((await load()).content) : '';
}

export const REAL_DOCUMENTS: SiteArticle[] = toSiteArticles(
  import.meta.glob<ArticleEntry>('../content/documents/*.json', { eager: true, import: 'default' })
);

export const REAL_JOBS: JobItem[] = toSiteArticles(
  import.meta.glob<ArticleEntry & Pick<JobItem, 'quantity' | 'location'>>('../content/jobs/*.json', { eager: true, import: 'default' })
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
  { name: 'Thiết bị y tế trí việt phát', link: '/' },
  { name: 'Thiết bị y tế trí đức', link: '/' },
  { name: 'Hóa chất xét nghiệm y tế', link: '/san-pham/hoa-chat-xet-nghiem' },
  { name: 'Máy xét nghiệm y tế', link: '/san-pham' },
];
