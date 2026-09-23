import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
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
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Reading-progress bar along the bottom edge of the header.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // Slide the header away while scrolling down, bring it back on any scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y > 300 && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4 || y <= 300) setHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerHidden = hidden && !mobileMenuOpen && openDropdown === null;

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
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-[#e5e5e5] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        headerHidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'shadow-[0_6px_24px_rgba(0,0,0,0.06)]' : ''}`}
    >
      <motion.div
        className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#e11d2a] origin-left z-10"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      {/* Top utility bar */}
      <div className="bg-[#111111] text-white/70 text-[12px]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center justify-between h-8 sm:h-9">
          <div className="flex items-center gap-4 min-w-0">
            <span className="truncate">
              Hotline{' '}
              <a href={hotlineHref(COMPANY_INFO.hotline)} className="font-semibold text-white hover:underline">
                {COMPANY_INFO.hotline}
              </a>
              <span className="hidden sm:inline">
                {' · '}
                <a href={hotlineHref(COMPANY_INFO.hotline2)} className="font-semibold text-white hover:underline">
                  {COMPANY_INFO.hotline2}
                </a>
              </span>
            </span>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden md:inline truncate hover:text-white transition-colors"
            >
              {COMPANY_INFO.email}
            </a>
          </div>

          <div className="flex items-center gap-4 shrink-0">
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
            <span className="text-[16px] sm:text-[18px] font-bold text-[#111111] tracking-tight">Trí Việt Phát</span>
            <span className="text-[11px] sm:text-[12px] text-[#777777]">Thiết bị y tế</span>
          </span>
        </button>

        {/* Desktop navigation */}
        <nav ref={navRef} className="hidden lg:flex flex-1 justify-center items-center gap-2 text-[15px] tracking-[0.03em]">
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.tab;
            const baseClass =
              'group relative px-3 py-2 font-semibold text-[#111111] cursor-pointer inline-flex items-center gap-0.5';
            // Underline that slides in from the left on hover and stays for the active page
            const activeBar = (
              <span
                className={`absolute left-3 right-3 -bottom-[21px] h-0.5 bg-[#111111] origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
                aria-hidden="true"
              />
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
                    className={`material-symbols-outlined text-[18px] text-[#999999] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                  {activeBar}
                </button>

                {isOpen && (
                  <div className="dropdown-in absolute left-0 top-full mt-2 w-72 bg-white border border-[#e5e5e5] shadow-[0_12px_32px_rgba(15,23,42,0.10)] py-2 z-50">
                    {item.children.map((child, idx) => (
                      <button
                        key={child.cat}
                        onClick={() => handleNavClick(item.tab, child.cat)}
                        className={`w-full text-left px-4 py-2 text-[14px] hover:bg-[#f7f7f7] hover:text-[#111111] hover:underline underline-offset-4 transition-colors cursor-pointer ${
                          idx === 0
                            ? 'font-semibold text-[#111111] border-b border-[#f2f2f2] mb-1 pb-2.5'
                            : 'text-[#555555]'
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
            className="w-10 h-10  flex items-center justify-center text-[#555555] hover:text-[#111111] hover:underline underline-offset-4 hover:bg-[#f2f2f2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={() => onOpenConsultation()}
            className="hidden sm:inline-flex items-center btn-primary h-10 px-5 text-[13px] font-semibold uppercase tracking-wide cursor-pointer"
          >
            Yêu cầu báo giá
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-10 h-10  flex items-center justify-center text-[#333333] hover:bg-[#f2f2f2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="dropdown-in lg:hidden bg-white border-t border-[#e5e5e5] px-4 sm:px-8 py-3 max-h-[calc(100vh-96px)] overflow-y-auto overscroll-contain shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
          <nav className="divide-y divide-[#f2f2f2]">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <div key={item.tab} className="py-1">
                  <button
                    onClick={() => handleNavClick(item.tab)}
                    className={`w-full text-left py-2.5 text-[15px] font-medium cursor-pointer ${
                      isActive ? 'text-[#111111]' : 'text-[#111111]'
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
                          className="block w-full text-left py-1.5 text-[14px] text-[#777777] hover:text-[#111111] hover:underline underline-offset-4 cursor-pointer"
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

          <div className="pt-4 pb-2 space-y-3 border-t border-[#e5e5e5]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="btn-primary w-full h-11 text-[14px] font-semibold uppercase tracking-wide cursor-pointer"
            >
              Yêu cầu báo giá
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRepairService();
              }}
              className="w-full py-2 text-[14px] font-semibold text-[#111111] cursor-pointer"
            >
              Đăng ký bảo trì, sửa chữa
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
