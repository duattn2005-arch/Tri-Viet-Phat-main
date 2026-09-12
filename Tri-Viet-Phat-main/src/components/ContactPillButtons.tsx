import React from 'react';
import { COMPANY_INFO } from '../data/mockData';

interface ContactPillButtonsProps {
  onOpenConsultation?: () => void;
  className?: string;
}

export const ContactPillButtons: React.FC<ContactPillButtonsProps> = ({
  onOpenConsultation,
  className = '',
}) => {
  const hotlineDigits = COMPANY_INFO.hotline.replace(/\./g, '').replace(/\s/g, '');
  const zaloLink = COMPANY_INFO.zaloUrl || `https://zalo.me/${hotlineDigits}`;

  const handleBaoGiaClick = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
    } else {
      const formEl = document.getElementById('tu-van-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={`flex flex-nowrap items-center gap-2 sm:gap-3 w-full max-w-full overflow-x-auto no-scrollbar py-1 ${className}`}>
      {/* 1. BUTTON HOTLINE (RED PILL) */}
      <a
        href={`tel:${hotlineDigits}`}
        aria-label={`Hotline ${COMPANY_INFO.hotline}`}
        className="group inline-flex items-center h-[48px] sm:h-[50px] px-3.5 sm:px-4.5 rounded-full bg-gradient-to-r from-[#e11d2a] via-[#e52d27] to-[#cc0f1c] hover:brightness-105 active:scale-98 transition-all duration-200 shadow-[0_6px_18px_-4px_rgba(225,29,42,0.4)] hover:shadow-[0_8px_22px_-3px_rgba(225,29,42,0.5)] cursor-pointer text-white select-none shrink-0 whitespace-nowrap"
      >
        {/* Left circular translucent icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0">
          <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-white">call</span>
        </div>

        {/* Vertical subtle divider */}
        <div className="h-5 w-[1.5px] bg-white/30 mx-2.5 shrink-0"></div>

        {/* Text right */}
        <div className="flex flex-col text-left leading-none justify-center pr-0.5">
          <span className="text-[10px] sm:text-[11px] font-medium text-white/95 tracking-wide mb-0.5">
            Hotline
          </span>
          <span className="text-[14.5px] sm:text-[16px] font-extrabold text-white tracking-wider font-sans">
            {COMPANY_INFO.hotline}
          </span>
        </div>

        {/* Chevron arrow */}
        <span className="material-symbols-outlined text-[18px] text-white/80 group-hover:translate-x-0.5 transition-transform ml-1 sm:ml-1.5">
          chevron_right
        </span>
      </a>

      {/* 2. BUTTON CHAT ZALO (BLUE PILL) */}
      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo cùng chuyên viên tư vấn"
        className="group inline-flex items-center h-[48px] sm:h-[50px] px-3.5 sm:px-4.5 rounded-full bg-gradient-to-r from-[#0068ff] to-[#0052d9] hover:brightness-105 active:scale-98 transition-all duration-200 shadow-[0_6px_18px_-4px_rgba(0,104,255,0.4)] hover:shadow-[0_8px_22px_-3px_rgba(0,104,255,0.5)] cursor-pointer text-white select-none shrink-0 whitespace-nowrap"
      >
        {/* Zalo official bubble speech mark */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg viewBox="0 0 36 36" className="w-8 h-8 drop-shadow-xs" fill="none">
            {/* Speech bubble */}
            <path
              d="M18 4.5C10.544 4.5 4.5 10.096 4.5 17C4.5 20.883 6.337 24.346 9.245 26.615L8.11 30.71C7.947 31.296 8.544 31.796 9.083 31.517L14.013 28.956C15.294 29.313 16.623 29.5 18 29.5C25.456 29.5 31.5 23.904 31.5 17C31.5 10.096 25.456 4.5 18 4.5Z"
              fill="white"
            />
            {/* Bold Z character */}
            <path
              d="M13.2 12.5H22.8C23.35 12.5 23.8 12.95 23.8 13.5C23.8 13.8 23.66 14.08 23.44 14.28L17 20.5H23C23.55 20.5 24 20.95 24 21.5C24 22.05 23.55 22.5 23 22.5H13C12.45 22.5 12 22.05 12 21.5C12 21.2 12.14 20.92 12.36 20.72L18.8 14.5H13.2C12.65 14.5 12.2 14.05 12.2 13.5C12.2 12.95 12.65 12.5 13.2 12.5Z"
              fill="#0068ff"
            />
          </svg>
        </div>

        {/* Vertical subtle divider */}
        <div className="h-5 w-[1.5px] bg-white/30 mx-2.5 shrink-0"></div>

        {/* Text right */}
        <span className="text-[14.5px] sm:text-[16px] font-bold text-white tracking-wide pr-0.5 font-sans">
          Chat Zalo
        </span>

        {/* Chevron arrow */}
        <span className="material-symbols-outlined text-[18px] text-white/80 group-hover:translate-x-0.5 transition-transform ml-1 sm:ml-1.5">
          chevron_right
        </span>
      </a>

      {/* 3. BUTTON BÁO GIÁ (WHITE PILL WITH BLUE BORDER) */}
      <button
        onClick={handleBaoGiaClick}
        aria-label="Yêu cầu báo giá thiết bị y tế"
        className="group inline-flex items-center h-[48px] sm:h-[50px] px-3.5 sm:px-4.5 rounded-full bg-white hover:bg-[#f0f7ff] active:scale-98 transition-all duration-200 border-2 border-[#0068ff] shadow-[0_5px_15px_-4px_rgba(0,104,255,0.2)] hover:shadow-[0_8px_20px_-3px_rgba(0,104,255,0.3)] cursor-pointer text-[#0068ff] select-none shrink-0 whitespace-nowrap"
      >
        {/* Document with folded corner and currency symbol */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-[#0068ff]"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M9 4C9 2.89543 9.89543 2 11 2H19.5L26 8.5V28C26 29.1046 25.1046 30 24 30H11C9.89543 30 9 29.1046 9 28V4Z"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.5 2V8.5H26"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="17.5"
              y="22.5"
              textAnchor="middle"
              fill="#0068ff"
              fontSize="12.5"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              $
            </text>
          </svg>
        </div>

        {/* Vertical subtle divider */}
        <div className="h-5 w-[1.5px] bg-[#dbeafe] mx-2.5 shrink-0"></div>

        {/* Text right */}
        <span className="text-[14.5px] sm:text-[16px] font-bold text-[#0068ff] tracking-wide pr-0.5 font-sans">
          Báo giá
        </span>

        {/* Chevron arrow */}
        <span className="material-symbols-outlined text-[18px] text-[#0068ff]/80 group-hover:translate-x-0.5 transition-transform ml-1 sm:ml-1.5">
          chevron_right
        </span>
      </button>
    </div>
  );
};
