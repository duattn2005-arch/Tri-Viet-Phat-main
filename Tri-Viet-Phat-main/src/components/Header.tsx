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
      <div className="fx-gradient-flow text-white/70 text-[12px]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center justify-between h-8 sm:h-9">
          <div className="flex items-center gap-4 min-w-0">
            <span className="truncate">
              Hotline{' '}
              <a href={hotlineHref(COMPANY_INFO.hotline)} className="font-semibold text-white fx-link">
                {COMPANY_INFO.hotline}
              </a>
              <span className="hidden sm:inline">
                {' · '}
                <a href={hotlineHref(COMPANY_INFO.hotline2)} className="font-semibold text-white fx-link">
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

      {/* Brand row: logo · big search · hotline block · CTA */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 lg:gap-8 h-16 sm:h-20 lg:h-[84px]">
        <button
          onClick={() => handleNavClick('trang-chu')}
          className="group flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer shrink-0"
        >
          <img
            alt="Logo Trí Việt Phát"
            className="h-8 sm:h-11 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            src={COMPANY_INFO.logoUrl}
          />
          <span className="flex flex-col leading-tight">
            <span className="text-[16px] sm:text-[19px] font-bold text-[#0a2540] tracking-tight">Trí Việt Phát</span>
            <span className="text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.12em] text-[#0a94dc]">
              Thiết bị y tế
            </span>
          </span>
        </button>

        {/* Search (desktop): opens the search dialog */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="group hidden lg:flex flex-1 max-w-[560px] h-12 items-center rounded-full border-2 border-[#dbe6f0] bg-[#f3f7fb] pl-5 pr-1.5 text-left text-[14px] text-[#777777] hover:border-[#0a94dc] hover:bg-white transition-colors cursor-text"
        >
          <span className="flex-1 truncate">Tìm máy xét nghiệm, hóa chất, vật tư…</span>
          <span className="w-9 h-9 rounded-full bg-linear-to-br from-[#0a94dc] to-[#0a2540] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Hotline block (desktop) */}
          <a href={hotlineHref(COMPANY_INFO.hotline)} className="group hidden xl:flex items-center gap-3">
            <span className="relative w-11 h-11 shrink-0">
              <span className="absolute inset-0 rounded-full bg-[#e11d2a]/25 animate-ping" aria-hidden="true" />
              <span className="relative w-11 h-11 rounded-full bg-linear-to-br from-[#e11d2a] to-[#b3141f] text-white flex items-center justify-center shadow-[0_6px_18px_-6px_rgba(225,29,42,0.8)]">
                <span className="material-symbols-outlined text-[22px] phone-shake">call</span>
              </span>
            </span>
            <span className="leading-tight">
              <span className="block text-[12px] text-[#777777]">Tư vấn 24/7</span>
              <span className="block text-[19px] font-bold text-[#0a2540] group-hover:text-[#e11d2a] transition-colors tabular-nums">
                {COMPANY_INFO.hotline}
              </span>
            </span>
          </a>

          <button
            onClick={onOpenSearch}
            aria-label="Tìm kiếm"
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#0a2540] hover:bg-[#edf3f8] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={() => onOpenConsultation()}
            className="hidden sm:inline-flex items-center btn-primary h-11 px-6 rounded-full text-[13px] font-semibold uppercase tracking-wide cursor-pointer"
          >
            Yêu cầu báo giá
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#0a2540] hover:bg-[#edf3f8] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Navigation bar (desktop): navy, uppercase, red underline on hover/active */}
      <div className="hidden lg:block bg-[#0a2540]">
        <nav ref={navRef} className="max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center h-12 text-[14px]">
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.tab;
            const baseClass = `group relative h-12 px-4 xl:px-5 inline-flex items-center gap-0.5 font-semibold uppercase tracking-[0.06em] transition-colors duration-300 cursor-pointer ${
              isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'
            }`;
            const activeBar = (
              <span
                className={`absolute left-0 right-0 bottom-0 h-[3px] bg-linear-to-r from-[#0a94dc] to-[#e11d2a] origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
                    className={`material-symbols-outlined text-[18px] text-white/60 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                  {activeBar}
                </button>

                {isOpen && (
                  <div className="dropdown-in absolute left-0 top-full w-72 bg-white rounded-b-lg border-t-[3px] border-[#0a94dc] shadow-[0_18px_40px_rgba(10,37,64,0.18)] py-2 z-50">
                    {item.children.map((child, idx) => (
                      <button
                        key={child.cat}
                        onClick={() => handleNavClick(item.tab, child.cat)}
                        className={`group/item w-full text-left px-4 py-2.5 text-[14px] flex items-center gap-2 hover:bg-[#f3f7fb] hover:text-[#0a94dc] hover:pl-6 transition-all duration-300 cursor-pointer ${
                          idx === 0
                            ? 'font-semibold text-[#0a2540] border-b border-[#edf3f8] mb-1 pb-3'
                            : 'text-[#555555]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e11d2a] opacity-0 -ml-3.5 group-hover/item:opacity-100 transition-opacity" aria-hidden="true" />
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <a
            href="/crm"
            className="group relative h-12 px-4 xl:px-5 inline-flex items-center gap-1 font-semibold uppercase tracking-[0.06em] text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-300"
          >
            CRM
            <span
              className="absolute left-0 right-0 bottom-0 h-[3px] bg-linear-to-r from-[#0a94dc] to-[#e11d2a] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              aria-hidden="true"
            />
          </a>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="dropdown-in lg:hidden bg-white border-t border-[#e5e5e5] px-4 sm:px-8 py-3 max-h-[calc(100vh-116px)] overflow-y-auto overscroll-contain shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
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
                          className="block w-full text-left py-1.5 text-[14px] text-[#777777] fx-link cursor-pointer"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="py-1">
              <a
                href="/crm"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-[15px] font-medium text-[#0a2540] cursor-pointer"
              >
                CRM quản trị
              </a>
            </div>
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
