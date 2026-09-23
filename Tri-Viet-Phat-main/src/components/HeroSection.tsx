import React from 'react';
import { COMPANY_INFO } from '../data/mockData';

interface HeroSectionProps {
  onOpenConsultation: (prefilledProduct?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation }) => {
  const hotlineDigits = COMPANY_INFO.hotline.replace(/\./g, '');

  return (
    <section className="w-full bg-white border-b border-[#e2e8f0]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-10 sm:py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <p className="text-[13px] sm:text-[14px] font-semibold text-[#006194] mb-4">
              Nhà phân phối thiết bị xét nghiệm IVD chính hãng
            </p>

            <h1 className="text-[30px] sm:text-[40px] lg:text-[44px] font-bold text-[#0f172a] leading-[1.15] tracking-tight [text-wrap:balance]">
              Thiết bị và hóa chất xét nghiệm cho bệnh viện, phòng khám
            </h1>

            <p className="mt-5 text-[15px] sm:text-[16px] text-[#475569] leading-relaxed max-w-xl">
              {COMPANY_INFO.summary}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <button
                onClick={() => onOpenConsultation()}
                className="btn-primary h-12 px-6 rounded-md text-[15px] font-semibold cursor-pointer"
              >
                Yêu cầu báo giá
              </button>
              <a
                href={`tel:${hotlineDigits}`}
                className="text-[15px] text-[#475569] hover:text-[#006194] transition-colors"
              >
                Hoặc gọi <span className="font-semibold text-[#0f172a]">{COMPANY_INFO.hotline}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              className="w-full aspect-[4/3] object-cover rounded-lg bg-[#f1f5f9]"
              alt="Phòng xét nghiệm sử dụng thiết bị do Trí Việt Phát cung cấp"
              src={COMPANY_INFO.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
