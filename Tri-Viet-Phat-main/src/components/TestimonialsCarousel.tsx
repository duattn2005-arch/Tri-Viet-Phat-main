import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  MessageSquareHeart,
} from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** 'production' (default) hides items flagged isPlaceholder; 'demo' shows everything for layout preview. */
  mode?: 'production' | 'demo';
  /** ms between auto-advance; 0 disables auto-rotate. Default 5500 (5-6s). */
  autoRotateMs?: number;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

// Cocoon-inspired palette, scoped to this section
const COLOR_PRIMARY = '#006194';
const COLOR_TEXT_DARK = '#0f172a';

const TABLET_BREAKPOINT_PX = 768;
const DESKTOP_BREAKPOINT_PX = 1024;

function useCardsPerView(): number {
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT_PX) setCardsPerView(3);
      else if (window.innerWidth >= TABLET_BREAKPOINT_PX) setCardsPerView(2);
      else setCardsPerView(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return cardsPerView;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5" aria-label={`Đánh giá ${rating}/5 sao`}>
    {Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        size={14}
        className={idx < rating ? 'fill-[#475569] text-[#475569]' : 'fill-[#e2e8f0] text-[#e2e8f0]'}
      />
    ))}
  </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial: t }) => (
  <div className="relative h-full flex flex-col p-6 rounded-lg bg-white border border-[#e2e8f0]">

    {/* Header: Avatar | Name/Role | KPI badge */}
    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 mb-4 relative z-10">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-[#f1f5f9]">
          {t.avatarUrl ? (
            <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-semibold text-[16px] text-[#475569]"
            >
              {t.avatarInitials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-[14.5px] font-bold truncate" style={{ color: COLOR_TEXT_DARK }}>
            {t.title ? `${t.title} ` : ''}{t.name}
          </div>
          <div className="text-[12px] text-[#94a3b8] truncate">{t.role}</div>
        </div>
      </div>

      {t.kpi && (
        <div className="shrink-0 inline-flex items-center gap-1 text-[#475569] text-[12px] font-medium whitespace-nowrap">
          {t.kpi.trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{t.kpi.label}</span>
        </div>
      )}
    </div>

    <StarRating rating={t.rating} />

    <p className="mt-3 font-sans text-[14.5px] text-[#334155] leading-relaxed flex-1">
      “{t.quote}”
    </p>

    <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex items-center justify-between gap-2 text-[11.5px] text-[#94a3b8]">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-1.5 truncate">
          <Building2 size={13} className="shrink-0" />
          <span className="truncate">{t.facility}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="shrink-0" />
          <span>{t.location}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <CalendarDays size={13} />
        <span>{t.datePosted}</span>
      </div>
    </div>
  </div>
);

const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="flex flex-col items-center text-center gap-3 py-10 px-6 rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] max-w-xl mx-auto">
    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm" style={{ color: COLOR_PRIMARY }}>
      <MessageSquareHeart size={26} />
    </div>
    <h3 className="text-[16px] font-bold" style={{ color: COLOR_TEXT_DARK }}>{title}</h3>
    <p className="text-[13.5px] text-[#475569] leading-relaxed">{message}</p>
  </div>
);

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  eyebrow,
  title = 'Khách hàng nói về Trí Việt Phát',
  subtitle = 'Chia sẻ từ các bệnh viện, trung tâm y tế và phòng khám đã sử dụng thiết bị và dịch vụ của chúng tôi.',
  mode = 'production',
  autoRotateMs = 5500,
  emptyStateTitle = 'Chờ đánh giá từ khách hàng...',
  emptyStateMessage = 'Chúng tôi đang thu thập những chia sẻ thực tế từ các bệnh viện và phòng khám đã sử dụng dịch vụ. Đánh giá đầu tiên sẽ sớm xuất hiện tại đây.',
}) => {
  const items = useMemo(
    () => (mode === 'production' ? testimonials.filter((t) => !t.isPlaceholder) : testimonials),
    [testimonials, mode]
  );

  const cardsPerView = useCardsPerView();
  const maxIndex = Math.max(0, items.length - cardsPerView);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!autoRotateMs || isPaused || items.length <= cardsPerView) return;
    const id = setInterval(goNext, autoRotateMs);
    return () => clearInterval(id);
  }, [autoRotateMs, isPaused, items.length, cardsPerView, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (delta > 50) goPrev();
    else if (delta < -50) goNext();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const showNav = items.length > cardsPerView;

  // A "waiting for reviews" box erodes trust with B2B buyers — show nothing
  // on the live site until real testimonials exist.
  if (items.length === 0 && mode === 'production') return null;

  return (
    <section className="w-full py-14 sm:py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        <div className="max-w-2xl mb-8 sm:mb-10">
          {eyebrow && <p className="text-[14px] font-semibold text-[#006194] mb-2">{eyebrow}</p>}
          <h2 className="text-[24px] sm:text-[30px] font-bold text-[#0f172a] tracking-tight leading-tight">{title}</h2>
          {subtitle && <p className="mt-3 text-[15px] text-[#475569] leading-relaxed">{subtitle}</p>}
        </div>

        {items.length === 0 ? (
          <EmptyState title={emptyStateTitle} message={emptyStateMessage} />
        ) : (
          <motion.div
            className="relative outline-none"
            tabIndex={0}
            role="region"
            aria-label="Đánh giá khách hàng"
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                className="flex"
                animate={{ x: `-${index * (100 / cardsPerView)}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {items.map((t) => (
                  <div
                    key={t.id}
                    className="shrink-0 min-w-0 px-3"
                    style={{ flexBasis: `${100 / cardsPerView}%` }}
                  >
                    <TestimonialCard testimonial={t} />
                  </div>
                ))}
              </motion.div>
            </div>

            {showNav && (
              <>
                <motion.button
                  type="button"
                  onClick={goPrev}
                  aria-label="Đánh giá trước"
                  className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white border border-[#e2e8f0] items-center justify-center cursor-pointer"
                  style={{ color: COLOR_PRIMARY }}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={goNext}
                  aria-label="Đánh giá tiếp theo"
                  className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white border border-[#e2e8f0] items-center justify-center cursor-pointer"
                  style={{ color: COLOR_PRIMARY }}
                >
                  <ChevronRight size={20} />
                </motion.button>

                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      onClick={() => setIndex(idx)}
                      aria-label={`Xem nhóm đánh giá ${idx + 1}`}
                      className="h-2 rounded-full cursor-pointer"
                      initial={false}
                      animate={{
                        width: index === idx ? 24 : 8,
                        backgroundColor: index === idx ? COLOR_PRIMARY : '#cbd5e1',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>

                {/* Mobile prev/next (arrows hidden sm+, shown here on mobile) */}
                <div className="flex sm:hidden items-center justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Đánh giá trước"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-center cursor-pointer"
                    style={{ color: COLOR_PRIMARY }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Đánh giá tiếp theo"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-center cursor-pointer"
                    style={{ color: COLOR_PRIMARY }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};
