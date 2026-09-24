import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { COMPANY_INFO } from '../data/mockData';

interface FloatingActionsProps {
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  onNavigateContact?: () => void;
}

const CHANNELS = [
  {
    key: 'call',
    href: `tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`,
    label: `Gọi ${COMPANY_INFO.hotline}`,
    className: 'bg-linear-to-br from-[#e11d2a] to-[#b3141f]',
    external: false,
  },
  {
    key: 'zalo',
    href: COMPANY_INFO.zaloUrl,
    label: 'Chat Zalo',
    className: 'bg-[#0068ff]',
    external: true,
  },
  {
    key: 'messenger',
    href: COMPANY_INFO.facebookUrl,
    label: 'Nhắn tin Messenger',
    className: 'bg-[#1877f2]',
    external: true,
  },
] as const;

const ChannelIcon: React.FC<{ kind: (typeof CHANNELS)[number]['key'] }> = ({ kind }) => {
  if (kind === 'call') return <span className="material-symbols-outlined text-[22px]">call</span>;
  if (kind === 'zalo') return <span className="text-[13px] font-bold">Zalo</span>;
  return (
    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.912 1.453 5.518 3.727 7.215V22l3.39-1.86c.928.257 1.91.396 2.924.396 5.523 0 10-4.145 10-9.259C22.041 6.145 17.523 2 12 2zm1.068 12.438l-2.613-2.79-5.1 2.79 5.61-5.955 2.678 2.79 5.035-2.79-5.61 5.955z" />
    </svg>
  );
};

const LABEL_CLASS =
  'pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#0a2540] px-3 py-1.5 text-[12.5px] font-semibold text-white';

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onToggleAiChat, isAiChatOpen }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the contact menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      <button
        type="button"
        onClick={onToggleAiChat}
        aria-label={isAiChatOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI Trí Việt Phát'}
        className="group relative w-12 h-12 rounded-full bg-linear-to-br from-[#0a94dc] to-[#0a2540] text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(10,148,220,0.8)] hover:scale-110 transition-transform duration-300 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[22px]">{isAiChatOpen ? 'close' : 'smart_toy'}</span>
        <span
          className={`${LABEL_CLASS} hidden sm:block opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}
        >
          Trợ lý AI
        </span>
      </button>

      {/* One contact button that fans out into call / Zalo / Messenger */}
      <div className="relative">
        <AnimatePresence>
          {open && (
            <motion.ul
              id="contact-menu"
              className="absolute bottom-full right-1 mb-3 flex flex-col-reverse items-end gap-3"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.06 } },
                closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              }}
            >
              {CHANNELS.map((ch) => (
                <motion.li
                  key={ch.key}
                  variants={{
                    open: { opacity: 1, y: 0, scale: 1 },
                    closed: { opacity: 0, y: 16, scale: 0.6 },
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                >
                  <a
                    href={ch.href}
                    target={ch.external ? '_blank' : undefined}
                    rel={ch.external ? 'noopener noreferrer' : undefined}
                    onClick={() => setOpen(false)}
                    aria-label={ch.label}
                    className={`relative w-11 h-11 rounded-full text-white flex items-center justify-center shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)] hover:scale-110 transition-transform duration-300 ${ch.className}`}
                  >
                    <ChannelIcon kind={ch.key} />
                    <span className={LABEL_CLASS}>{ch.label}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Đóng liên hệ' : 'Liên hệ tư vấn'}
          aria-expanded={open}
          aria-controls="contact-menu"
          className="relative w-14 h-14 rounded-full bg-linear-to-br from-[#e11d2a] to-[#b3141f] text-white flex items-center justify-center shadow-[0_12px_28px_-8px_rgba(225,29,42,0.8)] hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          {!open && <span className="absolute inset-0 rounded-full bg-[#e11d2a]/40 animate-ping" aria-hidden="true" />}
          <motion.span
            key={open ? 'close' : 'chat'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className={`material-symbols-outlined relative text-[26px] ${open ? '' : 'phone-shake'}`}
          >
            {open ? 'close' : 'support_agent'}
          </motion.span>
        </button>
      </div>
    </div>
  );
};
