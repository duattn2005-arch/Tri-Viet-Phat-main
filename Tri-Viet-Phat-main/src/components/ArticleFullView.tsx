import React from 'react';
import { SiteArticle } from '../data/realSiteContent';
import { SiteSidebar } from './SiteSidebar';

interface ArticleFullViewProps {
  article: SiteArticle;
  relatedArticles?: SiteArticle[];
  categoryTitle: string;
  onBack: () => void;
  onSelectArticle: (article: SiteArticle) => void;
}

export const ArticleFullView: React.FC<ArticleFullViewProps> = ({
  article,
  relatedArticles = [],
  categoryTitle,
  onBack,
  onSelectArticle,
}) => {
  return (
    <div className="w-full">
      {/* Return back button */}
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[#006194] hover:text-[#bb0112] hover:border-[#bb0112] text-[13.5px] font-bold shadow-xs transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Quay lại danh sách {categoryTitle.toLowerCase()}</span>
        </button>

        <span className="text-[12.5px] text-[#64748b] hidden sm:inline">
          Đăng ngày: <strong className="text-[#0f172a]">{article.date}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Article Content */}
        <article className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 md:p-10 shadow-xs">
          {/* Header */}
          <div className="border-b border-[#f1f5f9] pb-6 mb-6">
            <h1 className="text-[22px] sm:text-[28px] md:text-[32px] font-extrabold text-[#0f172a] leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#64748b]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#bb0112]">
                  calendar_today
                </span>
                <span>{article.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#006194]">
                  folder
                </span>
                <span>{categoryTitle}</span>
              </span>
              <span>•</span>
              <span className="text-[#059669] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Trí Việt Phát</span>
              </span>
            </div>
          </div>

          {/* Featured Image if present */}
          {article.image && (
            <div className="mb-8 rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f8fafc]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full max-h-[460px] object-cover mx-auto"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          )}

          {/* Article HTML Content */}
          <div
            className="article-rendered-body space-y-4 text-[#334155] text-[15px] sm:text-[16px] leading-relaxed [&>h2]:text-[20px] [&>h2]:font-bold [&>h2]:text-[#0f172a] [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-[17px] [&>h3]:font-bold [&>h3]:text-[#0f172a] [&>h3]:mt-5 [&>h3]:mb-2 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-1.5 [&>table]:w-full [&>table]:my-6 [&>table]:border-collapse [&_th]:border [&_th]:border-[#cbd5e1] [&_th]:p-2.5 [&_th]:bg-[#f1f5f9] [&_td]:border [&_td]:border-[#cbd5e1] [&_td]:p-2.5 [&_img]:rounded-lg [&_img]:mx-auto [&_img]:my-4 [&_a]:text-[#006194] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[#e2e8f0]">
              <h3 className="text-[18px] font-bold text-[#0f172a] uppercase mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bb0112]" />
                <span>Bài viết liên quan</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedArticles.slice(0, 3).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectArticle(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group p-3 rounded-xl border border-[#e2e8f0] hover:border-[#006194] transition-all cursor-pointer bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-32 rounded-lg overflow-hidden mb-2.5 bg-[#f8fafc]">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                      <h4 className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#006194] line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#94a3b8] mt-2 block">
                      {rel.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share & Contact Bar */}
          <div className="mt-8 pt-5 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f8fafc] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 md:-mx-10 md:-mb-10 p-6 rounded-b-2xl">
            <div className="flex items-center gap-2 text-[13.5px] text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Cần tư vấn thiết bị?</span>
              <span>Liên hệ hotline:</span>
              <a
                href="tel:0904698699"
                className="text-[#bb0112] font-bold hover:underline text-[15px]"
              >
                0904.698.699
              </a>
            </div>

            <button
              onClick={onBack}
              className="px-5 py-2 rounded-xl bg-[#006194] text-white hover:bg-[#0369a1] text-[13px] font-bold transition-colors cursor-pointer"
            >
              Xem các bài viết khác
            </button>
          </div>
        </article>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <SiteSidebar onSelectArticle={onSelectArticle} className="sticky top-24" />
        </div>
      </div>
    </div>
  );
};
