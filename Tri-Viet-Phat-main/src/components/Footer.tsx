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

const HEADING_CLASS = 'text-[14px] font-semibold text-white mb-4';
const LINK_CLASS = 'text-left hover:text-white transition-colors cursor-pointer';

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const handleNav = (tab: PageTab, cat?: string) => {
    onSelectTab(tab, cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#111111] text-[#999999] text-[14px]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-4">
            <div className="text-[17px] font-bold text-white">Trí Việt Phát</div>
            <p className="mt-3 leading-relaxed">
              Phân phối máy xét nghiệm, hóa chất và vật tư y tế cho bệnh viện, phòng khám trên toàn quốc. ĐKKD số{' '}
              {COMPANY_INFO.licenseNo}, cấp bởi {COMPANY_INFO.licensedBy}.
            </p>
            <div className="mt-5 flex gap-5">
              <a
                href={COMPANY_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href={COMPANY_INFO.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Zalo
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className={HEADING_CLASS}>Khám phá</h3>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.tab}>
                  <button onClick={() => handleNav(item.tab)} className={LINK_CLASS}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={HEADING_CLASS}>Sản phẩm</h3>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.cat}>
                  <button onClick={() => handleNav('san-pham', item.cat)} className={LINK_CLASS}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={HEADING_CLASS}>Liên hệ</h3>
            <address className="not-italic space-y-3 leading-relaxed">
              <p>{COMPANY_INFO.address}</p>
              <p>
                Hotline:{' '}
                <a
                  href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
                  className="font-semibold text-white hover:underline"
                >
                  {COMPANY_INFO.hotline}
                </a>
                {' · '}
                <a
                  href={`tel:${COMPANY_INFO.hotline2.replace(/\./g, '')}`}
                  className="font-semibold text-white hover:underline"
                >
                  {COMPANY_INFO.hotline2}
                </a>
              </p>
              <p className="break-all">
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[12.5px] text-[#777777]">
          <p>
            © {new Date().getFullYear()} {COMPANY_INFO.name}
          </p>
          <p>Thiết bị có giấy phép lưu hành của Bộ Y tế</p>
        </div>
      </div>
    </footer>
  );
};
