import React from 'react';
import { Article } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onOpenConsultation,
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#e2e8f0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-[#e2e8f0] text-[#475569] flex items-center justify-center transition-colors z-10 shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Hero image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={article.image}
            alt={article.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-3 text-[12px] text-[#93ccff]">
              <span className="px-2.5 py-0.5 rounded bg-[#006194]/80 backdrop-blur text-white font-semibold">
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                <span>{article.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>{article.readTime}</span>
              </span>
            </div>
            <h1 className="text-[22px] sm:text-[26px] font-bold leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key points box */}
          {article.keyPoints && article.keyPoints.length > 0 && (
            <div className="p-4 rounded-xl bg-[#e0f2fe]/60 border border-[#cce5ff] space-y-2">
              <h4 className="text-[14px] font-bold text-[#006194] uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Điểm cốt lõi bài viết</span>
              </h4>
              <ul className="space-y-1.5 text-[13.5px] text-[#0f172a]">
                {article.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#006194] text-[16px] shrink-0 mt-0.5">
                      check
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Paragraphs */}
          <div className="space-y-4 text-[15px] text-[#3f4850] leading-relaxed">
            {article.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Source and author banner */}
          <div className="pt-6 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f8fafc] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <img
                src={COMPANY_INFO.logoUrl}
                alt="Ban biên tập Trí Việt Phát"
                className="h-10 w-auto max-h-10 object-contain rounded-md bg-white border border-[#e2e8f0] p-0.5"
              />
              <div>
                <span className="text-[13px] font-bold text-[#0f172a] block">
                  Ban Cố Vấn Kỹ Thuật Y Sinh Trí Việt Phát
                </span>
                <span className="text-[12px] text-[#475569]">
                  Cập nhật định kỳ theo quy chuẩn Bộ Y Tế Việt Nam
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="px-4 py-2 rounded-xl bg-[#bb0112] hover:bg-[#b91c1c] text-white text-[13px] font-bold transition-colors shadow-sm"
            >
              Liên hệ chuyên gia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
