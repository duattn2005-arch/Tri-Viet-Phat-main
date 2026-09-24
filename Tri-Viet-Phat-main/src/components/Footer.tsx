import React from 'react';
import { PageTab } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface FooterProps {
  onSelectTab: (tab: PageTab, categoryFilter?: string) => void;
  onOpenConsultation: (prefilledProduct?: string) => void;
}

const EXPLORE_LINKS: { label: string; tab: PageTab }[] = [
  { label: 'Giới thiệu công ty', tab: 'gioi-thieu' },
  { label: 'Sản phẩm', tab: 'san-pham' },
  { label: 'Tài liệu kỹ thuật', tab: 'tai-lieu' },
  { label: 'Tin tức', tab: 'tin-tuc' },
  { label: 'Tuyển dụng', tab: 'tuyen-dung' },
  { label: 'Liên hệ', tab: 'lien-he' },
];

const PRODUCT_LINKS = [
  { label: 'Máy xét nghiệm huyết học', cat: 'may-xet-nghiem-huyet-hoc' },
  { label: 'Máy xét nghiệm sinh hóa', cat: 'may-xet-nghiem-sinh-hoa' },
  { label: 'Máy xét nghiệm điện giải', cat: 'may-xet-nghiem-dien-giai' },
  { label: 'Máy phân tích nước tiểu', cat: 'may-xet-nghiem-nuoc-tieu' },
  { label: 'Hóa chất huyết học Dewei', cat: 'hoa-chat-xet-nghiem' },
  { label: 'Thiết bị y tế khác', cat: 'thiet-bi-khac' },
];

const tel = (phone: string) => `tel:${phone.replace(/\./g, '')}`;

const SOCIALS = [
  { href: COMPANY_INFO.facebookUrl, label: 'Facebook', bg: 'bg-[#1877f2]', icon: 'facebook' as const },
  { href: COMPANY_INFO.zaloUrl, label: 'Zalo', bg: 'bg-[#0068ff]', icon: 'zalo' as const },
  { href: tel(COMPANY_INFO.hotline), label: 'Gọi điện', bg: 'bg-[#16a34a]', icon: 'call' as const },
  { href: `mailto:${COMPANY_INFO.email}`, label: 'Email', bg: 'bg-[#f97316]', icon: 'mail' as const },
];

const HEADING_CLASS = 'relative text-[15px] font-bold uppercase tracking-[0.08em] text-white pb-3 mb-5';

/** Column heading with a short blue→red rule underneath. */
const ColumnHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className={HEADING_CLASS}>
    {children}
    <span className="absolute left-0 bottom-0 h-[2px] w-10 bg-linear-to-r from-[#0a94dc] to-[#e11d2a]" aria-hidden="true" />
  </h3>
);

/** Footer link with a chevron that slides right on hover. */
const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="group inline-flex items-center gap-1.5 text-left hover:text-white hover:translate-x-1 transition-[color,translate] duration-300 cursor-pointer"
  >
    <span className="material-symbols-outlined text-[16px] text-[#0a94dc] group-hover:text-[#e11d2a] transition-colors">
      chevron_right
    </span>
    {children}
  </button>
);

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenConsultation }) => {
  const handleNav = (tab: PageTab, cat?: string) => {
    onSelectTab(tab, cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="fx-spotlight relative w-full bg-[#0a2540] text-white/65 text-[14px]">
      <span
        className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-[#0a94dc] via-[#0a94dc] to-[#e11d2a]"
        aria-hidden="true"
      />

      {/* Call-to-action strip */}
      <div className="relative border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-[20px] sm:text-[24px] font-bold text-white leading-tight">
              Cần tư vấn thiết bị cho phòng xét nghiệm?
            </p>
            <p className="mt-1.5 text-white/60">Kỹ sư Trí Việt Phát phản hồi báo giá và cấu hình trong ngày làm việc.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={tel(COMPANY_INFO.hotline)}
              className="group inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-full border-2 border-white/30 text-white font-bold hover:border-[#e11d2a] hover:bg-[#e11d2a] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] phone-shake">call</span>
              Hotline: {COMPANY_INFO.hotline}
            </a>
            <button
              onClick={() => onOpenConsultation()}
              className="btn-primary h-12 px-7 rounded-full text-[14px] font-semibold uppercase tracking-wide cursor-pointer"
            >
              Yêu cầu báo giá
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Company */}
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3">
              <img src={COMPANY_INFO.logoUrl} alt="Logo Trí Việt Phát" className="h-10 w-auto object-contain" />
              <span className="leading-tight">
                <span className="block text-[16px] font-bold text-[#0a2540]">Trí Việt Phát</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0a94dc]">
                  Thiết bị y tế
                </span>
              </span>
            </div>
            <p className="mt-5 text-[13px] font-bold uppercase tracking-wide text-white leading-snug">{COMPANY_INFO.name}</p>
            <ul className="mt-4 space-y-3 leading-relaxed">
              <li className="flex gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#0a94dc] mt-0.5">location_on</span>
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#0a94dc] mt-0.5">badge</span>
                <span>
                  ĐKKD: <span className="text-white">{COMPANY_INFO.licenseNo}</span> — {COMPANY_INFO.licensedBy}
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#0a94dc] mt-0.5">call</span>
                <span>
                  <a href={tel(COMPANY_INFO.hotline)} className="font-semibold text-white fx-link">
                    {COMPANY_INFO.hotline}
                  </a>
                  {' · '}
                  <a href={tel(COMPANY_INFO.hotline2)} className="font-semibold text-white fx-link">
                    {COMPANY_INFO.hotline2}
                  </a>
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#0a94dc] mt-0.5">mail</span>
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-white fx-link break-all">
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <ColumnHeading>Khám phá</ColumnHeading>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.tab}>
                  <FooterLink onClick={() => handleNav(item.tab)}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <ColumnHeading>Sản phẩm</ColumnHeading>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.cat}>
                  <FooterLink onClick={() => handleNav('san-pham', item.cat)}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <ColumnHeading>Kết nối với chúng tôi</ColumnHeading>
            <p className="leading-relaxed">Nhắn tin hoặc gọi trực tiếp để được tư vấn cấu hình và báo giá.</p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  title={s.label}
                  className={`w-11 h-11 rounded-full ${s.bg} text-white flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] hover:-translate-y-1 hover:scale-110 transition-transform duration-300`}
                >
                  {s.icon === 'facebook' ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ) : s.icon === 'zalo' ? (
                    <span className="text-[13px] font-bold">Zalo</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                  )}
                </a>
              ))}
            </div>
            <a
              href={tel(COMPANY_INFO.hotline)}
              className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/30 text-white font-semibold hover:bg-white hover:text-[#0a2540] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] phone-shake">call</span>
              Hotline: {COMPANY_INFO.hotline}
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[12.5px] text-white/45">
          <p>
            © {new Date().getFullYear()} {COMPANY_INFO.name}
          </p>
          <p>Thiết bị có giấy phép lưu hành của Bộ Y tế</p>
        </div>
      </div>
    </footer>
  );
};
