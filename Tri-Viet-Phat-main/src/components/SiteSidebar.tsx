import React from 'react';
import {
  REAL_NEWS_ARTICLES,
  SIDEBAR_CATEGORIES,
  SIDEBAR_WEBSITE_LINKS,
  SiteArticle,
} from '../data/realSiteContent';

interface SiteSidebarProps {
  onSelectArticle?: (article: SiteArticle) => void;
  onNavigateCategory?: (categoryName: string) => void;
  className?: string;
  hideCategories?: boolean;
}

const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';

export const SiteSidebar: React.FC<SiteSidebarProps> = ({
  onSelectArticle,
  onNavigateCategory,
  className = '',
  hideCategories = false,
}) => {
  const latestArticles = REAL_NEWS_ARTICLES.slice(0, 5);

  return (
    <aside className={`w-full space-y-6 ${className}`}>
      {/* Widget 1: Hỗ trợ mua hàng */}
      <div className="fx-panel overflow-hidden ">
        <h3 className="px-4 py-3 border-b border-[#e5e5e5] text-[16px] font-bold text-[#111111]">Hỗ trợ mua hàng</h3>
        <div className="p-4 space-y-3.5">
          <div className="space-y-2 text-[13px]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#777777] text-[19px]">
                call
              </span>
              <span className="text-[#777777]">Hotline 1:</span>
              <a
                href="tel:0904698699"
                className="font-bold text-[#111111] fx-link"
              >
                0904.698.699
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#777777] text-[19px]">
                phone_in_talk
              </span>
              <span className="text-[#777777]">Hotline 2:</span>
              <a
                href="tel:0392123688"
                className="font-bold text-[#111111] fx-link"
              >
                0392.123.688
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#111111] text-[19px]">
                mail
              </span>
              <span className="text-[#777777]">Email:</span>
              <a
                href="mailto:infothietbiyte168@gmail.com"
                className="text-[#111111] font-medium fx-link text-[12px] truncate"
              >
                infothietbiyte168@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Widget 2: Các bài viết mới nhất */}
      <div className="fx-panel overflow-hidden ">
        <h3 className="px-4 py-3 border-b border-[#e5e5e5] text-[16px] font-bold text-[#111111]">Các bài viết mới nhất</h3>
        <div className="p-3.5 space-y-3.5">
          {latestArticles.map((art) => (
            <article
              key={art.id}
              className="flex gap-3 group cursor-pointer border-b border-[#f2f2f2] pb-3 last:border-b-0 last:pb-0"
              onClick={() => onSelectArticle && onSelectArticle(art)}
            >
              <div className="w-[80px] h-[58px] shrink-0  overflow-hidden border border-[#e5e5e5] bg-[#f3f7fb]">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_THUMB;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <h4 className="text-[12.5px] font-bold text-[#111111] group-hover:text-[#000000] transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-[#999999] mt-1">
                  <span className="material-symbols-outlined text-[13px] text-[#777777]">
                    calendar_today
                  </span>
                  <span>{art.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Widget 3: Danh mục */}
      {!hideCategories && (
        <div className="fx-panel overflow-hidden ">
          <h3 className="px-4 py-3 border-b border-[#e5e5e5] text-[16px] font-bold text-[#111111]">Danh mục</h3>
          <ul className="p-2.5 divide-y divide-[#f2f2f2] text-[13px]">
            {SIDEBAR_CATEGORIES.map((cat, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onNavigateCategory && onNavigateCategory(cat.name)}
                  className="w-full py-1.5 px-2 text-left flex items-center justify-between text-[#333333] hover:text-[#000000] hover:bg-[#f3f7fb]  transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#d4d4d4] group-hover:text-[#000000] text-[10px] transition-colors">
                      ▸
                    </span>
                    <span className="line-clamp-1">{cat.name}</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-[#999999] group-hover:translate-x-0.5 transition-transform shrink-0">
                    chevron_right
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Widget 4: Liên kết website */}
      <div className="fx-panel overflow-hidden ">
        <h3 className="px-4 py-3 border-b border-[#e5e5e5] text-[16px] font-bold text-[#111111]">Liên kết website</h3>
        <div className="p-3.5">
          <div className="flex flex-wrap gap-2 text-[12.5px] text-[#555555]">
            {SIDEBAR_WEBSITE_LINKS.map((link, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#d4d4d4]">|</span>}
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fx-link transition-colors"
                >
                  {link.name}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
