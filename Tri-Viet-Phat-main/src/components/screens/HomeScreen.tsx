import React, { useState, useMemo } from 'react';
import {
  COMPANY_INFO,
  CORE_VALUES,
  BUSINESS_AREAS,
  PRODUCTS,
  PARTNERS,
  ARTICLES,
} from '../../data/mockData';
import { Product, Article, PageTab } from '../../types';
import { ContactPillButtons } from '../ContactPillButtons';
import { ProvinceSelect } from '../ProvinceSelect';

interface HomeScreenProps {
  onSelectProduct: (product: Product) => void;
  onSelectArticle: (article: Article) => void;
  onNavigateTab: (tab: PageTab, categoryFilter?: string) => void;
  onOpenConsultation: (prefilledProduct?: string) => void;
}

const HERO_SLIDES = [
  {
    image: COMPANY_INFO.heroImage,
    title: 'Phòng Xét Nghiệm Công Nghệ Cao Trí Việt Phát',
    subTitle: 'Đạt chuẩn ISO 13485 & CE IVD Quốc Tế',
    tag: 'Tiêu chuẩn quốc tế',
    badgeIcon: 'verified_user',
  },
  {
    image: COMPANY_INFO.aboutImage,
    title: 'Đội Ngũ Kỹ Sư Y Sinh Chuyên Môn Cao',
    subTitle: 'Đào tạo chính hãng từ nước ngoài, hỗ trợ kỹ thuật 24/7',
    tag: 'Chuyển giao công nghệ',
    badgeIcon: 'engineering',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKxO6Rz5N9Z0m_Gj0PzZ_gY7Qp8HwS5tWw4N3P1yO7Z4Kx7S9vF_gQ5K3jT7qR_xY4oZ1W_qH6vA0c4mB8dG2xS9vL3aY5kU8c_d4wR_l9yX1eP3zM4vL5nQ6aB1m_Vw9tC2eE3gG4hI5jK6lM7oP8qR',
    title: 'Hệ Thống Phân Tích Huyết Học & Sinh Hóa Tự Động',
    subTitle: 'Tốc độ cao, vận hành bền bỉ, kết quả chính xác tuyệt đối',
    tag: 'Thiết bị chính hãng',
    badgeIcon: 'biotech',
  },
];

const CORE_CATEGORIES = [
  {
    key: 'may-xet-nghiem-huyet-hoc',
    title: 'Máy Xét Nghiệm Huyết Học',
    desc: 'Hệ thống huyết học tự động 3-part & 5-part laser',
    models: 'Dirui BF-6800, BCC-3000B, Rayto RT-7600...',
    icon: 'bloodtype',
    count: '12+ Thiết bị',
    iconColor: 'text-[#bb0112]',
    iconBg: 'bg-[#fee2e2]',
    borderColor: 'hover:border-[#bb0112]/40',
  },
  {
    key: 'may-xet-nghiem-sinh-hoa',
    title: 'Máy Xét Nghiệm Sinh Hóa',
    desc: 'Hệ thống sinh hóa tự động tốc độ cao & bán tự động',
    models: 'Dirui CS-T240, CS-600B, CS-1200, RT-1904C...',
    icon: 'biotech',
    count: '10+ Thiết bị',
    iconColor: 'text-[#006194]',
    iconBg: 'bg-[#e0f2fe]',
    borderColor: 'hover:border-[#006194]/40',
  },
  {
    key: 'may-xet-nghiem-nuoc-tieu',
    title: 'Máy Phân Tích Nước Tiểu',
    desc: 'Máy đọc que 10-14 thông số và hệ thống soi cặn tự động',
    models: 'Dirui H-100, H-500, FUS-2000, Que thử 10/11/14P...',
    icon: 'water_drop',
    count: '8+ Dòng máy & Que',
    iconColor: 'text-[#0284c7]',
    iconBg: 'bg-[#e0f2fe]',
    borderColor: 'hover:border-[#0284c7]/40',
  },
  {
    key: 'may-xet-nghiem-dien-giai',
    title: 'Máy Xét Nghiệm Điện Giải',
    desc: 'Đo điện giải đồ trực tiếp ISE (Na+, K+, Cl-, Ca++, pH)',
    models: 'Convergent ISE, Audicom AC9800, Rayto RT-7200...',
    icon: 'bolt',
    count: '6+ Thiết bị',
    iconColor: 'text-[#7c3aed]',
    iconBg: 'bg-[#ede9fe]',
    borderColor: 'hover:border-[#7c3aed]/40',
  },
  {
    key: 'may-xet-nghiem-mien-dich',
    title: 'Miễn Dịch & Đông Máu',
    desc: 'Máy miễn dịch huỳnh quang và phân tích đông máu tự động',
    models: 'Wondfo Finecare, EKF Quo-Test, Rayto RAC-050...',
    icon: 'vaccines',
    count: '8+ Dòng máy',
    iconColor: 'text-[#e11d48]',
    iconBg: 'bg-[#ffe4e6]',
    borderColor: 'hover:border-[#e11d48]/40',
  },
  {
    key: 'hoa-chat-xet-nghiem',
    title: 'Hóa Chất & Tiêu Hao IVD',
    desc: 'Thuốc thử sinh hóa, hóa chất huyết học, vật tư phòng Lab',
    models: 'Dewei, Dirui, Chema Diagnostica, Cuvette, Kim lấy mẫu...',
    icon: 'science',
    count: '30+ Hóa chất',
    iconColor: 'text-[#059669]',
    iconBg: 'bg-[#d1fae5]',
    borderColor: 'hover:border-[#059669]/40',
  },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'may-xet-nghiem-huyet-hoc', label: 'Huyết học' },
  { key: 'may-xet-nghiem-sinh-hoa', label: 'Sinh hóa' },
  { key: 'may-xet-nghiem-nuoc-tieu', label: 'Nước tiểu' },
  { key: 'may-xet-nghiem-dien-giai', label: 'Điện giải' },
  { key: 'hoa-chat-xet-nghiem', label: 'Hóa chất & Thuốc thử' },
];

