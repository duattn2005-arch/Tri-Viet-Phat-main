import React from 'react';
import { COMPANY_INFO } from '../data/mockData';

interface HeroSectionProps {
  onOpenConsultation: (prefilledProduct?: string) => void;
}

/** Full-bleed image banner with one message and one action (torano.vn-style). */
export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation }) => {
  const hotlineDigits = COMPANY_INFO.hotline.replace(/\./g, '');

  return (
    <section className="relative w-full h-[520px] sm:h-[560px] lg:h-[620px] overflow-hidden bg-[#111111]">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt="Phòng xét nghiệm sử dụng thiết bị do Trí Việt Phát cung cấp"
        src={COMPANY_INFO.heroImage}
      />
      {/* Left-weighted scrim keeps the text readable without darkening the whole photo */}
      <div className="absolute inset-0 bg-linear-to-r from-[#111111]/85 via-[#111111]/55 to-transparent" />

      <div className="relative h-full max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center">
        <div className="max-w-xl text-white">
          <p className="text-[13px] sm:text-[14px] font-medium uppercase tracking-[0.12em] text-white/80">
            Thiết bị xét nghiệm IVD chính hãng
          </p>
          <h1 className="mt-4 text-[32px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.1] tracking-tight [text-wrap:balance]">
            Giải pháp trọn gói cho phòng xét nghiệm
          </h1>
          <p className="mt-5 text-[15px] sm:text-[17px] text-white/85 leading-relaxed">
            Máy huyết học, sinh hóa, nước tiểu, điện giải và hóa chất chính hãng, kèm lắp đặt và bảo trì tận nơi cho
            bệnh viện, phòng khám toàn quốc.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenConsultation()}
              className="h-12 px-8 bg-white text-[#111111] text-[14px] font-semibold uppercase tracking-wide hover:bg-[#e5e5e5] transition-colors cursor-pointer"
            >
              Yêu cầu báo giá
            </button>
            <a href={`tel:${hotlineDigits}`} className="text-[15px] text-white/85 hover:text-white">
              Hotline <span className="font-semibold text-white">{COMPANY_INFO.hotline}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
