import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { COMPANY_INFO } from '../data/mockData';

interface HeroSectionProps {
  onOpenConsultation: (prefilledProduct?: string) => void;
}

const SLIDES = [
  {
    image: '/images/hero-lab-analyzers.jpg',
    alt: 'Phòng xét nghiệm với dãy máy phân tích tự động',
    eyebrow: 'Thiết bị xét nghiệm IVD chính hãng',
    title: 'Giải pháp trọn gói cho phòng xét nghiệm',
    desc: 'Máy huyết học, sinh hóa, nước tiểu, điện giải và hóa chất chính hãng cho bệnh viện, phòng khám toàn quốc.',
  },
  {
    image: '/images/hero-pipette.jpg',
    alt: 'Kỹ thuật viên thao tác pipet với ống mẫu xét nghiệm',
    eyebrow: 'Hóa chất và vật tư',
    title: 'Hóa chất chuẩn, sẵn kho tại Hà Nội',
    desc: 'Hóa chất huyết học Dewei, thuốc thử sinh hóa và vật tư tiêu hao, giao nhanh cho phòng xét nghiệm trên toàn quốc.',
  },
  {
    image: '/images/hero-engineers.jpg',
    alt: 'Đội kỹ sư làm việc trong phòng thí nghiệm',
    eyebrow: 'Lắp đặt và bảo trì',
    title: 'Kỹ sư có mặt tận nơi trong 2–4 giờ',
    desc: 'Kỹ sư y sinh được hãng đào tạo: lắp đặt, chạy mẫu đối chứng, chuyển giao và bảo trì định kỳ tại cơ sở.',
  },
];

const SLIDE_MS = 7000;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline whose words rise out of a mask one after another. */
const RevealTitle: React.FC<{ text: string }> = ({ text }) => (
  <h1 className="mt-4 text-[34px] sm:text-[46px] lg:text-[56px] font-bold leading-[1.08] tracking-tight">
    {text.split(' ').map((word, i, words) => (
      <React.Fragment key={i}>
        <span className="inline-block overflow-hidden align-bottom pb-[0.08em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '-110%', transition: { duration: 0.35, ease: EASE } }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.06 }}
          >
            {word}
          </motion.span>
        </span>
        {/* Real space (not margin) so the heading reads correctly to screen readers and search engines */}
        {i < words.length - 1 && ' '}
      </React.Fragment>
    ))}
  </h1>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation }) => {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: as the hero scrolls away the photo drifts slower than the page and the copy lifts and fades.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const hotlineDigits = COMPANY_INFO.hotline.replace(/\./g, '');
  const slide = SLIDES[active];

  const go = useCallback((idx: number) => setActive((idx + SLIDES.length) % SLIDES.length), []);
  const touchX = useRef<number | null>(null);

  // Always auto-advances; the timer restarts whenever the slide changes (including manual clicks).
  useEffect(() => {
    const id = setTimeout(() => go(active + 1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, go]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[560px] sm:h-[600px] lg:h-[calc(100vh-168px)] lg:min-h-[600px] lg:max-h-[780px] overflow-hidden bg-[#0a2540]"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
      }}
      aria-roledescription="carousel"
      aria-label="Giới thiệu Trí Việt Phát"
    >
      {/* Images: all mounted so they are preloaded; the active one fades in and slowly zooms out */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        {SLIDES.map((s, i) => (
          <motion.img
            key={s.image}
            src={s.image}
            alt={i === active ? s.alt : ''}
            aria-hidden={i !== active}
            className="absolute inset-0 w-full h-full object-cover"
            initial={false}
            animate={{
              opacity: i === active ? 1 : 0,
              scale: i === active && !reduce ? 1 : 1.08,
            }}
            transition={{
              opacity: { duration: 1.2, ease: 'easeInOut' },
              scale: i === active ? { duration: SLIDE_MS / 1000 + 1.2, ease: 'linear' } : { duration: 1.2 },
            }}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/5" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/40 to-transparent" />

      <motion.div
        className="relative h-full max-w-[1320px] mx-auto px-4 sm:px-8 sm:pl-[max(2rem,calc(84px_-_max(0px,(100vw_-_1320px)/2)))] flex items-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-2xl text-white" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={active} exit={{ opacity: 0, transition: { duration: 0.35 } }}>
              <motion.p
                className="text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.18em] text-white/80"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {slide.eyebrow}
              </motion.p>
              <RevealTitle text={slide.title} />
              <motion.p
                className="mt-5 max-w-xl text-[15px] sm:text-[17px] text-white/85 leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
              >
                {slide.desc}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
          >
            <button
              onClick={() => onOpenConsultation()}
              className="group relative h-12 px-8 overflow-hidden bg-white text-[#111111] text-[14px] font-semibold uppercase tracking-wide cursor-pointer"
            >
              {/* Fill sweeps in from the left on hover */}
              <span className="absolute inset-0 bg-[#0a2540] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative group-hover:text-white transition-colors duration-500">Yêu cầu báo giá</span>
            </button>
            <a href={`tel:${hotlineDigits}`} className="group text-[15px] text-white/85 hover:text-white">
              Hotline{' '}
              <span className="font-semibold text-white bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] group-hover:bg-[length:100%_1px] transition-[background-size] duration-500">
                {COMPANY_INFO.hotline}
              </span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Side arrows (sm+); on phones the slide is changed by swiping. The copy's left padding
          grows only when the viewport is too narrow for the page margin to clear the left arrow. */}
      {[
        { dir: -1, icon: 'arrow_back', label: 'Ảnh trước', pos: 'left-3 lg:left-6' },
        { dir: 1, icon: 'arrow_forward', label: 'Ảnh tiếp theo', pos: 'right-3 lg:right-6' },
      ].map((b) => (
        <button
          key={b.icon}
          onClick={() => go(active + b.dir)}
          aria-label={b.label}
          className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 ${b.pos} z-10 w-12 h-12 rounded-full border border-white/40 bg-black/10 backdrop-blur-[2px] text-white items-center justify-center hover:bg-white hover:text-[#111111] hover:border-white transition-colors cursor-pointer`}
        >
          <span className="material-symbols-outlined text-[22px]">{b.icon}</span>
        </button>
      ))}
    </section>
  );
};
