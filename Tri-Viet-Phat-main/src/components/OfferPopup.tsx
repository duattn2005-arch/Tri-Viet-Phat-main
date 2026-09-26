import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { COMPANY_INFO } from '../data/mockData';

interface OfferPopupProps {
  /** Another dialog is on screen, so the offer waits instead of stacking on top of it. */
  blocked: boolean;
  onAccept: () => void;
}

const SEEN_KEY = 'tvp-offer-seen';

const hasSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* storage unavailable: the offer may show again next visit, which is fine */
  }
};

const PERKS = [
  { icon: 'bolt', text: 'Báo giá và cấu hình kỹ thuật trong 15 phút làm việc' },
  { icon: 'engineering', text: 'Kỹ sư tư vấn miễn phí, lắp đặt và chuyển giao tận nơi' },
  { icon: 'inventory_2', text: 'Ưu đãi riêng khi mua số lượng lớn hoặc hồ sơ dự thầu' },
];

/**
 * One-per-session offer: shown when a desktop visitor moves to leave the page,
 * or on phones after they have browsed for a while and scrolled well down.
 */
export const OfferPopup: React.FC<OfferPopupProps> = ({ blocked, onAccept }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (blocked || open || hasSeen()) return;

    const show = () => {
      if (hasSeen()) return;
      markSeen();
      setOpen(true);
    };

    // Desktop: pointer leaves through the top edge (towards the tab bar / close button)
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    };

    // Touch: 40s on the site and past half of the page
    const startedAt = performance.now();
    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth > 0.5 && performance.now() - startedAt > 40000) show();
    };

    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) window.addEventListener('scroll', onScroll, { passive: true });
    else document.addEventListener('mouseout', onLeave);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onLeave);
    };
  }, [blocked, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-title"
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="fx-gradient-flow fx-sweep relative overflow-hidden px-6 pt-7 pb-6 text-center text-white">
              <motion.span
                className="relative z-10 inline-flex w-14 h-14 items-center justify-center rounded-full bg-white/15"
                animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
                transition={{ duration: 1.2, delay: 0.4, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <span className="material-symbols-outlined text-[30px] text-[#ffd166]">redeem</span>
              </motion.span>
              <p className="relative z-10 mt-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/75">
                Khoan đã!
              </p>
              <h2 id="offer-title" className="relative z-10 mt-1 text-[22px] font-bold leading-tight">
                Nhận báo giá miễn phí
                <br />
                cho phòng xét nghiệm của bạn
              </h2>
            </div>

            <ul className="fx-stagger space-y-3 px-6 pt-5">
              {PERKS.map((perk) => (
                <li key={perk.icon} className="flex items-start gap-3 text-[14px] text-[#0a2540]">
                  <span className="material-symbols-outlined shrink-0 text-[20px] text-[#e11d2a]">{perk.icon}</span>
                  <span>{perk.text}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5 px-6 pt-5 pb-6">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onAccept();
                }}
                className="fx-cta relative overflow-hidden w-full h-12 rounded-full bg-linear-to-r from-[#e11d2a] to-[#b3141f] text-white text-[14px] font-bold uppercase tracking-wide inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">request_quote</span>
                Nhận báo giá ngay
              </button>
              <a
                href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
                className="w-full h-11 rounded-full border-2 border-[#0a2540] text-[#0a2540] text-[14px] font-bold inline-flex items-center justify-center gap-2 hover:bg-[#0a2540] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] phone-shake">call</span>
                Gọi {COMPANY_INFO.hotline}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
