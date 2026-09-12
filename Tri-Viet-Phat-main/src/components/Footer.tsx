import React from 'react';
import { PageTab } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface FooterProps {
  onSelectTab: (tab: PageTab, categoryFilter?: string) => void;
  onOpenConsultation: (prefilledProduct?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const handleNav = (tab: PageTab, cat?: string) => {
    onSelectTab(tab, cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-linear-to-b from-[#003865] via-[#002747] to-[#00172b] text-white border-t-2 border-[#0099f7]/40 overflow-hidden">
      {/* Subtle 3D Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0099f7]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0284c7]/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-14 pt-8 pb-7">
        
        {/* TOP 3D TRUST & QUALITY STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pb-8 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0284c7] to-[#004f80] text-white flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(2,132,199,0.35)]">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <div className="text-[13.5px] font-bold text-white leading-tight">100% Chính Hãng</div>
              <div className="text-[11.5px] text-[#93c5fd]">CO/CQ, CFS đầy đủ từ hãng</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0284c7] to-[#004f80] text-white flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(2,132,199,0.35)]">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            </div>
            <div>
              <div className="text-[13.5px] font-bold text-white leading-tight">Bảo Hành 12 - 24 Tháng</div>
              <div className="text-[11.5px] text-[#93c5fd]">Bảo trì định kỳ chuẩn quốc tế</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0284c7] to-[#004f80] text-white flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(2,132,199,0.35)]">
              <span className="material-symbols-outlined text-[20px]">engineering</span>
            </div>
            <div>
              <div className="text-[13.5px] font-bold text-white leading-tight">Chuyển Giao Tận Nơi</div>
              <div className="text-[11.5px] text-[#93c5fd]">Kỹ sư y sinh đào tạo vận hành</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#dc2626] to-[#991b1b] text-white flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(220,38,38,0.35)]">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div>
              <div className="text-[13.5px] font-bold text-white leading-tight">Hotline Hỗ Trợ 24/7</div>
              <div className="text-[11.5px] text-[#fca5a5]">0904.698.699 - 0392.123.688</div>
            </div>
          </div>
        </div>

        {/* 4 LOGICAL 3D CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-6 mb-8">
          
          {/* Column 1: Về chúng tôi (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 rounded-full bg-[#0099f7]"></span>
                <h3 className="text-[17px] font-extrabold text-white tracking-wide uppercase">
                  Về chúng tôi
                </h3>
              </div>
              
              <div className="space-y-2 text-[13.5px] text-[#cbd5e1] leading-relaxed">
                <p>
                  <strong className="text-white font-bold text-[14px] block mb-1">
                    CÔNG TY THIẾT BỊ Y TẾ TRÍ VIỆT PHÁT
                  </strong>
                  Được thành lập dưới quyết định số <strong className="text-white font-bold">0105558779</strong> của Sở Kế hoạch và Đầu tư Hà Nội. Chúng tôi chuyên phân phối máy móc, hóa chất vật tư y tế ngành xét nghiệm cho các bệnh viện, phòng khám trên toàn quốc.
                </p>
                <button
                  onClick={() => handleNav('gioi-thieu')}
                  className="inline-flex items-center gap-1.5 font-bold text-[#38bdf8] hover:text-white hover:underline pt-1 cursor-pointer transition-colors"
                >
                  <span>Tìm hiểu thêm về chúng tôi</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Social 3D Pill Badges - EXCLUSIVELY Facebook & Zalo */}
            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="text-[12px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2.5">
                Kênh liên hệ chính thức:
              </div>
              <div className="flex items-center gap-3">
                {/* Facebook 3D Button */}
                <a
                  href={COMPANY_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Fanpage Trí Việt Phát"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-linear-to-b from-[#1877f2] to-[#0d5ac0] hover:from-[#2583fd] hover:to-[#1166d4] text-white text-[12.5px] font-bold shadow-[0_4px_12px_rgba(24,119,242,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* Zalo 3D Button */}
                <a
                  href={COMPANY_INFO.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo Trí Việt Phát"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-linear-to-b from-[#0068ff] to-[#004fcf] hover:from-[#1a77ff] hover:to-[#005be6] text-white text-[12.5px] font-bold shadow-[0_4px_12px_rgba(0,104,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="w-4 h-4 rounded-full bg-white text-[#0068ff] flex items-center justify-center font-black text-[10px]">
                    Z
                  </span>
                  <span>Zalo Chat</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Khám phá (2.5 cols) */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-5 rounded-full bg-[#0099f7]"></span>
                <h3 className="text-[17px] font-extrabold text-white tracking-wide uppercase">
                  Khám phá
                </h3>
              </div>
              <ul className="space-y-2 text-[13.5px] text-[#cbd5e1]">
                {[
                  { label: 'Giới thiệu công ty', tab: 'gioi-thieu' as PageTab },
                  { label: 'Danh mục sản phẩm', tab: 'san-pham' as PageTab },
                  { label: 'Tài liệu kỹ thuật', tab: 'tai-lieu' as PageTab },
                  { label: 'Tin tức y tế', tab: 'tin-tuc' as PageTab },
                  { label: 'Tin tuyển dụng', tab: 'tuyen-dung' as PageTab },
                  { label: 'Liên hệ & Báo giá', tab: 'lien-he' as PageTab },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleNav(item.tab)}
                      className="group flex items-center gap-1.5 hover:text-white transition-colors text-left cursor-pointer py-0.5"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#38bdf8] group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Sản phẩm chủ lực (2.5 cols) */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-5 rounded-full bg-[#0099f7]"></span>
                <h3 className="text-[17px] font-extrabold text-white tracking-wide uppercase">
                  Sản phẩm
                </h3>
              </div>
              <ul className="space-y-2 text-[13.5px] text-[#cbd5e1]">
                {[
                  { label: 'Máy xét nghiệm huyết học', cat: 'may-xet-nghiem-huyet-hoc' },
                  { label: 'Máy xét nghiệm sinh hóa', cat: 'may-xet-nghiem-sinh-hoa' },
                  { label: 'Máy xét nghiệm khí máu', cat: 'may-xet-nghiem-dien-giai' },
                  { label: 'Máy phân tích nước tiểu', cat: 'may-xet-nghiem-nuoc-tieu' },
                  { label: 'Hóa chất huyết học Dewei', cat: 'hoa-chat-xet-nghiem' },
                  { label: 'Thiết bị y tế khác', cat: 'thiet-bi-khac' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleNav('san-pham', item.cat)}
                      className="group flex items-center gap-1.5 hover:text-white transition-colors text-left cursor-pointer py-0.5"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#38bdf8] group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Liên hệ (4 cols - Has ample padding and 3D contact elements) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xs shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 rounded-full bg-[#ef4444]"></span>
                <h3 className="text-[17px] font-extrabold text-white tracking-wide uppercase">
                  Liên hệ trực tiếp
                </h3>
              </div>

              <div className="text-[13.5px] text-[#cbd5e1] space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <span className="material-symbols-outlined text-[17px]">apartment</span>
                  </div>
                  <div>
                    <span className="text-[11.5px] text-[#94a3b8] block font-semibold">Trụ sở & VPGD:</span>
                    <span className="text-white font-medium text-[13px] leading-snug">
                      {COMPANY_INFO.address}
                    </span>
                  </div>
                </div>

                {/* 3D Hotline Action Buttons */}
                <div className="pt-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#dc2626]/20 text-[#f87171] border border-[#dc2626]/30 flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[17px]">phone_in_talk</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <span className="text-[12.5px] text-[#cbd5e1]">Hotline 1 (24/7):</span>
                      <a
                        href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-linear-to-b from-[#dc2626] to-[#b91c1c] text-white font-extrabold text-[13px] shadow-[0_2px_8px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>{COMPANY_INFO.hotline}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#dc2626]/20 text-[#f87171] border border-[#dc2626]/30 flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[17px]">call</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <span className="text-[12.5px] text-[#cbd5e1]">Hotline 2:</span>
                      <a
                        href={`tel:${COMPANY_INFO.hotline2.replace(/\./g, '')}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-linear-to-b from-[#0284c7] to-[#006194] text-white font-extrabold text-[13px] shadow-[0_2px_8px_rgba(2,132,199,0.4)] hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>{COMPANY_INFO.hotline2}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-7 h-7 rounded-lg bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30 flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[17px]">mail</span>
                  </div>
                  <div className="overflow-hidden text-ellipsis">
                    <span className="text-[11.5px] text-[#94a3b8] block font-semibold">Email tiếp nhận:</span>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-white hover:text-[#38bdf8] hover:underline font-medium text-[13px]"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#94a3b8]">
          <p>© {new Date().getFullYear()} Công ty TNHH Thương mại Dịch vụ Trí Việt Phát. ĐKKD: 0105558779.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[#38bdf8]">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span>ISO 13485:2016 Compliant</span>
            </span>
            <span>•</span>
            <span>Tất cả thiết bị đều có chứng chỉ lưu hành Bộ Y Tế</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