const CONSULTATION_QUICK_CHIPS = [
  'Máy xét nghiệm huyết học',
  'Máy xét nghiệm sinh hóa',
  'Máy phân tích nước tiểu',
  'Máy đo điện giải đồ',
  'Hóa chất huyết học Dewei',
  'Cấu hình hồ sơ thầu',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectProduct,
  onSelectArticle,
  onNavigateTab,
  onOpenConsultation,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [featuredCategory, setFeaturedCategory] = useState('all');

  // Home Consultation Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formProvince, setFormProvince] = useState('Hà Nội');
  const [formNote, setFormNote] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormNote('');
    }, 4000);
  };

  const handleAddQuickChip = (chipText: string) => {
    setFormNote((prev) => {
      if (!prev.trim()) {
        return `Quan tâm tư vấn & báo giá: ${chipText}`;
      }
      if (prev.includes(chipText)) {
        return prev;
      }
      return `${prev}, ${chipText}`;
    });
  };

  const filteredFeaturedProducts = useMemo(() => {
    if (featuredCategory === 'all') {
      return PRODUCTS.slice(0, 8);
    }
    const filtered = PRODUCTS.filter((p) => p.category === featuredCategory);
    return filtered.length > 0 ? filtered.slice(0, 8) : PRODUCTS.slice(0, 8);
  }, [featuredCategory]);

  const currentHeroSlide = HERO_SLIDES[activeSlide] || HERO_SLIDES[0];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="flex flex-col w-full">
      {/* ========================================================================= */}
      {/* 1. HERO SLIDER & BANNER SHOWCASE WITH 3D DEPTH SCENE */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-hero-3d-scene border-b border-[#e2e8f0]">
        {/* Subtle 3D background grid & ambient optical glow */}
        <div className="absolute inset-0 bg-medical-grid-3d opacity-30 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#006194]/10 blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#bb0112]/5 blur-3xl pointer-events-none animate-pulse-slow"></div>

        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 w-full py-6 sm:py-8 lg:py-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Column: Heading, Trust Badges, Slogan & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-3 sm:space-y-4">
              {/* Trust Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#075985] text-[12px] font-bold tracking-wide shadow-xs border border-[#bae6fd]">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping"></span>
                <span className="material-symbols-outlined text-[16px] text-[#006194]">verified</span>
                <span>Đại diện phân phối chính thức tại Việt Nam</span>
              </div>

              {/* Company Title */}
              <h1 className="text-[26px] sm:text-[34px] lg:text-[38px] xl:text-[42px] font-black text-[#006194] tracking-tight leading-tight uppercase font-sans drop-shadow-xs">
                <span className="inline-block">
                  <span className="whitespace-nowrap">CÔNG TY TNHH</span>{' '}
                  <span className="whitespace-nowrap">THIẾT BỊ Y TẾ</span>
                </span>{' '}
                <br className="hidden sm:inline" />
                <span className="inline-block whitespace-nowrap text-[#0f172a]">TRÍ VIỆT PHÁT</span>
              </h1>

              {/* Slogan with 3D Left Accent Bar */}
              <div className="relative pl-4 py-1">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full bg-gradient-to-b from-[#e11d48] to-[#bb0112] shadow-sm"></div>
                <p className="text-[17px] sm:text-[20px] text-[#bb0112] font-bold italic [text-wrap:balance]">
                  {COMPANY_INFO.slogan}
                </p>
              </div>

              {/* Executive Summary */}
              <p className="text-[14px] sm:text-[15.5px] text-[#334155] max-w-3xl leading-relaxed">
                {COMPANY_INFO.summary}
              </p>

              {/* Contact Pill Action Buttons (Hotline, Zalo, Báo giá) */}
              <ContactPillButtons
                onOpenConsultation={() => onOpenConsultation()}
                className="pt-1"
              />

              {/* 3D Glass Metric Pedestals (High Legibility & Tactile Depth) */}
              <div className="pt-2 grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-xl">
                {/* Metric 1 */}
                <div className="card-3d-subtle p-3 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left bg-linear-to-b from-white to-[#f0f7fc] border border-[#bae6fd]/70 shadow-xs">
                  <div className="flex items-center gap-1.5 text-[#006194] mb-0.5">
                    <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                    <span className="text-[20px] sm:text-[24px] font-black">{COMPANY_INFO.yearsOfExperience}</span>
                  </div>
                  <span className="text-[11.5px] font-bold text-[#334155] leading-tight">
                    Năm kinh nghiệm y tế
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="card-3d-subtle p-3 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left bg-linear-to-b from-white to-[#f0fdf4] border border-[#bbf7d0]/70 shadow-xs">
                  <div className="flex items-center gap-1.5 text-[#15803d] mb-0.5">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                    <span className="text-[20px] sm:text-[24px] font-black">{COMPANY_INFO.genuineReagents}</span>
                  </div>
                  <span className="text-[11.5px] font-bold text-[#334155] leading-tight">
                    Hóa chất chính hãng
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="card-3d-subtle p-3 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left bg-linear-to-b from-white to-[#fef2f2] border border-[#fecaca]/70 shadow-xs">
                  <div className="flex items-center gap-1.5 text-[#bb0112] mb-0.5">
                    <span className="material-symbols-outlined text-[20px]">public</span>
                    <span className="text-[20px] sm:text-[24px] font-black">{COMPANY_INFO.provincesCovered}</span>
                  </div>
                  <span className="text-[11.5px] font-bold text-[#334155] leading-tight">
                    Tỉnh thành phục vụ
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Hero Visual Showcase */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative w-full rounded-3xl overflow-hidden card-3d p-2.5 bg-white border border-[#cbd5e1]/80 shadow-[0_20px_50px_rgba(0,97,148,0.18)]">
                <div className="relative w-full h-64 sm:h-72 lg:h-[350px] xl:h-[380px] rounded-2xl overflow-hidden group">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    alt={currentHeroSlide.title}
                    src={currentHeroSlide.image}
                  />

                  {/* Slider Prev / Next Overlay Buttons */}
                  <button
                    onClick={handlePrevSlide}
                    aria-label="Slide trước"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#0f172a] flex items-center justify-center backdrop-blur-xs shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNextSlide}
                    aria-label="Slide tiếp theo"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#0f172a] flex items-center justify-center backdrop-blur-xs shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Slide indicator dots */}
              <div className="flex justify-center items-center gap-2 mt-3">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx
                        ? 'w-6 bg-[#bb0112]'
                        : 'w-2 bg-[#cbd5e1] hover:bg-[#94a3b8]'
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CORE VALUES BLOCK (3 COLUMNS 3D DEEP MEDICAL BLUE) */}
      {/* ========================================================================= */}
      <section className="w-full bg-linear-to-b from-[#003865] via-[#004f80] to-[#003d66] text-white py-6 sm:py-7 border-y border-[#006194]/40 shadow-[inset_0_4px_12px_rgba(0,0,0,0.25)] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none"></div>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CORE_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-xs shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:bg-white/[0.13] hover:border-white/30 hover:-translate-y-1 transition-all h-full"
              >
                <div
                  className={`w-12 h-12 shrink-0 rounded-xl ${val.color} flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)]`}
                >
                  <span className="material-symbols-outlined text-[28px]">{val.icon}</span>
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-[17px] font-bold text-white mb-1 whitespace-nowrap">{val.title}</h3>
                  <p className="text-[13px] text-[#cce5ff] leading-relaxed [text-wrap:balance]">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LOGICAL CATEGORY QUICK EXPLORER (DANH MỤC THIẾT BỊ & HÓA CHẤT TRỌNG TÂM) */}
      {/* ========================================================================= */}
      <section className="w-full py-8 sm:py-10 bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12">
          {/* Section Header */}
          <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#006194] bg-[#e0f2fe] px-3 py-1 rounded-full mb-2">
              Hệ Thống Thiết Bị Toàn Diện
            </span>
            <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight uppercase [text-wrap:balance]">
              DANH MỤC THIẾT BỊ & HÓA CHẤT TRỌNG TÂM
            </h2>
            <div className="w-14 h-1 bg-[#bb0112] rounded-full mt-2"></div>
            <p className="text-[13.5px] text-[#475569] max-w-2xl mt-2 [text-wrap:balance]">
              Giải pháp khép kín cho phòng xét nghiệm: Từ máy phân tích tự động chuẩn mực đến hóa chất, chất chuẩn và vật tư tiêu hao chính hãng.
            </p>
          </div>

          {/* 6 Bento 3D Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                onClick={() => onNavigateTab('san-pham', cat.key)}
                className={`card-3d rounded-2xl p-5 cursor-pointer flex flex-col justify-between group transition-all duration-300 border ${cat.borderColor}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                    </div>
                    <span className="text-[11.5px] font-bold text-[#475569] bg-[#f1f5f9] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold text-[#0f172a] group-hover:text-[#006194] transition-colors mb-1.5">
                    {cat.title}
                  </h3>

                  <p className="text-[13px] text-[#475569] leading-relaxed mb-3">
                    {cat.desc}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]/80 text-[11.5px] text-[#64748b]">
                    <strong className="text-[#334155]">Tiêu biểu:</strong> {cat.models}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f1f5f9] flex items-center justify-between text-[#006194] text-[13px] font-bold group-hover:text-[#bb0112] transition-colors">
                  <span>Xem chi tiết danh mục</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED PRODUCTS (SẢN PHẨM TIÊU BIỂU WITH IN-PLACE FILTER) */}
      {/* ========================================================================= */}
      <section className="w-full py-8 sm:py-10 bg-medical-grid-3d border-b border-[#e2e8f0]" id="featured-products">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12">
          {/* Section Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#bb0112] bg-[#fee2e2] px-3 py-1 rounded-full mb-2">
              Sẵn Kho Hà Nội & Toàn Quốc
            </span>
            <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight uppercase [text-wrap:balance]">
              SẢN PHẨM TIÊU BIỂU
            </h2>
            <div className="w-14 h-1 bg-[#bb0112] rounded-full mt-2"></div>
            <p className="text-[13.5px] text-[#475569] max-w-2xl mt-2 [text-wrap:balance]">
              Các thiết bị chẩn đoán lâm sàng và hóa chất xét nghiệm đạt tiêu chuẩn quốc tế được ưa chuộng hàng đầu.
            </p>
          </div>

          {/* In-Place Category Filter Bar (Intuitive & Logical) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = featuredCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setFeaturedCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'btn-3d-blue text-white'
                      : 'card-3d-subtle bg-white text-[#475569] hover:text-[#006194] hover:bg-[#f8fafc]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Products Grid - Top 8 featured products with 3D Depth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {filteredFeaturedProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col h-full card-3d rounded-2xl overflow-hidden group"
              >
                <div className="relative bg-linear-to-b from-[#f8fafc] to-[#f1f5f9] p-6 flex items-center justify-center h-56 shrink-0 border-b border-[#e2e8f0]/80">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,97,148,0.04),transparent_70%)] pointer-events-none"></div>
                  <img
                    className="max-h-44 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    alt={prod.alt}
                    src={prod.image}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[#006194] text-[10.5px] font-bold shadow-2xs border border-[#bae6fd]">
                    Chính hãng 100%
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="bg-[#e0f2fe] text-[#075985] text-[11px] px-2.5 py-0.5 rounded-lg font-bold truncate max-w-[65%] shadow-xs border border-[#bae6fd]">
                        {prod.categoryLabel}
                      </span>
                      {prod.brand && (
                        <span className="text-[11px] text-[#64748b] font-medium truncate max-w-[32%] text-right" title={prod.brand}>
                          {prod.brand.replace(' INDUSTRIAL CO., LTD', '')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[15px] font-bold text-[#0f172a] line-clamp-2 mb-2 group-hover:text-[#006194] transition-colors leading-snug h-[44px] flex items-start">
                      {prod.name}
                    </h3>
                    <p className="text-[12.5px] text-[#475569] line-clamp-2 mb-4 leading-relaxed h-[38px]">
                      {prod.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#f1f5f9] mt-auto">
                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl btn-3d-red text-[13px] font-bold tracking-wide cursor-pointer"
                    >
                      <span>XEM CHI TIẾT</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                    <button
                      onClick={() => onOpenConsultation(prod.name)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-linear-to-b from-[#f0f9ff] to-[#e0f2fe] hover:from-[#e0f2fe] hover:to-[#bae6fd] text-[#006194] border border-[#bae6fd] text-[12.5px] font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">request_quote</span>
                      <span>Nhận báo giá</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigateTab('san-pham')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-3d-blue text-[14px] font-bold tracking-wide cursor-pointer"
            >
              <span>XEM TOÀN BỘ KHO THIẾT BỊ & HÓA CHẤT (25+)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ABOUT US & 4-PILLAR TECHNICAL CAPACITY (VỀ CHÚNG TÔI & NĂNG LỰC) */}
      {/* ========================================================================= */}
      <section className="w-full py-8 sm:py-10 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12">
          {/* Section Header */}
          <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#006194] bg-[#e0f2fe] px-3 py-1 rounded-full mb-2">
              16 Năm Phát Triển Bền Vững
            </span>
            <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight uppercase">
              VỀ CHÚNG TÔI & NĂNG LỰC KỸ THUẬT
            </h2>
            <div className="w-14 h-1 bg-[#bb0112] rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Visual Column with 3D Depth Card */}
            <div className="lg:col-span-5 flex flex-col h-full">
              <div className="relative rounded-3xl overflow-hidden card-3d bg-white border border-[#cbd5e1] h-full min-h-[400px] flex flex-col p-2.5">
                <div className="relative w-full h-full flex-1 rounded-2xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover min-h-[380px]"
                    alt="Kỹ sư y sinh Trí Việt Phát"
                    src={COMPANY_INFO.aboutImage}
                  />
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent text-white">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#93ccff]">
                      Chứng nhận năng lực
                    </span>
                    <p className="text-[17px] font-bold mt-1">
                      Đội ngũ kỹ sư y sinh được đào tạo chính hãng từ nước ngoài
                    </p>
                    <p className="text-[12.5px] text-[#cce5ff] mt-1.5">
                      Cam kết có mặt hỗ trợ kỹ thuật tại chỗ trong vòng 2 - 4 giờ tại Hà Nội & các tỉnh lân cận.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info & 4-Pillar Column */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0]">
                <p className="text-[15px] text-[#0f172a] leading-relaxed">
                  <strong className="text-[#006194] font-bold">
                    Công ty TNHH Thương Mại Dịch Vụ <span className="whitespace-nowrap">Trí Việt Phát</span>
                  </strong>{' '}
                  được thành lập theo Quyết định số{' '}
                  <strong className="text-[#bb0112] font-bold">{COMPANY_INFO.licenseNo}</strong> của{' '}
                  {COMPANY_INFO.licensedBy}, tự hào là đối tác chiến lược tin cậy của hàng trăm bệnh viện đa khoa, trung tâm y tế dự phòng và phòng khám tiêu chuẩn trên toàn quốc.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl card-3d-subtle bg-white border border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] text-[#006194] flex items-center justify-center mb-2.5">
                    <span className="material-symbols-outlined text-[22px]">engineering</span>
                  </div>
                  <h4 className="text-[14.5px] font-bold text-[#0f172a] mb-1">
                    Kỹ Sư Y Sinh Chuyên Sâu
                  </h4>
                  <p className="text-[12.5px] text-[#475569] leading-relaxed">
                    100% kỹ sư được đào tạo trực tiếp từ hãng sản xuất, có chứng chỉ bảo trì hệ thống IVD.
                  </p>
                </div>

                <div className="p-4 rounded-2xl card-3d-subtle bg-white border border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-xl bg-[#fee2e2] text-[#bb0112] flex items-center justify-center mb-2.5">
                    <span className="material-symbols-outlined text-[22px]">verified_user</span>
                  </div>
                  <h4 className="text-[14.5px] font-bold text-[#0f172a] mb-1">
                    100% Đầy Đủ CO / CQ
                  </h4>
                  <p className="text-[12.5px] text-[#475569] leading-relaxed">
                    Thiết bị và hóa chất có đầy đủ giấy phép nhập khẩu, phân loại và công bố tiêu chuẩn Bộ Y Tế.
                  </p>
                </div>

                <div className="p-4 rounded-2xl card-3d-subtle bg-white border border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center mb-2.5">
                    <span className="material-symbols-outlined text-[22px]">school</span>
                  </div>
                  <h4 className="text-[14.5px] font-bold text-[#0f172a] mb-1">
                    Đào Tạo & Chuyển Giao Tận Nơi
                  </h4>
                  <p className="text-[12.5px] text-[#475569] leading-relaxed">
                    Lắp đặt hoàn thiện, chạy mẫu thử đối chứng và hướng dẫn kỹ thuật viên lab vận hành thành thạo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl card-3d-subtle bg-white border border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-xl bg-[#d1fae5] text-[#059669] flex items-center justify-center mb-2.5">
                    <span className="material-symbols-outlined text-[22px]">support_agent</span>
                  </div>
                  <h4 className="text-[14.5px] font-bold text-[#0f172a] mb-1">
                    Bảo Trì & Hỗ Trợ 24/7
                  </h4>
                  <p className="text-[12.5px] text-[#475569] leading-relaxed">
                    Sẵn sàng linh kiện thay thế và hóa chất dự phòng, đảm bảo phòng xét nghiệm không bị gián đoạn.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('gioi-thieu')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-3d-blue text-white text-[13.5px] font-bold tracking-wide cursor-pointer"
                >
                  <span>TÌM HIỂU CHI TIẾT VỀ CÔNG TY</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PARTNERS & BRANDS (ĐỐI TÁC CỦA CHÚNG TÔI) */}
      {/* ========================================================================= */}
      <section className="w-full py-8 sm:py-10 bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12">
          <div className="flex flex-col items-center mb-6 text-center">
            <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0f172a] tracking-tight uppercase [text-wrap:balance]">
              ĐỐI TÁC CHIẾN LƯỢC TOÀN CẦU
            </h2>
            <div className="w-14 h-1 bg-[#bb0112] rounded-full mt-2"></div>
            <p className="text-[13px] text-[#475569] mt-2">
              Hợp tác chặt chẽ cùng các tập đoàn công nghệ y tế và chẩn đoán IVD uy tín thế giới
            </p>
          </div>

          {/* Partner Logo Badges with 3D tactile elevation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
            {PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl card-3d-subtle bg-white flex flex-col items-center justify-center h-22 text-center group hover:border-[#006194]/40"
              >
                {partner.name === 'DIRUI' && (
                  <span className="text-[19px] font-black text-[#bb0112] tracking-wider group-hover:scale-105 transition-transform">
                    DIRUI
                  </span>
                )}
                {partner.name === 'CHEMA' && (
                  <span className="text-[13px] font-bold text-[#475569] tracking-tight group-hover:scale-105 transition-transform">
                    CHEMA <span className="font-normal text-[10px] block text-[#006194]">DIAGNOSTICA</span>
                  </span>
                )}
                {partner.name === 'Wondfo' && (
                  <span className="text-[19px] font-bold text-[#006194] tracking-tight group-hover:scale-105 transition-transform">
                    Wondfo
                  </span>
                )}
                {partner.name === 'EKF' && (
                  <span className="text-[14px] font-black text-[#bb0112] tracking-widest bg-[#ffdad6] px-2.5 py-0.5 rounded shadow-2xs group-hover:scale-105 transition-transform">
                    EKF
                  </span>
                )}
                {partner.name === 'Drawray' && (
                  <span className="text-[16px] font-bold text-[#006194] tracking-wide group-hover:scale-105 transition-transform">
                    Drawray
                  </span>
                )}
                {partner.name === 'AUDICOM' && (
                  <span className="text-[15px] font-bold text-[#075985] tracking-wide group-hover:scale-105 transition-transform">
                    AUDICOM
                  </span>
                )}
                {partner.name === 'Convergent' && (
                  <span className="text-[12px] font-semibold text-[#0f172a] tracking-tighter group-hover:scale-105 transition-transform">
                    Convergent <span className="text-[10px] block font-normal text-[#475569]">Technologies</span>
                  </span>
                )}
                {partner.name === 'dewei 德威' && (
                  <span className="text-[15px] font-bold text-[#006194] tracking-wide group-hover:scale-105 transition-transform">
                    dewei 德威
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CONSULTATION FORM SECTION (ĐĂNG KÝ TƯ VẤN & BÁO GIÁ DỰ THẦU) */}
      {/* ========================================================================= */}
      <section className="w-full relative overflow-hidden" id="tu-van-form">
        <div
          className="relative w-full bg-cover bg-center py-10 sm:py-12 lg:py-14"
          style={{ backgroundImage: `url('${COMPANY_INFO.formBgImage}')` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#002747]/96 via-[#003865]/92 to-[#0f172a]/94 backdrop-blur-[4px]"></div>
          <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Callout & Assurance Guarantees */}
              <div className="lg:col-span-5 text-[#eaf1ff]">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-linear-to-r from-[#dc2626] to-[#b91c1c] text-white text-[12px] font-bold uppercase tracking-wider mb-3 shadow-md">
                  <span className="material-symbols-outlined text-[15px]">headset_mic</span>
                  <span>Tư Vấn Chuyên Sâu 24/7</span>
                </span>
                <h2 className="text-[26px] sm:text-[32px] font-extrabold mb-3 leading-tight [text-wrap:balance]">
                  Đăng Ký Tư Vấn & Báo Giá Thiết Bị Y Tế
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[#dae2fd] mb-6 leading-relaxed [text-wrap:balance]">
                  Quý bệnh viện, phòng khám hoặc đơn vị dự thầu vui lòng gửi thông tin yêu cầu. Kỹ sư chuyên môn của Trí Việt Phát sẽ liên hệ phản hồi ngay trong 15 phút.
                </p>

                {/* 3 Trust Guarantees */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.08] border border-white/12 backdrop-blur-xs">
                    <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">timer</span>
                    <span className="text-[13px] text-white font-medium">Phản hồi và gửi cấu hình kỹ thuật trong 15 phút</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.08] border border-white/12 backdrop-blur-xs">
                    <span className="material-symbols-outlined text-[#4ade80] text-[22px]">verified</span>
                    <span className="text-[13px] text-white font-medium">Báo giá cạnh tranh trực tiếp từ đại diện phân phối chính hãng</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.08] border border-white/12 backdrop-blur-xs">
                    <span className="material-symbols-outlined text-[#f43f5e] text-[22px]">description</span>
                    <span className="text-[13px] text-white font-medium">Hỗ trợ đầy đủ hồ sơ pháp lý, catalog và thông số dự thầu</span>
                  </div>
                </div>

                {/* Fast Hotline Contact */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.08] border border-white/15">
                  <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#0284c7] to-[#004f80] flex items-center justify-center text-white shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#93c5fd]">Hotline kỹ sư thường trực:</div>
                    <div className="text-[19px] font-bold text-white tracking-wide">
                      {COMPANY_INFO.hotline}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Container (3D Frosted Glass Panel) */}
              <div className="lg:col-span-7">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.9)_inset] border border-white/80">
                  {formSubmitted ? (
                    <div className="text-center py-10 space-y-4 animate-in fade-in">
                      <div className="w-16 h-16 rounded-full bg-[#e0f2fe] text-[#006194] flex items-center justify-center mx-auto shadow-inner">
                        <span className="material-symbols-outlined text-[36px]">verified</span>
                      </div>
                      <h3 className="text-[20px] font-bold text-[#0f172a]">
                        Đã tiếp nhận yêu cầu thành công!
                      </h3>
                      <p className="text-[14px] text-[#475569] max-w-md mx-auto">
                        Kỹ sư phụ trách khu vực <strong>{formProvince}</strong> sẽ liên hệ ngay với anh/chị qua số điện thoại <strong>{formPhone}</strong> để gửi bảng báo giá kèm ưu đãi tốt nhất.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {/* Quick chips to select device type */}
                      <div>
                        <span className="block text-[12px] font-bold text-[#0f172a] mb-2">
                          Chọn nhanh thiết bị hoặc hóa chất cần báo giá:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {CONSULTATION_QUICK_CHIPS.map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAddQuickChip(chip)}
                              className="text-[11.5px] font-semibold px-2.5 py-1 rounded-lg bg-[#f1f5f9] hover:bg-[#e0f2fe] text-[#334155] hover:text-[#006194] border border-[#e2e8f0] transition-colors cursor-pointer active:scale-95"
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-bold text-[#0f172a] mb-1.5">
                            Họ tên / Đơn vị <span className="text-[#bb0112]">*</span>
                          </label>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#475569] text-[20px]">
                              person
                            </span>
                            <input
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#f1f5f9] text-[13.5px] text-[#0f172a] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006194] border border-[#e2e8f0]/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                              placeholder="Họ và tên hoặc tên phòng khám"
                              type="text"
                              required
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#0f172a] mb-1.5">
                            Số điện thoại <span className="text-[#bb0112]">*</span>
                          </label>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#475569] text-[20px]">
                              call
                            </span>
                            <input
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#f1f5f9] text-[13.5px] text-[#0f172a] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006194] border border-[#e2e8f0]/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                              placeholder="Số điện thoại liên hệ"
                              required
                              type="tel"
                              value={formPhone}
                              onChange={(e) => setFormPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-bold text-[#0f172a] mb-1.5">
                            Địa chỉ email
                          </label>
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#475569] text-[20px]">
                              mail
                            </span>
                            <input
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#f1f5f9] text-[13.5px] text-[#0f172a] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006194] border border-[#e2e8f0]/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                              placeholder="Email nhận báo giá"
                              type="email"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-[#0f172a] mb-1.5">
                            Khu vực tỉnh/thành phố <span className="text-[#bb0112]">*</span>
                          </label>
                          <ProvinceSelect
                            value={formProvince}
                            onChange={(val) => setFormProvince(val)}
                            variant="light"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-[#0f172a] mb-1.5">
                          Nội dung quan tâm / Thiết bị cần báo giá
                        </label>
                        <textarea
                          className="w-full p-3 rounded-xl bg-[#f1f5f9] text-[13.5px] text-[#0f172a] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006194] border border-[#e2e8f0]/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
                          placeholder="Ví dụ: Cần tư vấn lắp đặt máy xét nghiệm điện giải và bảng giá hóa chất huyết học Dewei..."
                          rows={3}
                          value={formNote}
                          onChange={(e) => setFormNote(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="pt-2">
                        <button
                          className="w-full py-3.5 rounded-xl btn-3d-red text-[15px] font-bold tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                          type="submit"
                        >
                          <span className="material-symbols-outlined text-[20px]">send</span>
                          <span>GỬI YÊU CẦU BÁO GIÁ NGAY</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. NEWS & EVENTS SECTION (TIN TỨC SỰ KIỆN Y TẾ) */}
      {/* ========================================================================= */}
      <section className="w-full py-8 sm:py-10 bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12">
          <div className="flex flex-col items-center mb-6 text-center">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#006194] bg-[#e0f2fe] px-3 py-1 rounded-full mb-2">
              Bản Tin Y Khoa
            </span>
            <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight uppercase [text-wrap:balance]">
              TIN TỨC & HƯỚNG DẪN KỸ THUẬT
            </h2>
            <div className="w-14 h-1 bg-[#bb0112] rounded-full mt-2"></div>
          </div>

          {/* Articles Grid (6 articles faithfully matching snapshot with 3D depth) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {ARTICLES.map((art) => (
              <div
                key={art.id}
                className="flex flex-col h-full card-3d rounded-2xl overflow-hidden group"
              >
                <div className="relative h-48 shrink-0 overflow-hidden bg-linear-to-b from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0]/80">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={art.alt}
                    src={art.image}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[#006194] text-[11px] font-bold shadow-xs border border-white">
                    {art.category || 'Tin y tế'}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[#475569] text-[12px] font-medium mb-2">
                      <span className="material-symbols-outlined text-[16px] text-[#bb0112]">
                        calendar_today
                      </span>
                      <span>{art.date}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#0f172a] line-clamp-2 mb-2 group-hover:text-[#006194] transition-colors leading-snug h-[44px] flex items-start">
                      {art.title}
                    </h3>
                    <p className="text-[12.5px] text-[#475569] line-clamp-3 mb-4 leading-relaxed h-[58px]">
                      {art.excerpt}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectArticle(art)}
                    className="inline-flex items-center gap-1.5 text-[#006194] text-[13px] font-bold hover:text-[#0369a1] text-left cursor-pointer mt-auto pt-2 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Đọc tiếp</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigateTab('tin-tuc')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white hover:bg-[#f1f5f9] text-[#006194] border-2 border-[#006194] text-[14px] font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>XEM THÊM CÁC BÀI VIẾT KHÁC</span>
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FAST BOTTOM CONTACT STRIP WITH 3D BEVEL */}
      {/* ========================================================================= */}
      <section className="w-full bg-linear-to-r from-[#003d66] via-[#00517d] to-[#003865] text-white py-5 sm:py-6 border-t border-[#006194]/40 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#e11d2a] to-[#990a16] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(225,29,42,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]">
              <span className="material-symbols-outlined text-[28px]">support_agent</span>
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-white whitespace-nowrap">
                Cần cấu hình hoặc bảng báo giá dự thầu thiết bị y tế?
              </h4>
              <p className="text-[13px] text-[#cce5ff] [text-wrap:balance]">
                Kỹ sư y sinh của chúng tôi sẵn sàng giải đáp kỹ thuật và gửi bảng báo giá chi tiết trong 15 phút.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => onOpenConsultation()}
              className="px-6 py-3 rounded-xl btn-3d-red text-white font-bold text-[14px] cursor-pointer shrink-0 inline-flex items-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">request_quote</span>
              <span>Yêu cầu tư vấn & Báo giá</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
