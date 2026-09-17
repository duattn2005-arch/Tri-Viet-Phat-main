import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
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
  /** ms between auto-advance; 0 disables auto-rotate. Default 5000. */
  autoRotateMs?: number;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

const DESKTOP_BREAKPOINT_PX = 1024;

function useCardsPerView(): number {
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      setCardsPerView(window.innerWidth >= DESKTOP_BREAKPOINT_PX ? 3 : 1);
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
        size={15}
        className={idx < rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'fill-[#e2e8f0] text-[#e2e8f0]'}
      />
    ))}
  </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial: t }) => (
  <div className="group relative h-full flex flex-col p-6 rounded-2xl bg-gradient-to-br from-white via-white to-[#eef7ff] border border-[#dbeefe] shadow-[0_2px_10px_rgba(0,97,148,0.06)] hover:shadow-[0_16px_36px_rgba(0,97,148,0.16)] hover:-translate-y-1 hover:scale-[1.015] transition-all duration-300">
    <Quote size={38} className="absolute top-4 right-4 text-[#dbeefe] rotate-180" />

    {/* Header: Avatar | Name/Role | KPI badge */}
    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 mb-4 relative z-10">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-[60px] h-[60px] rounded-full shrink-0 overflow-hidden ring-2 ring-white shadow-md">
          {t.avatarUrl ? (
            <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#006194] to-[#003d66] text-white flex items-center justify-center font-bold text-[18px]">
              {t.avatarInitials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-[14.5px] font-bold text-[#0f172a] truncate">
            {t.title ? `${t.title} ` : ''}{t.name}
          </div>
          <div className="text-[12px] text-[#64748b] truncate">{t.role}</div>
        </div>
      </div>

      {t.kpi && (
        <div className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] text-[11px] font-bold whitespace-nowrap">
          {t.kpi.trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{t.kpi.label}</span>
        </div>
      )}
    </div>

    <StarRating rating={t.rating} />

    <p className="mt-3 text-[13.5px] text-[#334155] leading-relaxed italic flex-1 [text-wrap:balance] relative z-10">
      “{t.quote}”
    </p>

    <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex items-center justify-between gap-2 text-[11.5px] text-[#64748b]">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-1.5 truncate">
          <Building2 size={13} className="text-[#006194] shrink-0" />
          <span className="truncate">{t.facility}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-[#006194] shrink-0" />
          <span>{t.location}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 text-[#94a3b8]">
        <CalendarDays size={13} />
        <span>{t.datePosted}</span>
      </div>
    </div>
  </div>
);

const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="flex flex-col items-center text-center gap-3 py-10 px-6 rounded-2xl border-2 border-dashed border-[#bae6fd] bg-[#f0f9ff] max-w-xl mx-auto">
    <div className="w-14 h-14 rounded-full bg-white text-[#006194] flex items-center justify-center shadow-sm">
      <MessageSquareHeart size={26} />
    </div>
    <h3 className="text-[16px] font-bold text-[#0f172a]">{title}</h3>
    <p className="text-[13.5px] text-[#475569] leading-relaxed">{message}</p>
  </div>
);

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  eyebrow = 'Khách Hàng Tin Tưởng',
  title = 'KHÁCH HÀNG NÓI GÌ VỀ TRÍ VIỆT PHÁT',
  subtitle = 'Chia sẻ từ các bệnh viện, trung tâm y tế và phòng khám đã sử dụng thiết bị và dịch vụ của chúng tôi.',
  mode = 'production',
  autoRotateMs = 5000,
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

  const showNav = items.length > cardsPerView;

  return (
    <section className="w-full py-8 sm:py-10 bg-white border-b border-[#e2e8f0]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12">
        <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#006194] bg-[#e0f2fe] px-3 py-1 rounded-full mb-2">
            {eyebrow}
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight uppercase [text-wrap:balance]">
            {title}
          </h2>
          <div className="w-14 h-1 bg-[#bb0112] rounded-full mt-2"></div>
          <p className="text-[13.5px] text-[#475569] max-w-2xl mt-2 [text-wrap:balance]">
            {subtitle}
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyState title={emptyStateTitle} message={emptyStateMessage} />
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * (100 / cardsPerView)}%)` }}
              >
                {items.map((t) => (
                  <div
                    key={t.id}
                    className="shrink-0 min-w-0 px-2 sm:px-3"
                    style={{ flexBasis: `${100 / cardsPerView}%` }}
                  >
                    <TestimonialCard testimonial={t} />
                  </div>
                ))}
              </div>
            </div>

            {showNav && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Đánh giá trước"
                  className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white border border-[#e2e8f0] shadow-md items-center justify-center text-[#006194] hover:bg-[#f0f7ff] cursor-pointer transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Đánh giá tiếp theo"
                  className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white border border-[#e2e8f0] shadow-md items-center justify-center text-[#006194] hover:bg-[#f0f7ff] cursor-pointer transition-colors"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setIndex(idx)}
                      aria-label={`Xem nhóm đánh giá ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        index === idx ? 'w-6 bg-[#bb0112]' : 'w-2 bg-[#cbd5e1] hover:bg-[#94a3b8]'
                      }`}
                    />
                  ))}
                </div>

                {/* Mobile prev/next (arrows hidden sm+, shown here on mobile) */}
                <div className="flex sm:hidden items-center justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Đánh giá trước"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-center text-[#006194] cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Đánh giá tiếp theo"
                    className="w-9 h-9 rounded-full bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-center text-[#006194] cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
