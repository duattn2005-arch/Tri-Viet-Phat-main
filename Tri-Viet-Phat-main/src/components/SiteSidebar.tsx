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
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-xs">
        <div className="border-b-2 border-[#D7040F] bg-white">
          <span className="inline-block bg-[#D7040F] text-white text-[14px] font-bold uppercase px-4 py-2 rounded-tr-[16px] tracking-wide">
            Hỗ trợ mua hàng
          </span>
        </div>
        <div className="p-4 space-y-3.5">
          <div className="rounded-lg overflow-hidden border border-[#e2e8f0] bg-[#f8fafc]">
            <img
              src="https://thietbiytegroup.com/wp-content/uploads/2024/09/hotlinetvp.jpg"
              alt="Hỗ trợ mua hàng Trí Việt Phát"
              className="w-full h-auto object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_THUMB;
              }}
            />
          </div>
          <div className="space-y-2 pt-1 text-[13px]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#bb0112] text-[19px]">
                call
              </span>
              <span className="text-[#64748b]">Hotline 1:</span>
              <a
                href="tel:0904698699"
                className="font-bold text-[#bb0112] hover:underline"
              >
                0904.698.699
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#bb0112] text-[19px]">
                phone_in_talk
              </span>
              <span className="text-[#64748b]">Hotline 2:</span>
              <a
                href="tel:0392123688"
                className="font-bold text-[#bb0112] hover:underline"
              >
                0392.123.688
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#006194] text-[19px]">
                mail
              </span>
              <span className="text-[#64748b]">Email:</span>
              <a
                href="mailto:infothietbiyte168@gmail.com"
                className="text-[#006194] font-medium hover:underline text-[12px] truncate"
              >
                infothietbiyte168@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Widget 2: Các bài viết mới nhất */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-xs">
        <div className="border-b-2 border-[#D7040F] bg-white">
          <span className="inline-block bg-[#D7040F] text-white text-[14px] font-bold uppercase px-4 py-2 rounded-tr-[16px] tracking-wide">
            Các bài viết mới nhất
          </span>
        </div>
        <div className="p-3.5 space-y-3.5">
          {latestArticles.map((art) => (
            <article
              key={art.id}
              className="flex gap-3 group cursor-pointer border-b border-[#f1f5f9] pb-3 last:border-b-0 last:pb-0"
              onClick={() => onSelectArticle && onSelectArticle(art)}
            >
              <div className="w-[80px] h-[58px] shrink-0 rounded-lg overflow-hidden border border-[#e2e8f0] bg-[#f8fafc]">
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
                <h4 className="text-[12.5px] font-bold text-[#1e293b] group-hover:text-[#bb0112] transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-[#94a3b8] mt-1">
                  <span className="material-symbols-outlined text-[13px] text-[#bb0112]">
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
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-xs">
          <div className="border-b-2 border-[#D7040F] bg-white">
            <span className="inline-block bg-[#D7040F] text-white text-[14px] font-bold uppercase px-4 py-2 rounded-tr-[16px] tracking-wide">
              Danh mục
            </span>
          </div>
          <ul className="p-2.5 divide-y divide-[#f1f5f9] text-[13px]">
            {SIDEBAR_CATEGORIES.map((cat, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onNavigateCategory && onNavigateCategory(cat.name)}
                  className="w-full py-1.5 px-2 text-left flex items-center justify-between text-[#334155] hover:text-[#bb0112] hover:bg-[#f8fafc] rounded-md transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#cbd5e1] group-hover:text-[#bb0112] text-[10px] transition-colors">
                      ▸
                    </span>
                    <span className="line-clamp-1">{cat.name}</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-[#94a3b8] group-hover:translate-x-0.5 transition-transform shrink-0">
                    chevron_right
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Widget 4: Liên kết website */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-xs">
        <div className="border-b-2 border-[#D7040F] bg-white">
          <span className="inline-block bg-[#D7040F] text-white text-[14px] font-bold uppercase px-4 py-2 rounded-tr-[16px] tracking-wide">
            Liên kết website
          </span>
        </div>
        <div className="p-3.5">
          <div className="flex flex-wrap gap-2 text-[12.5px] text-[#475569]">
            {SIDEBAR_WEBSITE_LINKS.map((link, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#cbd5e1]">|</span>}
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#006194] transition-colors"
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
