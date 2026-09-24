import { fromFolder, renderRich, toPlainText } from '../content/load';

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
export const REAL_NEWS_ARTICLES: SiteArticle[] = toSiteArticles(
  import.meta.glob<ArticleEntry>('../content/news/*.json', { eager: true, import: 'default' })
);

export const REAL_DOCUMENTS: SiteArticle[] = toSiteArticles(
  import.meta.glob<ArticleEntry>('../content/documents/*.json', { eager: true, import: 'default' })
);

export const REAL_JOBS: JobItem[] = toSiteArticles(
  import.meta.glob<ArticleEntry & Pick<JobItem, 'quantity' | 'location'>>('../content/jobs/*.json', { eager: true, import: 'default' })
);

export const SIDEBAR_CATEGORIES = [
  { name: 'Bán thiết bị y tế Hà Nội', link: 'https://thietbiytegroup.com/ban-thiet-bi-y-te-ha-noi/' },
  { name: 'Bán thiết bị y tế Việt', link: 'https://thietbiytegroup.com/ban-thiet-bi-y-te-viet/' },
  { name: 'Bán vật tư tiêu hao Hà Nội', link: 'https://thietbiytegroup.com/ban-vat-tu-tieu-hao-ha-noi/' },
  { name: 'Bán vật tư tiêu hao Việt', link: 'https://thietbiytegroup.com/ban-vat-tu-tieu-hao-viet/' },
  { name: 'Kiến thức sức khỏe', link: 'https://thietbiytegroup.com/kien-thuc-suc-khoe/' },
  { name: 'Tài liệu', link: 'https://thietbiytegroup.com/tai-lieu/' },
  { name: 'Tài liệu hướng dẫn bảo trì sửa chữa', link: 'https://thietbiytegroup.com/tai-lieu-huong-dan-bao-tri-sua-chua/' },
  { name: 'Tài liệu sản phẩm', link: 'https://thietbiytegroup.com/tai-lieu-san-pham/' },
  { name: 'Thiết bị y tế', link: 'https://thietbiytegroup.com/thiet-bi-y-te/' },
  { name: 'Tin nội bộ', link: 'https://thietbiytegroup.com/tin-noi-bo/' },
  { name: 'Tin tức', link: 'https://thietbiytegroup.com/tin-tuc/' },
  { name: 'Tin y tế', link: 'https://thietbiytegroup.com/tin-y-te/' },
  { name: 'Video hướng dẫn sử dụng máy', link: 'https://thietbiytegroup.com/video-huong-dan-su-dung-may/' },
  { name: 'Video giới thiệu', link: 'https://thietbiytegroup.com/gioi-thieu-tri-duc/' },
];

export const SIDEBAR_WEBSITE_LINKS = [
  { name: 'Thiết bị y tế tiêu hao', link: 'https://thietbiytegroup.com' },
  { name: 'Thiết bị y tế trí việt phát', link: 'https://thietbiytegroup.com' },
  { name: 'Thiết bị y tế trí đức', link: 'https://thietbiytegroup.com' },
  { name: 'Hóa chất xét nghiệm y tế', link: 'https://thietbiytegroup.com/hoa-chat-thuoc-thu-xet-nghiem/' },
  { name: 'Máy xét nghiệm y tế', link: 'https://thietbiytegroup.com/san-pham/' },
];
