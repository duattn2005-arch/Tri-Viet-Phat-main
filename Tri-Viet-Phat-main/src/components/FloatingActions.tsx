import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import { COMPANY_INFO } from '../data/mockData';

interface FloatingActionsProps {
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  onNavigateContact?: () => void;
}

/** Round floating button with a label that slides out on hover (desktop). */
const FabLink: React.FC<{
  href: string;
  label: string;
  className: string;
  external?: boolean;
  children: React.ReactNode;
}> = ({ href, label, className, external, children }) => (
  <a
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    aria-label={label}
    className={`group relative w-12 h-12 rounded-full text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)] hover:scale-110 transition-transform duration-300 ${className}`}
  >
    {children}
    <span className="pointer-events-none absolute right-full mr-3 hidden sm:block whitespace-nowrap rounded-full bg-[#0a2540] px-3 py-1.5 text-[12.5px] font-semibold text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
      {label}
    </span>
  </a>
);

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onToggleAiChat, isAiChatOpen }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
            className="relative w-11 h-11 rounded-full bg-white text-[#0a2540] shadow-[0_8px_20px_-8px_rgba(10,37,64,0.5)] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            {/* Ring fills as the page is read */}
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
              <motion.circle
                cx="20"
                cy="20"
                r="18.5"
                fill="none"
                stroke="#e11d2a"
                strokeWidth="2"
                style={{ pathLength: scrollYProgress }}
              />
            </svg>
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
          </motion.button>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onToggleAiChat}
        aria-label={isAiChatOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI Trí Việt Phát'}
        className="group relative w-12 h-12 rounded-full bg-linear-to-br from-[#0a94dc] to-[#0a2540] text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(10,148,220,0.8)] hover:scale-110 transition-transform duration-300 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[22px]">{isAiChatOpen ? 'close' : 'smart_toy'}</span>
        <span className="pointer-events-none absolute right-full mr-3 hidden sm:block whitespace-nowrap rounded-full bg-[#0a2540] px-3 py-1.5 text-[12.5px] font-semibold text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Trợ lý AI
        </span>
      </button>

      <FabLink href={COMPANY_INFO.facebookUrl} label="Nhắn tin Messenger" className="bg-[#1877f2]" external>
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.912 1.453 5.518 3.727 7.215V22l3.39-1.86c.928.257 1.91.396 2.924.396 5.523 0 10-4.145 10-9.259C22.041 6.145 17.523 2 12 2zm1.068 12.438l-2.613-2.79-5.1 2.79 5.61-5.955 2.678 2.79 5.035-2.79-5.61 5.955z" />
        </svg>
      </FabLink>

      <FabLink href={COMPANY_INFO.zaloUrl} label="Chat Zalo" className="bg-[#0068ff]" external>
        <span className="text-[13px] font-bold">Zalo</span>
      </FabLink>

      {/* Call: red, with a pulsing ring and a wiggling handset */}
      <FabLink
        href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
        label={`Gọi ${COMPANY_INFO.hotline}`}
        className="bg-linear-to-br from-[#e11d2a] to-[#b3141f] w-14 h-14"
      >
        <span className="absolute inset-0 rounded-full bg-[#e11d2a]/40 animate-ping" aria-hidden="true" />
        <span className="material-symbols-outlined relative text-[26px] phone-shake">call</span>
      </FabLink>
    </div>
  );
};
