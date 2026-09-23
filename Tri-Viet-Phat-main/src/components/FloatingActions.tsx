import React, { useState, useEffect, useRef } from 'react';
import { COMPANY_INFO } from '../data/mockData';

interface FloatingActionsProps {
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  onNavigateContact?: () => void;
}

const CHANNELS = [
  {
    href: COMPANY_INFO.zaloUrl,
    label: 'Zalo',
    detail: COMPANY_INFO.hotline,
    external: true,
  },
  {
    href: COMPANY_INFO.facebookUrl,
    label: 'Facebook Messenger',
    detail: 'Nhắn tin với chuyên viên',
    external: true,
  },
  {
    href: `tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`,
    label: 'Hotline 1',
    detail: COMPANY_INFO.hotline,
    external: false,
  },
  {
    href: `tel:${COMPANY_INFO.hotline2.replace(/\./g, '')}`,
    label: 'Hotline 2',
    detail: COMPANY_INFO.hotline2,
    external: false,
  },
];

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onToggleAiChat, isAiChatOpen }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const secondaryButton =
    'w-10 h-10 rounded-full bg-white border border-[#e2e8f0] text-[#475569] hover:text-[#006194] hover:border-[#cbd5e1] shadow-[0_2px_8px_rgba(15,23,42,0.08)] flex items-center justify-center cursor-pointer transition-colors';

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5"
    >
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Lên đầu trang"
          title="Lên đầu trang"
          className={secondaryButton}
        >
          <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
        </button>
      )}

      <button
        type="button"
        onClick={onToggleAiChat}
        aria-label={isAiChatOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI Trí Việt Phát'}
        title="Trợ lý AI"
        className={secondaryButton}
      >
        <span className="material-symbols-outlined text-[20px]">{isAiChatOpen ? 'close' : 'smart_toy'}</span>
      </button>

      {isOpen && (
        <div className="w-[calc(100vw-32px)] max-w-[300px] bg-white rounded-lg border border-[#e2e8f0] shadow-[0_12px_32px_rgba(15,23,42,0.14)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f1f5f9] text-[14px] font-semibold text-[#0f172a]">
            Liên hệ tư vấn
          </div>
          <ul className="py-1">
            {CHANNELS.map((ch) => (
              <li key={ch.label}>
                <a
                  href={ch.href}
                  target={ch.external ? '_blank' : undefined}
                  rel={ch.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[#f8fafc] transition-colors group"
                >
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium text-[#0f172a] group-hover:text-[#006194]">
                      {ch.label}
                    </span>
                    <span className="block text-[12.5px] text-[#64748b] truncate">{ch.detail}</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#cbd5e1] group-hover:text-[#006194]">
                    chevron_right
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Đóng liên hệ' : 'Liên hệ tư vấn'}
        aria-expanded={isOpen}
        title="Liên hệ tư vấn"
        className="w-12 h-12 rounded-full btn-primary shadow-[0_4px_14px_rgba(0,97,148,0.30)] flex items-center justify-center cursor-pointer"
      >
        <span className="material-symbols-outlined text-[24px]">{isOpen ? 'close' : 'call'}</span>
      </button>
    </div>
  );
};
