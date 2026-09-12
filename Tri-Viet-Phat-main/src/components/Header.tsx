import React, { useState, useEffect, useRef } from 'react';
import { PageTab } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface HeaderProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab, categoryFilter?: string) => void;
  onOpenConsultation: (prefilledProduct?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenConsultation,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [documentsDropdownOpen, setDocumentsDropdownOpen] = useState(false);
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
        setDocumentsDropdownOpen(false);
        setNewsDropdownOpen(false);
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
    setProductsDropdownOpen(false);
    setDocumentsDropdownOpen(false);
    setNewsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleProductsDropdown = () => {
    onSelectTab('san-pham');
    setProductsDropdownOpen((prev) => !prev);
    setDocumentsDropdownOpen(false);
    setNewsDropdownOpen(false);
  };

  const toggleDocumentsDropdown = () => {
    onSelectTab('tai-lieu');
    setDocumentsDropdownOpen((prev) => !prev);
    setProductsDropdownOpen(false);
    setNewsDropdownOpen(false);
  };

  const toggleNewsDropdown = () => {
    onSelectTab('tin-tuc');
    setNewsDropdownOpen((prev) => !prev);
    setProductsDropdownOpen(false);
    setDocumentsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ffffff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e2e8f0]">
      {/* Top Utility Bar */}
      <div className="bg-[#f8fafc] text-[#475569] text-[11px] sm:text-[12px] font-medium border-b border-[#e2e8f0]/70">
        <div className="max-w-[1720px] mx-auto px-3 sm:px-8 xl:px-12 flex items-center justify-between h-8 sm:h-9">
          <div className="flex items-center gap-2 sm:gap-5 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="material-symbols-outlined text-[14px] sm:text-[15px] text-[#006194] shrink-0">call</span>
              <span className="shrink-0 text-[11px] sm:text-[12px]">Hotline:</span>
              <a
                href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
                className="text-[#d91828] font-extrabold hover:underline text-[11.5px] sm:text-[12.5px] shrink-0"
              >
                {COMPANY_INFO.hotline}
              </a>
              <span className="text-[#94a3b8] hidden sm:inline">-</span>
              <a
                href={`tel:${COMPANY_INFO.hotline2.replace(/\./g, '')}`}
                className="text-[#d91828] font-extrabold hover:underline hidden sm:inline"
              >
                {COMPANY_INFO.hotline2}
              </a>
            </div>
            <span className="text-[#cbd5e1] hidden md:inline">|</span>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-[#006194] transition-colors truncate"
            >
              <span className="material-symbols-outlined text-[15px] text-[#006194]">mail</span>
              <span className="truncate">{COMPANY_INFO.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden md:inline text-[11.5px] text-[#64748b]">Kết nối với chúng tôi:</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                href={COMPANY_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Fanpage Trí Việt Phát"
                title="Facebook"
                className="text-[#475569] hover:text-[#006194] transition-colors p-1 sm:p-0"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={COMPANY_INFO.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo Trí Việt Phát"
                title="Zalo"
                className="text-[10px] sm:text-[11px] font-bold text-[#475569] hover:text-[#006194] transition-colors px-1 py-0.5 border border-[#cbd5e1] rounded-xs"
              >
                Zalo
              </a>
            </div>
            <span className="text-[#cbd5e1] hidden lg:inline">|</span>
            <span className="text-[11.5px] text-[#64748b] hidden lg:inline">
              Vì một nền y tế Việt Nam hiện đại hơn
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1720px] mx-auto px-3 sm:px-8 xl:px-12 flex items-center justify-between h-16 sm:h-20">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('trang-chu')}
          className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <img
            alt="Logo Trí Việt Phát"
            className="h-8 sm:h-11 w-auto max-h-11 object-contain group-hover:scale-105 transition-transform"
            src={COMPANY_INFO.logoUrl}
          />
          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[21px] font-extrabold text-[#006194] tracking-tight leading-none uppercase font-sans">
              TRÍ VIỆT PHÁT
            </span>
            <span className="text-[9.5px] sm:hidden text-[#64748b] font-medium leading-tight tracking-wider">
              THIẾT BỊ Y TẾ
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links - Exact Uppercase Style with 3D Tactile Polish */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-[13.5px] font-bold tracking-tight">
          <button
            onClick={() => handleNavClick('trang-chu')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              currentTab === 'trang-chu'
                ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs font-extrabold'
                : 'text-[#334155] hover:text-[#006194] hover:bg-[#f1f5f9] border border-transparent'
            }`}
          >
            TRANG CHỦ
          </button>

          <button
            onClick={() => handleNavClick('gioi-thieu')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              currentTab === 'gioi-thieu'
                ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs font-extrabold'
                : 'text-[#334155] hover:text-[#006194] hover:bg-[#f1f5f9] border border-transparent'
            }`}
          >
            GIỚI THIỆU
          </button>

          {/* SẢN PHẨM with Click Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProductsDropdown}
              className={`px-3 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer font-bold ${
                currentTab === 'san-pham'
                  ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs font-extrabold'
                  : 'text-[#334155] hover:text-[#006194] hover:bg-[#f1f5f9] border border-transparent'
              }`}
            >
              <span>SẢN PHẨM</span>
              <span className={`material-symbols-outlined text-[17px] transition-transform duration-300 ${
                productsDropdownOpen ? 'rotate-180 text-[#006194]' : 'text-[#64748b]'
              }`}>
                expand_more
              </span>
            </button>

            {productsDropdownOpen && (
              <div className="absolute left-0 top-full w-80 bg-white/95 backdrop-blur-md shadow-[0_18px_45px_rgba(0,97,148,0.18),0_1px_1px_rgba(255,255,255,0.9)_inset] rounded-2xl py-2 border border-[#cbd5e1] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleNavClick('san-pham', 'all')}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#006194] hover:bg-[#e0f2fe]/40 transition-colors border-b border-[#f1f5f9] flex items-center justify-between"
                >
                  <span>Tất cả sản phẩm & thiết bị</span>
                  <span className="text-[11px] font-semibold bg-[#e0f2fe] text-[#006194] px-2 py-0.5 rounded-full">IVD Group</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'hoa-chat-xet-nghiem')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="font-semibold text-[#bb0112] group-hover:translate-x-0.5 transition-transform">Hóa chất huyết học Dewei & thuốc thử</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#bb0112]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'may-xet-nghiem-sinh-hoa')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Máy xét nghiệm sinh hóa</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'may-xet-nghiem-huyet-hoc')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Máy xét nghiệm huyết học</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'may-xet-nghiem-dien-giai')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Máy xét nghiệm điện giải</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'may-xet-nghiem-nuoc-tieu')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Máy xét nghiệm nước tiểu</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'may-xet-nghiem-mien-dich')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Máy xét nghiệm miễn dịch</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'may-phan-tich-dong-mau')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Máy phân tích đông máu</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'may-xet-nghiem-hba1c')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Máy xét nghiệm HbA1c</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('san-pham', 'thiet-bi-khac')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Máy ly tâm & thiết bị khác</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* TÀI LIỆU with White Card Dropdown matching SẢN PHẨM */}
          <div className="relative">
            <button
              onClick={toggleDocumentsDropdown}
              className={`px-3 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer font-bold ${
                currentTab === 'tai-lieu'
                  ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs font-extrabold'
                  : 'text-[#334155] hover:text-[#006194] hover:bg-[#f1f5f9] border border-transparent'
              }`}
            >
              <span>TÀI LIỆU</span>
              <span className={`material-symbols-outlined text-[17px] transition-transform duration-300 ${
                documentsDropdownOpen ? 'rotate-180 text-[#006194]' : 'text-[#64748b]'
              }`}>
                expand_more
              </span>
            </button>

            {documentsDropdownOpen && (
              <div className="absolute left-0 top-full w-80 bg-white/95 backdrop-blur-md shadow-[0_18px_45px_rgba(0,97,148,0.18),0_1px_1px_rgba(255,255,255,0.9)_inset] rounded-2xl py-2 border border-[#cbd5e1] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleNavClick('tai-lieu', 'all')}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#006194] hover:bg-[#e0f2fe]/40 transition-colors border-b border-[#f1f5f9] flex items-center justify-between cursor-pointer"
                >
                  <span>Tất cả tài liệu kỹ thuật</span>
                  <span className="text-[11px] font-semibold bg-[#e0f2fe] text-[#006194] px-2 py-0.5 rounded-full">Tài liệu</span>
                </button>
                <button
                  onClick={() => handleNavClick('tai-lieu', 'video-huong-dan')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-semibold text-[#bb0112] group-hover:translate-x-0.5 transition-transform">Video hướng dẫn sử dụng máy</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#bb0112]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('tai-lieu', 'tai-lieu-san-pham')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Tài liệu sản phẩm</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('tai-lieu', 'huong-dan-bao-tri')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Tài liệu hướng dẫn bảo trì sửa chữa</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* TIN TỨC with White Card Dropdown matching SẢN PHẨM */}
          <div className="relative">
            <button
              onClick={toggleNewsDropdown}
              className={`px-3 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer font-bold ${
                currentTab === 'tin-tuc'
                  ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs font-extrabold'
                  : 'text-[#334155] hover:text-[#006194] hover:bg-[#f1f5f9] border border-transparent'
              }`}
            >
              <span>TIN TỨC</span>
              <span className={`material-symbols-outlined text-[17px] transition-transform duration-300 ${
                newsDropdownOpen ? 'rotate-180 text-[#006194]' : 'text-[#64748b]'
              }`}>
                expand_more
              </span>
            </button>

            {newsDropdownOpen && (
              <div className="absolute left-0 top-full w-72 bg-white/95 backdrop-blur-md shadow-[0_18px_45px_rgba(0,97,148,0.18),0_1px_1px_rgba(255,255,255,0.9)_inset] rounded-2xl py-2 border border-[#cbd5e1] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => handleNavClick('tin-tuc', 'all')}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#006194] hover:bg-[#e0f2fe]/40 transition-colors border-b border-[#f1f5f9] flex items-center justify-between cursor-pointer"
                >
                  <span>Tất cả tin tức & sự kiện</span>
                  <span className="text-[11px] font-semibold bg-[#e0f2fe] text-[#006194] px-2 py-0.5 rounded-full">Tin tức</span>
                </button>
                <button
                  onClick={() => handleNavClick('tin-tuc', 'kien-thuc-suc-khoe')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="font-semibold text-[#bb0112] group-hover:translate-x-0.5 transition-transform">Kiến thức sức khỏe</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#bb0112]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('tin-tuc', 'tin-y-te')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Tin y tế</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
                <button
                  onClick={() => handleNavClick('tin-tuc', 'tin-noi-bo')}
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3f4850] hover:bg-[#e0f2fe]/50 hover:text-[#006194] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Tin nội bộ</span>
                  <span className="material-symbols-outlined text-[14px] text-[#bfc7d2] group-hover:text-[#006194]">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* TUYỂN DỤNG */}
          <button
            onClick={() => handleNavClick('tuyen-dung')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              currentTab === 'tuyen-dung'
                ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs font-extrabold'
                : 'text-[#334155] hover:text-[#006194] hover:bg-[#f1f5f9] border border-transparent'
            }`}
          >
            TUYỂN DỤNG
          </button>

          {/* LIÊN HỆ */}
          <button
            onClick={() => handleNavClick('lien-he')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              currentTab === 'lien-he'
                ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs font-extrabold'
                : 'text-[#334155] hover:text-[#006194] hover:bg-[#f1f5f9] border border-transparent'
            }`}
          >
            LIÊN HỆ
          </button>
        </nav>

        {/* Action Buttons & Search with 3D Depth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            aria-label="Tìm kiếm thiết bị"
            className="w-10 h-10 rounded-xl card-3d-subtle bg-white flex items-center justify-center text-[#475569] hover:text-[#006194] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <button
            onClick={() => onOpenConsultation()}
            className="hidden sm:inline-flex items-center gap-2 btn-3d-red px-5 py-2.5 rounded-2xl text-[14px] font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">headset_mic</span>
            <span>Tư vấn ngay</span>
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="lg:hidden w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-[#475569] hover:bg-[#e5eeff] hover:text-[#006194] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with 3D Tactile Items & Icons */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-[#cbd5e1] px-4 py-4 space-y-2 shadow-[0_16px_35px_rgba(0,0,0,0.1)] animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('trang-chu')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] font-bold flex items-center gap-2.5 transition-all ${
              currentTab === 'trang-chu' ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs' : 'text-[#3f4850] hover:bg-[#f1f5f9]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Trang chủ</span>
          </button>
          <button
            onClick={() => handleNavClick('gioi-thieu')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] font-bold flex items-center gap-2.5 transition-all ${
              currentTab === 'gioi-thieu' ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs' : 'text-[#3f4850] hover:bg-[#f1f5f9]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
            <span>Giới thiệu</span>
          </button>
          <button
            onClick={() => handleNavClick('san-pham')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] font-bold flex items-center gap-2.5 transition-all ${
              currentTab === 'san-pham' ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs' : 'text-[#3f4850] hover:bg-[#f1f5f9]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">biotech</span>
            <span>Sản phẩm & Thiết bị y tế</span>
          </button>

          {/* Divider between Product and Resources */}
          <div className="border-t border-[#f1f5f9] my-1"></div>

          {/* TÀI LIỆU */}
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('tai-lieu')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-[14px] font-bold flex items-center justify-between transition-all ${
                currentTab === 'tai-lieu' ? 'text-[#d92525] font-extrabold' : 'text-[#3f4850] hover:bg-[#f1f5f9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#d92525]">menu_book</span>
                <span>TÀI LIỆU</span>
              </div>
            </button>
            <div className="pl-9 pr-2 space-y-1.5 text-[13px]">
              <button
                onClick={() => handleNavClick('tai-lieu', 'video-huong-dan')}
                className="w-full text-left py-1 text-[#64748b] hover:text-[#d92525] flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d92525]" />
                <span>Video hướng dẫn sử dụng máy</span>
              </button>
              <button
                onClick={() => handleNavClick('tai-lieu', 'tai-lieu-san-pham')}
                className="w-full text-left py-1 text-[#64748b] hover:text-[#d92525] flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d92525]" />
                <span>Tài liệu sản phẩm</span>
              </button>
              <button
                onClick={() => handleNavClick('tai-lieu', 'huong-dan-bao-tri')}
                className="w-full text-left py-1 text-[#64748b] hover:text-[#d92525] flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d92525]" />
                <span>Tài liệu hướng dẫn bảo trì sửa chữa</span>
              </button>
            </div>
          </div>

          {/* TIN TỨC */}
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('tin-tuc')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-[14px] font-bold flex items-center justify-between transition-all ${
                currentTab === 'tin-tuc' ? 'text-[#d92525] font-extrabold' : 'text-[#3f4850] hover:bg-[#f1f5f9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#d92525]">feed</span>
                <span>TIN TỨC</span>
              </div>
            </button>
            <div className="pl-9 pr-2 space-y-1.5 text-[13px]">
              <button
                onClick={() => handleNavClick('tin-tuc', 'kien-thuc-suc-khoe')}
                className="w-full text-left py-1 text-[#64748b] hover:text-[#d92525] flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d92525]" />
                <span>Kiến thức sức khỏe</span>
              </button>
              <button
                onClick={() => handleNavClick('tin-tuc', 'tin-y-te')}
                className="w-full text-left py-1 text-[#64748b] hover:text-[#d92525] flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d92525]" />
                <span>Tin y tế</span>
              </button>
              <button
                onClick={() => handleNavClick('tin-tuc', 'tin-noi-bo')}
                className="w-full text-left py-1 text-[#64748b] hover:text-[#d92525] flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d92525]" />
                <span>Tin nội bộ</span>
              </button>
            </div>
          </div>

          {/* Divider between Resources and Connection */}
          <div className="border-t border-[#f1f5f9] my-1"></div>

          <button
            onClick={() => handleNavClick('tuyen-dung')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] font-bold flex items-center justify-between transition-all ${
              currentTab === 'tuyen-dung' ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs' : 'text-[#3f4850] hover:bg-[#f1f5f9]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#006194]">badge</span>
              <span>Tuyển dụng kỹ sư y sinh</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#94a3b8]">chevron_right</span>
          </button>
          <button
            onClick={() => handleNavClick('lien-he')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[14px] font-bold flex items-center gap-2.5 transition-all ${
              currentTab === 'lien-he'
                ? 'bg-linear-to-b from-white to-[#e0f2fe] text-[#006194] border border-[#bae6fd] shadow-xs'
                : 'text-[#3f4850] hover:bg-[#f1f5f9]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#006194]">contact_support</span>
            <span>Liên hệ & Báo giá</span>
          </button>
          <div className="pt-2 border-t border-[#f1f5f9]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-2.5 rounded-xl btn-3d-red text-white text-[14px] font-bold text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">headset_mic</span>
              <span>Tư vấn ngay</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
