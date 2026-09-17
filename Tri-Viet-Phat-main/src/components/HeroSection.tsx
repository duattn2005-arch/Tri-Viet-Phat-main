import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { COMPANY_INFO } from '../data/mockData';
import { ContactPillButtons } from './ContactPillButtons';

interface HeroSectionProps {
  onOpenConsultation: (prefilledProduct?: string) => void;
}

const HERO_SLIDES = [
  {
    image: COMPANY_INFO.heroImage,
    title: 'Phòng Xét Nghiệm Công Nghệ Cao Trí Việt Phát',
    subTitle: 'Đạt chuẩn ISO 13485 & CE IVD Quốc Tế',
    tag: 'Tiêu chuẩn quốc tế',
    badgeIcon: 'verified_user',
  },
  {
    image: COMPANY_INFO.aboutImage,
    title: 'Đội Ngũ Kỹ Sư Y Sinh Chuyên Môn Cao',
    subTitle: 'Đào tạo chính hãng từ nước ngoài, hỗ trợ kỹ thuật 24/7',
    tag: 'Chuyển giao công nghệ',
    badgeIcon: 'engineering',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKxO6Rz5N9Z0m_Gj0PzZ_gY7Qp8HwS5tWw4N3P1yO7Z4Kx7S9vF_gQ5K3jT7qR_xY4oZ1W_qH6vA0c4mB8dG2xS9vL3aY5kU8c_d4wR_l9yX1eP3zM4vL5nQ6aB1m_Vw9tC2eE3gG4hI5jK6lM7oP8qR',
    title: 'Hệ Thống Phân Tích Huyết Học & Sinh Hóa Tự Động',
    subTitle: 'Tốc độ cao, vận hành bền bỉ, kết quả chính xác tuyệt đối',
    tag: 'Thiết bị chính hãng',
    badgeIcon: 'biotech',
  },
];

const METRICS = [
  {
    icon: 'workspace_premium',
    value: COMPANY_INFO.yearsOfExperience,
    label: 'Năm kinh nghiệm y tế',
    iconColor: 'text-[#006194]',
    from: 'from-white',
    to: 'to-[#f0f7fc]',
    border: 'border-[#bae6fd]/70',
  },
  {
    icon: 'verified',
    value: COMPANY_INFO.genuineReagents,
    label: 'Hóa chất chính hãng',
    iconColor: 'text-[#15803d]',
    from: 'from-white',
    to: 'to-[#f0fdf4]',
    border: 'border-[#bbf7d0]/70',
  },
  {
    icon: 'public',
    value: COMPANY_INFO.provincesCovered,
    label: 'Tỉnh thành phục vụ',
    iconColor: 'text-[#bb0112]',
    from: 'from-white',
    to: 'to-[#fef2f2]',
    border: 'border-[#fecaca]/70',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentHeroSlide = HERO_SLIDES[activeSlide] || HERO_SLIDES[0];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };
  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-hero-3d-scene border-b border-[#e2e8f0]"
    >
      {/* Subtle 3D background grid & ambient optical glow */}
      <div className="absolute inset-0 bg-medical-grid-3d opacity-30 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#006194]/10 blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#bb0112]/5 blur-3xl pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 w-full py-6 sm:py-8 lg:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Heading, Trust Badges, Slogan & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-3 sm:space-y-4">
            {/* Trust Badge Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#075985] text-[12px] font-bold tracking-wide shadow-xs border border-[#bae6fd]"
            >
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping"></span>
              <span className="material-symbols-outlined text-[16px] text-[#006194]">verified</span>
              <span>Đại diện phân phối chính thức tại Việt Nam</span>
            </motion.div>

            {/* Company Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[26px] sm:text-[34px] lg:text-[38px] xl:text-[42px] font-black text-[#006194] tracking-tight leading-tight uppercase font-sans drop-shadow-xs"
            >
              <span className="inline-block">
                <span className="whitespace-nowrap">CÔNG TY TNHH</span>{' '}
                <span className="whitespace-nowrap">THIẾT BỊ Y TẾ</span>
              </span>{' '}
              <br className="hidden sm:inline" />
              <span className="inline-block whitespace-nowrap text-[#0f172a]">TRÍ VIỆT PHÁT</span>
            </motion.h1>

            {/* Slogan with 3D Left Accent Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative pl-4 py-1"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full bg-gradient-to-b from-[#e11d48] to-[#bb0112] shadow-sm"></div>
              <p className="text-[17px] sm:text-[20px] text-[#bb0112] font-bold italic [text-wrap:balance]">
                {COMPANY_INFO.slogan}
              </p>
            </motion.div>

            {/* Executive Summary */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-[14px] sm:text-[15.5px] text-[#334155] max-w-3xl leading-relaxed"
            >
              {COMPANY_INFO.summary}
            </motion.p>

            {/* Contact Pill Action Buttons (Hotline, Zalo, Báo giá) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-full"
            >
              <ContactPillButtons onOpenConsultation={() => onOpenConsultation()} className="pt-1" />
            </motion.div>

            {/* Metric Badges - continuous float animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="pt-2 grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-xl"
            >
              {METRICS.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
                  className={`card-3d-subtle p-3 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left bg-linear-to-b ${metric.from} ${metric.to} border ${metric.border} shadow-xs`}
                >
                  <div className={`flex items-center gap-1.5 mb-0.5 ${metric.iconColor}`}>
                    <span className="material-symbols-outlined text-[20px]">{metric.icon}</span>
                    <span className="text-[20px] sm:text-[24px] font-black">{metric.value}</span>
                  </div>
                  <span className="text-[11.5px] font-bold text-[#334155] leading-tight">
                    {metric.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: 3D Interactive Hero Visual Showcase (with scroll parallax) */}
          <motion.div
            className="lg:col-span-5 relative mt-4 lg:mt-0"
            style={{ y: parallaxY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative w-full rounded-3xl overflow-hidden card-3d p-2.5 bg-white border border-[#cbd5e1]/80 shadow-[0_20px_50px_rgba(0,97,148,0.18)]">
              <div className="relative w-full h-64 sm:h-72 lg:h-[350px] xl:h-[380px] rounded-2xl overflow-hidden group">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  alt={currentHeroSlide.title}
                  src={currentHeroSlide.image}
                />

                {/* Slider Prev / Next Overlay Buttons */}
                <button
                  onClick={handlePrevSlide}
                  aria-label="Slide trước"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#0f172a] flex items-center justify-center backdrop-blur-xs shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                  onClick={handleNextSlide}
                  aria-label="Slide tiếp theo"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#0f172a] flex items-center justify-center backdrop-blur-xs shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Slide indicator dots */}
            <div className="flex justify-center items-center gap-2 mt-3">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'w-6 bg-[#bb0112]' : 'w-2 bg-[#cbd5e1] hover:bg-[#94a3b8]'
                  }`}
                ></button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
