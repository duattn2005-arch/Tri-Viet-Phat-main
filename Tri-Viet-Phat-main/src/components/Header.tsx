import React, { useState, useEffect, useRef } from 'react';
import { PageTab } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface HeaderProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab, categoryFilter?: string) => void;
  onOpenConsultation: (prefilledProduct?: string) => void;
  onOpenRepairService: () => void;
  onOpenSearch: () => void;
}

type DropdownKey = 'san-pham' | 'tai-lieu' | 'tin-tuc';

interface NavItem {
  tab: PageTab;
  label: string;
  children?: { cat: string; label: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { tab: 'trang-chu', label: 'Trang chủ' },
  { tab: 'gioi-thieu', label: 'Giới thiệu' },
  {
    tab: 'san-pham',
    label: 'Sản phẩm',
    children: [
      { cat: 'all', label: 'Tất cả sản phẩm' },
      { cat: 'may-xet-nghiem-huyet-hoc', label: 'Máy xét nghiệm huyết học' },
      { cat: 'may-xet-nghiem-sinh-hoa', label: 'Máy xét nghiệm sinh hóa' },
      { cat: 'may-xet-nghiem-nuoc-tieu', label: 'Máy xét nghiệm nước tiểu' },
      { cat: 'may-xet-nghiem-dien-giai', label: 'Máy xét nghiệm điện giải' },
      { cat: 'may-xet-nghiem-mien-dich', label: 'Máy xét nghiệm miễn dịch' },
      { cat: 'may-phan-tich-dong-mau', label: 'Máy phân tích đông máu' },
      { cat: 'may-xet-nghiem-hba1c', label: 'Máy xét nghiệm HbA1c' },
      { cat: 'hoa-chat-xet-nghiem', label: 'Hóa chất và thuốc thử' },
      { cat: 'thiet-bi-khac', label: 'Máy ly tâm và thiết bị khác' },
    ],
  },
  {
    tab: 'tai-lieu',
    label: 'Tài liệu',
    children: [
      { cat: 'all', label: 'Tất cả tài liệu' },
      { cat: 'video-huong-dan', label: 'Video hướng dẫn sử dụng' },
      { cat: 'tai-lieu-san-pham', label: 'Tài liệu sản phẩm' },
      { cat: 'huong-dan-bao-tri', label: 'Hướng dẫn bảo trì, sửa chữa' },
    ],
  },
  {
    tab: 'tin-tuc',
    label: 'Tin tức',
    children: [
      { cat: 'all', label: 'Tất cả tin tức' },
      { cat: 'kien-thuc-suc-khoe', label: 'Kiến thức sức khỏe' },
      { cat: 'tin-y-te', label: 'Tin y tế' },
      { cat: 'tin-noi-bo', label: 'Tin nội bộ' },
    ],
  },
  { tab: 'tuyen-dung', label: 'Tuyển dụng' },
  { tab: 'lien-he', label: 'Liên hệ' },
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenConsultation,
  onOpenRepairService,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (tab: PageTab, categoryFilter?: string) => {
    onSelectTab(tab, categoryFilter);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDropdown = (key: DropdownKey) => {
    onSelectTab(key);
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const hotlineHref = (phone: string) => `tel:${phone.replace(/\./g, '')}`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#e2e8f0]">
      {/* Top utility bar */}
      <div className="bg-[#f8fafc] text-[#475569] text-[12px] border-b border-[#e2e8f0]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center justify-between h-8 sm:h-9">
          <div className="flex items-center gap-4 min-w-0">
            <span className="truncate">
              Hotline{' '}
              <a href={hotlineHref(COMPANY_INFO.hotline)} className="font-semibold text-[#0f172a] hover:text-[#006194]">
                {COMPANY_INFO.hotline}
              </a>
              <span className="hidden sm:inline">
                {' · '}
                <a href={hotlineHref(COMPANY_INFO.hotline2)} className="font-semibold text-[#0f172a] hover:text-[#006194]">
                  {COMPANY_INFO.hotline2}
                </a>
              </span>
            </span>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden md:inline truncate hover:text-[#006194] transition-colors"
            >
              {COMPANY_INFO.email}
            </a>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href={COMPANY_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#006194] transition-colors"
            >
              Facebook
            </a>
            <a
              href={COMPANY_INFO.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#006194] transition-colors"
            >
              Zalo
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 h-16 sm:h-20">
        <button
          onClick={() => handleNavClick('trang-chu')}
          className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer shrink-0"
        >
          <img
            alt="Logo Trí Việt Phát"
            className="h-8 sm:h-10 w-auto object-contain"
            src={COMPANY_INFO.logoUrl}
          />
          <span className="flex flex-col leading-tight">
            <span className="text-[16px] sm:text-[18px] font-bold text-[#0f172a] tracking-tight">Trí Việt Phát</span>
            <span className="text-[11px] sm:text-[12px] text-[#64748b]">Thiết bị y tế</span>
          </span>
        </button>

        {/* Desktop navigation */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 text-[14.5px]">
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.tab;
            const baseClass = `relative px-3 py-2 font-medium transition-colors cursor-pointer inline-flex items-center gap-0.5 ${
              isActive ? 'text-[#006194]' : 'text-[#334155] hover:text-[#006194]'
            }`;
            const activeBar = isActive && (
              <span className="absolute left-3 right-3 -bottom-[21px] h-0.5 bg-[#006194]" aria-hidden="true" />
            );

            if (!item.children) {
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={baseClass}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {activeBar}
                </button>
              );
            }

            const key = item.tab as DropdownKey;
            const isOpen = openDropdown === key;
            return (
              <div key={item.tab} className="relative">
                <button
                  onClick={() => toggleDropdown(key)}
                  className={baseClass}
                  aria-expanded={isOpen}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                  <span
                    className={`material-symbols-outlined text-[18px] text-[#94a3b8] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                  {activeBar}
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg border border-[#e2e8f0] shadow-[0_12px_32px_rgba(15,23,42,0.10)] py-2 z-50">
                    {item.children.map((child, idx) => (
                      <button
                        key={child.cat}
                        onClick={() => handleNavClick(item.tab, child.cat)}
                        className={`w-full text-left px-4 py-2 text-[14px] hover:bg-[#f8fafc] hover:text-[#006194] transition-colors cursor-pointer ${
                          idx === 0
                            ? 'font-semibold text-[#0f172a] border-b border-[#f1f5f9] mb-1 pb-2.5'
                            : 'text-[#475569]'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            aria-label="Tìm kiếm"
            className="w-10 h-10 rounded-md flex items-center justify-center text-[#475569] hover:text-[#006194] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={() => onOpenConsultation()}
            className="hidden sm:inline-flex items-center btn-primary h-10 px-5 rounded-md text-[14px] font-semibold cursor-pointer"
          >
            Yêu cầu báo giá
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-10 h-10 rounded-md flex items-center justify-center text-[#334155] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e2e8f0] px-4 sm:px-8 py-3 max-h-[calc(100vh-96px)] overflow-y-auto overscroll-contain shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
          <nav className="divide-y divide-[#f1f5f9]">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <div key={item.tab} className="py-1">
                  <button
                    onClick={() => handleNavClick(item.tab)}
                    className={`w-full text-left py-2.5 text-[15px] font-medium cursor-pointer ${
                      isActive ? 'text-[#006194]' : 'text-[#0f172a]'
                    }`}
                  >
                    {item.label}
                  </button>
                  {item.children && item.tab !== 'san-pham' && (
                    <div className="pb-2 pl-4 space-y-0.5">
                      {item.children.slice(1).map((child) => (
                        <button
                          key={child.cat}
                          onClick={() => handleNavClick(item.tab, child.cat)}
                          className="block w-full text-left py-1.5 text-[14px] text-[#64748b] hover:text-[#006194] cursor-pointer"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="pt-4 pb-2 space-y-3 border-t border-[#e2e8f0]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="btn-primary w-full h-11 rounded-md text-[15px] font-semibold cursor-pointer"
            >
              Yêu cầu báo giá
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRepairService();
              }}
              className="w-full py-2 text-[14px] font-semibold text-[#006194] cursor-pointer"
            >
              Đăng ký bảo trì, sửa chữa
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
