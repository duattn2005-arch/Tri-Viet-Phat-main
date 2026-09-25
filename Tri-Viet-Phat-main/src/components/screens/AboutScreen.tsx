import React from 'react';
import { COMPANY_INFO, BUSINESS_AREAS } from '../../data/mockData';
import { ABOUT_PAGE, inlineMd } from '../../content/pages';
import { PageBanner } from '../PageBanner';

interface AboutScreenProps {
  onOpenConsultation: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onOpenConsultation }) => {
  return (
    <>
    <PageBanner
      title={ABOUT_PAGE.bannerTitle}
      subtitle={ABOUT_PAGE.bannerSubtitle}
      image={ABOUT_PAGE.bannerImage}
      breadcrumbs={[{ label: 'Trang chủ' }, { label: 'Giới thiệu' }]}
    />
    <div className="w-full fx-page-bg py-10 sm:py-14">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 xl:px-12 space-y-6">

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6  overflow-hidden card-3d p-2 bg-white">
            <img
              src={COMPANY_INFO.aboutImage}
              alt="Đội ngũ chuyên gia Trí Việt Phát"
              className="w-full h-[320px] sm:h-[360px] object-cover rounded-[10px]"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-5 sm:p-6  card-3d space-y-2.5">
              <span className="text-[12px] font-bold text-[#111111] inline-block">
                {ABOUT_PAGE.storyTag}
              </span>
              <h2 className="text-[22px] font-bold text-[#111111]">
                {ABOUT_PAGE.storyTitle}
              </h2>
              {ABOUT_PAGE.storyText
                .split(/\n\s*\n/)
                .filter((para) => para.trim())
                .map((para, idx) => (
                  <p
                    key={idx}
                    className="text-[13.5px] text-[#555555] leading-relaxed [&_strong]:text-[#111111]"
                    dangerouslySetInnerHTML={{ __html: inlineMd(para) }}
                  />
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {ABOUT_PAGE.stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-4  card-3d-subtle">
                  <div className="flex items-center gap-1.5 text-[#111111] mb-1">
                    <span className="material-symbols-outlined text-[22px]">{stat.icon}</span>
                    <span className="text-[24px] font-bold">{stat.value}</span>
                  </div>
                  <span className="text-[12px] font-medium text-[#555555]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission, Vision, Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {ABOUT_PAGE.pillars.map((pillar, idx) => (
            <div key={idx} className="bg-white p-6  card-3d-subtle flex flex-col h-full space-y-3">
              <div className="w-12 h-12 fx-icon flex items-center justify-center shrink-0 ">
                <span className="material-symbols-outlined text-[28px]">{pillar.icon}</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#111111]">{pillar.title}</h3>
              <p className="text-[13.5px] text-[#555555] leading-relaxed flex-1">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Business Activities */}
        <div className="bg-white p-5 sm:p-6  card-3d space-y-4">
          <div className="border-b border-[#f2f2f2] pb-3">
            <h3 className="text-[20px] font-bold text-[#111111]">
              {ABOUT_PAGE.areasTitle}
            </h3>
            <p className="text-[13px] text-[#555555]">
              {ABOUT_PAGE.areasDesc}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {BUSINESS_AREAS.map((area, idx) => (
              <div
                key={idx}
                className="p-4  card-3d-subtle bg-white h-full flex flex-col justify-start"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-[#111111] text-[18px] shrink-0">
                    check_circle
                  </span>
                  <h4 className="text-[14.5px] font-bold text-[#111111]">{area.title}</h4>
                </div>
                <p className="text-[12.5px] text-[#555555] leading-relaxed flex-1">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner with 3D Bevel */}
        <div className="p-6 sm:p-8  bg-linear-to-r from-[#071a2e] via-[#071a2e] to-[#071a2e] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_12px_32px_rgba(0,60,120,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-[#0a2540]/40">
          <div className="space-y-1 text-center sm:text-left max-w-xl">
            <h3 className="text-[19px] font-bold text-white">{ABOUT_PAGE.ctaTitle}</h3>
            <p className="text-[13px] text-[#e5e5e5] leading-relaxed">
              {ABOUT_PAGE.ctaDesc}
            </p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="px-6 py-3  btn-3d-red text-white font-bold text-[13.5px] cursor-pointer shrink-0 inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">handshake</span>
            <span>{ABOUT_PAGE.ctaButton}</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
