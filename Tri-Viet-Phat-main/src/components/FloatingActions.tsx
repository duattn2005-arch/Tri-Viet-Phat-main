import React, { useState, useEffect, useRef } from 'react';
import { COMPANY_INFO } from '../data/mockData';

interface FloatingActionsProps {
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  onNavigateContact?: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onToggleAiChat,
  isAiChatOpen,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-3.5 right-3 sm:bottom-5 sm:right-6 z-50 flex flex-col items-end gap-2 sm:gap-2.5"
    >
      {/* Scroll to top button (3D Tactile) */}
      {showScrollTop && (
        <div className="relative group">
          <span className="hidden sm:block absolute right-12 top-1/2 -translate-y-1/2 bg-[#0f172a]/90 backdrop-blur-xs text-white text-[11.5px] font-semibold py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Lên đầu trang
          </span>
          <button
            onClick={scrollToTop}
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full btn-3d-red text-white flex items-center justify-center border border-white/40 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[20px] font-bold">
              keyboard_arrow_up
            </span>
          </button>
        </div>
      )}

      {/* AI Assistant Button (3D Medical Cyan/Blue) */}
      <div className="relative group">
        <span className="hidden sm:block absolute right-14 top-1/2 -translate-y-1/2 bg-[#0f172a]/90 backdrop-blur-xs text-white text-[11.5px] font-semibold py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Trợ lý AI Trí Việt Phát
        </span>
        <button
          type="button"
          onClick={onToggleAiChat}
          aria-label="Mở Trợ lý AI Trí Việt Phát"
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white flex items-center justify-center border-2 border-white cursor-pointer transition-all shadow-md ${
            isAiChatOpen
              ? 'bg-[#0f172a] shadow-[0_4px_12px_rgba(15,23,42,0.4)]'
              : 'btn-3d-blue'
          }`}
        >
          {isAiChatOpen ? (
            <span className="material-symbols-outlined text-[17px] sm:text-[19px]">close</span>
          ) : (
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">smart_toy</span>
          )}
        </button>
      </div>

      {/* POPUP MENU EXPANDED FROM THE MERGED BUTTON (3D Glassmorphism) */}
      {isOpen && (
        <div className="w-[calc(100vw-28px)] max-w-[325px] sm:w-[325px] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.22),0_4px_10px_rgba(0,0,0,0.06)] border border-white/80 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 mb-1">
          {/* Header */}
          <div className="bg-linear-to-r from-[#003865] via-[#004e89] to-[#0284c7] text-white px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px] sm:text-[16px]">support_agent</span>
              </div>
              <span className="font-bold text-[13px] sm:text-[13.5px]">Hỗ Trợ & Tư Vấn 24/7</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          </div>

          {/* 3 Channels: Messenger, Hotline, Zalo */}
          <div className="p-2.5 sm:p-3 space-y-2 sm:space-y-2.5">
            {/* 1. Facebook Messenger (3D Card) */}
            <a
              href="https://www.facebook.com/thietbiytevip"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-linear-to-r from-[#f0f7ff] to-[#e6f2ff] hover:from-[#e0f0fe] hover:to-[#d0e7fd] border border-[#bae0fd] transition-all group cursor-pointer shadow-[0_2px_6px_rgba(0,132,255,0.08)] hover:shadow-[0_4px_12px_rgba(0,132,255,0.18)]"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-b from-[#1877f2] to-[#0b5cd5] text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(24,119,242,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.912 1.453 5.518 3.727 7.215V22l3.39-1.86c.928.257 1.91.396 2.924.396 5.523 0 10-4.145 10-9.259C22.041 6.145 17.523 2 12 2zm1.068 12.438l-2.613-2.79-5.1 2.79 5.61-5.955 2.678 2.79 5.035-2.79-5.61 5.955z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] sm:text-[13px] font-bold text-[#0f172a] group-hover:text-[#0084ff] transition-colors">
                  Facebook Messenger
                </div>
                <div className="text-[11px] sm:text-[11.5px] text-[#0284c7]">
                  Chat trực tiếp với chuyên viên
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] sm:text-[17px] text-[#94a3b8] group-hover:text-[#0084ff] group-hover:translate-x-0.5 transition-all">
                chevron_right
              </span>
            </a>

            {/* 2. Zalo Chat (3D Card) */}
            <a
              href="https://zalo.me/0904698699"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-linear-to-r from-[#f0f6ff] to-[#e4efff] hover:from-[#e2efff] hover:to-[#d6e7ff] border border-[#bfdbfe] transition-all group cursor-pointer shadow-[0_2px_6px_rgba(0,104,255,0.08)] hover:shadow-[0_4px_12px_rgba(0,104,255,0.18)]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-b from-[#0068ff] to-[#004ecc] text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(0,104,255,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform">
                <span className="font-black text-[11px] sm:text-[12px] tracking-tight font-sans">
                  Zalo
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] sm:text-[13px] font-bold text-[#0f172a] group-hover:text-[#0068ff] transition-colors">
                  Zalo Kỹ Thuật & Báo Giá
                </div>
                <div className="text-[11px] sm:text-[11.5px] text-[#0068ff] font-semibold">
                  0904.698.699
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] sm:text-[17px] text-[#94a3b8] group-hover:text-[#0068ff] group-hover:translate-x-0.5 transition-all">
                chevron_right
              </span>
            </a>

            {/* 3. Hotline (Gọi ngay) */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-linear-to-r from-[#fff7ed] to-[#fff1f2] border border-[#fed7aa] space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-linear-to-b from-[#ea580c] to-[#c2410c] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[14px] sm:text-[16px]">call</span>
                </div>
                <div>
                  <div className="text-[12px] sm:text-[12.5px] font-bold text-[#0f172a]">
                    Hotline Tư Vấn Trực Tiếp
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <a
                  href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
                  className="flex flex-col items-center justify-center py-1 px-1.5 rounded-lg bg-white hover:bg-[#fff7ed] border border-[#fdba74] text-[#c2410c] font-bold text-[11.5px] sm:text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:translate-y-0.5 transition-all"
                >
                  <span className="text-[9px] text-[#78350f] font-medium">Hotline 1</span>
                  <span className="truncate">{COMPANY_INFO.hotline}</span>
                </a>
                <a
                  href={`tel:${COMPANY_INFO.hotline2.replace(/\./g, '')}`}
                  className="flex flex-col items-center justify-center py-1 px-1.5 rounded-lg bg-white hover:bg-[#fff7ed] border border-[#fdba74] text-[#c2410c] font-bold text-[11.5px] sm:text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:translate-y-0.5 transition-all"
                >
                  <span className="text-[9px] text-[#78350f] font-medium">Hotline 2</span>
                  <span className="truncate">{COMPANY_INFO.hotline2}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THE COMBINED 3D FLOATING BUTTON */}
      <div className="relative group">
        <span className="hidden sm:flex absolute right-16 top-1/2 -translate-y-1/2 bg-[#0f172a]/90 backdrop-blur-xs text-white text-[11.5px] font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity items-center gap-1.5">
          <span>Liên hệ tư vấn (Hotline, Zalo, Messenger)</span>
        </span>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Liên hệ hỗ trợ nhanh"
          className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full text-white flex items-center justify-center cursor-pointer transition-all border-2 border-white ${
            isOpen
              ? 'bg-[#0f172a] shadow-[0_6px_20px_rgba(15,23,42,0.4)]'
              : 'bg-linear-to-b from-[#0284c7] via-[#0068ff] to-[#004bb5] shadow-[0_6px_20px_rgba(0,104,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95'
          }`}
        >
          {/* Subtle pulsating ring when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-[#0084ff] opacity-40 animate-ping pointer-events-none"></span>
          )}

          {isOpen ? (
            <span className="material-symbols-outlined text-[19px] sm:text-[22px]">close</span>
          ) : (
            <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
              support_agent
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
