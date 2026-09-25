import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { COMPANY_INFO, PRODUCTS, PARTNERS, TESTIMONIALS } from '../../data/mockData';
import { REAL_NEWS_ARTICLES, NEWS_CATEGORY_LABELS, SiteArticle } from '../../data/realSiteContent';
import { Product, PageTab } from '../../types';
import { ProvinceSelect } from '../ProvinceSelect';
import { brandOf } from '../../seo/brands';
import { navLink } from '../../seo/navLink';
import { sendLead } from '../../lib/sendLead';
import { TestimonialsCarousel } from '../TestimonialsCarousel';
import { HeroSection } from '../HeroSection';
import { ProductCardsSection } from '../ProductCardsSection';
import { SectionHeader, ViewAllButton } from '../SectionHeader';
import { ProductCard } from '../ProductCard';
import { Tilt } from '../motion/Tilt';
import { Reveal, RevealGroup, RevealItem, WipeImage, CountUp, MaskText, ParallaxImage, AmbientGlow } from '../motion/Reveal';

interface HomeScreenProps {
  onSelectProduct: (product: Product) => void;
  onSelectArticle: (article: SiteArticle) => void;
  onNavigateTab: (tab: PageTab, categoryFilter?: string) => void;
  onSelectBrand: (slug: string) => void;
  onOpenConsultation: (prefilledProduct?: string) => void;
  onOpenRepairService: () => void;
}

const CATEGORY_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'may-xet-nghiem-huyet-hoc', label: 'Huyết học' },
  { key: 'may-xet-nghiem-sinh-hoa', label: 'Sinh hóa' },
  { key: 'may-xet-nghiem-nuoc-tieu', label: 'Nước tiểu' },
  { key: 'may-xet-nghiem-dien-giai', label: 'Điện giải' },
  { key: 'hoa-chat-xet-nghiem', label: 'Hóa chất' },
];

const CONSULTATION_QUICK_CHIPS = [
  'Máy xét nghiệm huyết học',
  'Máy xét nghiệm sinh hóa',
  'Máy phân tích nước tiểu',
  'Máy đo điện giải đồ',
  'Hóa chất huyết học Dewei',
  'Cấu hình hồ sơ thầu',
];

const FACTS = [
  { to: parseInt(COMPANY_INFO.yearsOfExperience, 10), suffix: '+', label: 'Năm kinh nghiệm', note: 'trong ngành thiết bị y tế' },
  { to: parseInt(COMPANY_INFO.provincesCovered, 10), suffix: '', label: 'Tỉnh thành', note: 'có bệnh viện, phòng khám sử dụng' },
  { to: parseInt(COMPANY_INFO.genuineReagents, 10), suffix: '%', label: 'Chính hãng', note: 'đủ CO/CQ, giấy phép lưu hành' },
  { to: 4, prefix: '2–', suffix: 'h', label: 'Có mặt kỹ thuật', note: 'tại Hà Nội và tỉnh lân cận' },
];

const CATEGORY_WORDS = [
  { label: 'Huyết học', cat: 'may-xet-nghiem-huyet-hoc' },
  { label: 'Sinh hóa', cat: 'may-xet-nghiem-sinh-hoa' },
  { label: 'Nước tiểu', cat: 'may-xet-nghiem-nuoc-tieu' },
  { label: 'Điện giải', cat: 'may-xet-nghiem-dien-giai' },
  { label: 'Miễn dịch', cat: 'may-xet-nghiem-mien-dich' },
  { label: 'Đông máu', cat: 'may-phan-tich-dong-mau' },
  { label: 'Hóa chất IVD', cat: 'hoa-chat-xet-nghiem' },
];

const CAPABILITIES = [
  {
    title: 'Kỹ sư y sinh được hãng đào tạo',
    desc: 'Kỹ sư được đào tạo trực tiếp từ nhà sản xuất, có chứng chỉ bảo trì hệ thống IVD.',
  },
  {
    title: 'Hồ sơ pháp lý đầy đủ',
    desc: 'Thiết bị và hóa chất có giấy phép nhập khẩu, phân loại và công bố tiêu chuẩn Bộ Y tế.',
  },
  {
    title: 'Lắp đặt và chuyển giao tận nơi',
    desc: 'Lắp đặt, chạy mẫu đối chứng và hướng dẫn kỹ thuật viên vận hành thành thạo.',
  },
  {
    title: 'Bảo trì và hỗ trợ 24/7',
    desc: 'Sẵn linh kiện thay thế và hóa chất dự phòng để phòng xét nghiệm không bị gián đoạn.',
  },
];

const FORM_ASSURANCES = [
  'Phản hồi và gửi cấu hình kỹ thuật trong 15 phút làm việc',
  'Báo giá trực tiếp từ đại diện phân phối chính hãng',
  'Hỗ trợ hồ sơ pháp lý, catalog và thông số dự thầu',
];

const INPUT_CLASS =
  'w-full px-3.5 py-2.5 bg-white border border-[#d4d4d4] text-[14px] text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540]';

const LABEL_CLASS = 'block text-[13px] font-medium text-[#333333] mb-1.5';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectProduct,
  onSelectArticle,
  onNavigateTab,
  onSelectBrand,
  onOpenConsultation,
  onOpenRepairService,
}) => {
  const [featuredCategory, setFeaturedCategory] = useState('all');

  // Brands we sell link to their page on this site; the rest open the manufacturer's website
  const partnerLink = (partner: { name: string; url?: string }) => {
    const brand = brandOf(partner.name);
    if (brand) {
      return { ...navLink({ tab: 'san-pham', brand: brand.slug }, () => onSelectBrand(brand.slug)), title: brand.heading };
    }
    return { href: partner.url, target: '_blank', rel: 'noopener noreferrer', title: `Truy cập website ${partner.name}` };
  };

  // Home Consultation Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formProvince, setFormProvince] = useState('Hà Nội');
  const [formNote, setFormNote] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [formError, setFormError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSending(true);
    setFormError('');
    try {
      await sendLead('tu-van', {
        'Họ và tên': formName,
        'Số điện thoại': formPhone,
        Email: formEmail,
        'Tỉnh/Thành': formProvince,
        'Nội dung': formNote,
      });
    } catch (err) {
      setFormError((err as Error).message);
      return;
    } finally {
      setFormSending(false);
    }
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
      return PRODUCTS.slice(0, 10);
    }
    const filtered = PRODUCTS.filter((p) => p.category === featuredCategory);
    return filtered.length > 0 ? filtered.slice(0, 10) : PRODUCTS.slice(0, 10);
  }, [featuredCategory]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <HeroSection onOpenConsultation={onOpenConsultation} />

      {/* 2. Key facts — photo-backed navy band, heading + glass counter cards */}
      <section className="fx-spotlight relative w-full overflow-hidden bg-[#0a2540] text-white">
        <ParallaxImage src="/images/hero-engineers.jpg" alt="Kỹ sư Trí Việt Phát trong phòng thí nghiệm" className="opacity-25" />
        <div className="absolute inset-0 bg-linear-to-br from-[#0a2540]/95 via-[#0a2540]/85 to-[#0b3a66]/80" aria-hidden="true" />
        <AmbientGlow />
        <div className="relative max-w-[1320px] mx-auto px-4 sm:px-8 py-14 sm:py-20">
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-end mb-10 sm:mb-12">
            <div className="lg:col-span-5">
              <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#5cc2ff]">
                <span className="w-8 h-px bg-[#5cc2ff]" aria-hidden="true" />
                Trí Việt Phát
              </p>
              <h2 className="mt-3 text-[26px] sm:text-[34px] font-bold leading-tight">
                <MaskText text="Những con số ấn tượng" />
              </h2>
            </div>
            <p className="lg:col-span-7 text-[15px] sm:text-[16px] text-white/70 leading-relaxed">
              Nhiều năm đồng hành cùng các bệnh viện, trung tâm y tế và phòng khám: thiết bị chính hãng, hồ sơ pháp lý
              đầy đủ và đội ngũ kỹ sư hỗ trợ tận nơi.
            </p>
          </Reveal>

          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {FACTS.map((fact, idx) => (
              <Reveal
                key={fact.label}
                delay={idx * 0.12}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-5 sm:p-7 hover:-translate-y-1.5 hover:bg-white/[0.1] hover:border-[#0a94dc]/60 hover:shadow-[0_20px_50px_-20px_rgba(10,148,220,0.7)] transition-[translate,background-color,border-color,box-shadow] duration-500"
              >
                {/* Accent line that draws in along the top edge */}
                <motion.span
                  className="absolute top-0 left-0 h-[3px] w-full bg-linear-to-r from-[#0a94dc] to-[#e11d2a] origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3 + idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
                <dd className="text-[40px] sm:text-[52px] lg:text-[58px] font-bold leading-none tracking-tight tabular-nums">
                  <CountUp
                    to={fact.to}
                    prefix={fact.prefix}
                    suffix={fact.suffix}
                    suffixClassName="text-[#e11d2a] text-[0.6em] align-top ml-1"
                  />
                </dd>
                <dt className="mt-4 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-[13px] sm:text-[14px] text-white/60 leading-snug">{fact.note}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Product categories */}
      <ProductCardsSection onNavigateTab={onNavigateTab} />

      {/* 4. Featured products — tabs double as the section heading */}
      <section className="relative w-full overflow-hidden py-12 sm:py-16 fx-page-bg" id="featured-products">
        <AmbientGlow light />
        <div className="relative max-w-[1320px] mx-auto px-4 sm:px-8">
          <div
            role="tablist"
            aria-label="Sản phẩm nổi bật theo danh mục"
            className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar mb-8 sm:justify-center"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = featuredCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setFeaturedCategory(cat.key)}
                  className={`shrink-0 pb-2 border-b-2 text-[16px] sm:text-[20px] font-semibold uppercase transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#0a2540] text-[#111111]'
                      : 'border-transparent text-[#999999] hover:text-[#555555]'
                  }`}
                >
                  {cat.key === 'all' ? 'Sản phẩm nổi bật' : cat.label}
                </button>
              );
            })}
          </div>

          <RevealGroup
            replayKey={featuredCategory}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-8 sm:gap-x-4"
          >
            {filteredFeaturedProducts.slice(0, 10).map((prod) => (
              <RevealItem key={prod.id}>
                <ProductCard product={prod} onSelect={onSelectProduct} onRequestQuote={onOpenConsultation} />
              </RevealItem>
            ))}
          </RevealGroup>

          <ViewAllButton label="Xem tất cả sản phẩm" onClick={() => onNavigateTab('san-pham')} />
        </div>
      </section>

      {/* Category word band on black — static, each word links to its product category */}
      <section className="fx-spotlight fx-sweep relative overflow-hidden w-full py-8 sm:py-10 bg-linear-to-r from-[#0a2540] via-[#0b3a66] to-[#0a2540]">
        <RevealGroup className="max-w-[1320px] mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-center gap-x-6 lg:gap-x-5 gap-y-3">
          {CATEGORY_WORDS.map((item, idx) => (
            <RevealItem key={item.cat} className="flex items-center gap-6 lg:gap-5">
              <button
                type="button"
                onClick={() => onNavigateTab('san-pham', item.cat)}
                className={`text-[18px] sm:text-[22px] lg:text-[24px] font-bold uppercase leading-none tracking-tight whitespace-nowrap transition-colors duration-300 hover:text-[#e11d2a] cursor-pointer ${
                  idx % 2 ? 'text-white/35' : 'text-white'
                }`}
              >
                {item.label}
              </button>
              {idx < CATEGORY_WORDS.length - 1 && (
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#e11d2a] shrink-0" aria-hidden="true" />
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 5. About & technical capability — layered photos on the left, numbered capabilities on the right */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
          {/* Photo composition */}
          <div className="lg:col-span-6 relative pb-16 sm:pb-20 pr-10 sm:pr-24">
            <Tilt max={5}>
              <WipeImage
                wrapperClassName="relative bg-[#edf3f8] fx-shine"
                className="w-full aspect-[4/5] object-cover"
                alt="Kỹ thuật viên phòng xét nghiệm làm việc với kính hiển vi"
                src={COMPANY_INFO.aboutImage}
                loading="lazy"
              />
            </Tilt>
            {/* Secondary photo overlapping the bottom-right corner */}
            <Reveal delay={0.35} y={40} className="absolute right-0 bottom-0 w-[46%] border-[6px] sm:border-8 border-white fx-shine group">
              <img
                src="/images/hero-pipette.jpg"
                alt="Thao tác pipet với ống mẫu xét nghiệm"
                loading="lazy"
                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </Reveal>
            {/* Experience badge */}
            <Reveal
              delay={0.55}
              y={20}
              className="absolute left-4 sm:left-6 bottom-8 sm:bottom-12 bg-[#0a2540] text-white px-5 py-4 sm:px-7 sm:py-6"
            >
              <div className="text-[36px] sm:text-[48px] font-bold leading-none tabular-nums">
                <CountUp
                  to={parseInt(COMPANY_INFO.yearsOfExperience, 10)}
                  suffix="+"
                  suffixClassName="text-[#e11d2a] text-[0.6em] align-top ml-0.5"
                />
              </div>
              <div className="mt-2 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-white/80">
                Năm kinh nghiệm
              </div>
            </Reveal>
          </div>

          {/* Copy */}
          <Reveal className="lg:col-span-6" delay={0.15}>
            <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#e11d2a]">
              <span className="w-8 h-px bg-[#e11d2a]" aria-hidden="true" />
              Về Trí Việt Phát
            </p>
            <h2 className="mt-4 text-[30px] sm:text-[40px] font-bold text-[#111111] leading-[1.15] tracking-tight">
              <MaskText text="Đối tác tin cậy của phòng xét nghiệm Việt Nam" />
            </h2>
            <p className="mt-6 text-[16px] sm:text-[17px] text-[#555555] leading-relaxed">
              {COMPANY_INFO.name} được thành lập theo giấy phép số {COMPANY_INFO.licenseNo} của{' '}
              {COMPANY_INFO.licensedBy}. Hơn {COMPANY_INFO.yearsOfExperience.replace('+', '')} năm qua, chúng tôi
              cung ứng thiết bị và hóa chất xét nghiệm cho các bệnh viện đa khoa, trung tâm y tế và phòng khám trên
              toàn quốc.
            </p>

            <ol className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {CAPABILITIES.map((cap, idx) => (
                <li key={cap.title} className="group flex gap-4">
                  <span className="shrink-0 text-[14px] font-bold text-[#e11d2a] tabular-nums pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="pt-0.5 border-t border-[#e5e5e5] group-hover:border-[#0a2540] transition-colors duration-500 flex-1">
                    <h3 className="pt-3 text-[16px] sm:text-[17px] font-semibold text-[#111111]">{cap.title}</h3>
                    <p className="mt-2 text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">{cap.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <button
                type="button"
                onClick={() => onNavigateTab('gioi-thieu')}
                className="btn-primary h-12 px-8 text-[14px] font-semibold uppercase tracking-wide cursor-pointer"
              >
                Tìm hiểu về công ty
              </button>
              <button
                type="button"
                onClick={onOpenRepairService}
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#111111] cursor-pointer"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] group-hover:bg-[length:100%_1px] transition-[background-size] duration-500">
                  Đăng ký bảo trì, sửa chữa
                </span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Partners */}
      <section className="relative w-full overflow-hidden py-14 sm:py-20 fx-page-bg">
        <AmbientGlow light />
        <div className="relative max-w-[1320px] mx-auto px-4 sm:px-8">
          <SectionHeader
            align="center"
            title="Đối tác của chúng tôi"
            description="Trí Việt Phát tự hào là nhà phân phối chính thức sản phẩm của các hãng chẩn đoán IVD hàng đầu thế giới."
          />
          {/* Infinite marquee: the list is rendered twice and slid by -50% */}
          <div className="marquee group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <ul className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
              {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                <li
                  key={`${partner.name}-${idx}`}
                  aria-hidden={idx >= PARTNERS.length}
                  className="w-[200px] sm:w-[250px] shrink-0 px-2.5 sm:px-3 py-4"
                >
                  <a
                    {...partnerLink(partner)}
                    tabIndex={idx >= PARTNERS.length ? -1 : undefined}
                    className="partner-card fx-shine group/partner relative h-24 sm:h-28 rounded-2xl bg-white border border-[#e3ebf3] shadow-[0_4px_14px_rgba(10,37,64,0.06)] flex items-center justify-center px-6 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_22px_40px_-14px_rgba(10,148,220,0.45)] transition-[translate,scale,box-shadow] duration-500 cursor-pointer"
                  >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={`Logo ${partner.name}`}
                      loading="lazy"
                      className="max-h-11 sm:max-h-12 max-w-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <span className="text-[18px] font-semibold text-[#999999]">{partner.name}</span>
                  )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <TestimonialsCarousel testimonials={TESTIMONIALS} />

      {/* 8. Consultation form — dark band over a parallax lab photo; the white form card pops forward */}
      <section className="fx-spotlight relative w-full overflow-hidden py-16 sm:py-24 bg-[#0a2540] text-white" id="tu-van-form">
        <ParallaxImage src="/images/hero-lab-analyzers.jpg" alt="Dãy máy phân tích xét nghiệm tự động" className="opacity-50" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a2540]/95 via-[#0a2540]/75 to-[#0a2540]/30" aria-hidden="true" />
        <div className="relative max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <Reveal className="lg:col-span-5">
            <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#e11d2a]">
              <span className="w-8 h-px bg-[#e11d2a]" aria-hidden="true" />
              Tư vấn miễn phí
            </p>
            <h2 className="mt-4 text-[30px] sm:text-[40px] font-bold leading-[1.15] tracking-tight">
              <MaskText text="Yêu cầu tư vấn và báo giá" />
            </h2>
            <p className="mt-5 text-[16px] text-white/70 leading-relaxed">
              Bệnh viện, phòng khám hoặc đơn vị dự thầu vui lòng gửi thông tin. Kỹ sư phụ trách khu vực sẽ liên hệ lại
              với báo giá và cấu hình phù hợp.
            </p>

            <ul className="mt-7 space-y-3.5">
              {FORM_ASSURANCES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-white/90">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#e11d2a] flex items-center justify-center mt-px">
                    <span className="material-symbols-outlined text-[16px] text-white">check</span>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-9 pt-7 border-t border-white/15 grid grid-cols-2 gap-6 text-[14px]">
              <div>
                <dt className="text-white/50 uppercase tracking-[0.12em] text-[12px]">Hotline</dt>
                <dd className="mt-2 space-y-1">
                  <a
                    href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
                    className="block text-[18px] font-bold text-white hover:text-[#e11d2a] transition-colors"
                  >
                    {COMPANY_INFO.hotline}
                  </a>
                  <a
                    href={`tel:${COMPANY_INFO.hotline2.replace(/\./g, '')}`}
                    className="block text-[18px] font-bold text-white hover:text-[#e11d2a] transition-colors"
                  >
                    {COMPANY_INFO.hotline2}
                  </a>
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-white/50 uppercase tracking-[0.12em] text-[12px]">Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="block font-semibold text-white hover:text-[#e11d2a] transition-colors break-all"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.15}>
            <div className="bg-white text-[#111111] p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              {formSubmitted ? (
                <div className="py-10 text-center" role="status">
                  <span className="material-symbols-outlined text-[40px] text-[#111111]">check_circle</span>
                  <h3 className="mt-3 text-[19px] font-semibold text-[#111111]">Đã tiếp nhận yêu cầu</h3>
                  <p className="mt-2 text-[14px] text-[#555555] max-w-md mx-auto">
                    Kỹ sư phụ trách khu vực <strong>{formProvince}</strong> sẽ liên hệ qua số{' '}
                    <strong>{formPhone}</strong> để gửi báo giá.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div>
                    <span className={LABEL_CLASS}>Chọn nhanh nội dung cần báo giá</span>
                    <div className="flex flex-wrap gap-2">
                      {CONSULTATION_QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleAddQuickChip(chip)}
                          className="text-[13px] px-3 py-1.5 border border-[#d4d4d4] text-[#333333] hover:border-[#0a2540] fx-link transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="home-form-name" className={LABEL_CLASS}>
                        Họ tên / Đơn vị <span className="text-[#e11d2a]">*</span>
                      </label>
                      <input
                        id="home-form-name"
                        className={INPUT_CLASS}
                        placeholder="Họ tên hoặc tên cơ sở y tế"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="home-form-phone" className={LABEL_CLASS}>
                        Số điện thoại <span className="text-[#e11d2a]">*</span>
                      </label>
                      <input
                        id="home-form-phone"
                        className={INPUT_CLASS}
                        placeholder="Số điện thoại liên hệ"
                        required
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="home-form-email" className={LABEL_CLASS}>
                        Email
                      </label>
                      <input
                        id="home-form-email"
                        className={INPUT_CLASS}
                        placeholder="Email nhận báo giá"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <span className={LABEL_CLASS}>
                        Tỉnh/thành phố <span className="text-[#e11d2a]">*</span>
                      </span>
                      <ProvinceSelect
                        value={formProvince}
                        onChange={(val) => setFormProvince(val)}
                        variant="white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="home-form-note" className={LABEL_CLASS}>
                      Nội dung cần tư vấn
                    </label>
                    <textarea
                      id="home-form-note"
                      className={INPUT_CLASS}
                      placeholder="Ví dụ: cần báo giá máy xét nghiệm điện giải và hóa chất huyết học Dewei"
                      rows={3}
                      value={formNote}
                      onChange={(e) => setFormNote(e.target.value)}
                    ></textarea>
                  </div>

                  {formError && (
                    <p role="alert" className="text-[13.5px] font-semibold text-[#e11d2a]">
                      {formError}
                    </p>
                  )}
                  <button
                    className="btn-primary w-full sm:w-auto h-12 px-10 text-[14px] font-semibold uppercase tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                    type="submit"
                    disabled={formSending}
                  >
                    {formSending ? 'Đang gửi...' : 'Gửi yêu cầu'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. News */}
      <section className="w-full py-12 sm:py-16 fx-section-soft">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <SectionHeader align="center" title="Tin tức và hướng dẫn kỹ thuật" description="Cập nhật kiến thức xét nghiệm, hướng dẫn vận hành và bảo trì thiết bị." />

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REAL_NEWS_ARTICLES.slice(0, 3).map((art) => (
              <RevealItem key={art.id} className="h-full">
                <button
                  type="button"
                  onClick={() => onSelectArticle(art)}
                  className="fx-card group flex flex-col h-full w-full text-left cursor-pointer"
                >
                  <div className="relative fx-shine w-full aspect-[16/9] overflow-hidden bg-[#edf3f8]">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      alt={art.title}
                      src={art.image}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide">
                      <span className="px-2.5 py-1 rounded-full bg-[#e6f3fb] text-[#0a2540]">
                        {NEWS_CATEGORY_LABELS[art.categorySlug ?? ''] ?? 'Tin y tế'}
                      </span>
                      <span className="text-[#6b7280] normal-case tracking-normal font-medium">{art.date}</span>
                    </div>
                    <h3 className="mt-3 text-[17px] font-bold text-[#111111] group-hover:text-[#0a94dc] transition-colors duration-300 leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="mt-2 text-[14px] text-[#4b5563] leading-relaxed line-clamp-3 flex-1">{art.excerpt}</p>
                    <span className="mt-5 pt-4 border-t border-[#eef2f6] inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#0a2540] group-hover:text-[#e11d2a] transition-colors">
                      Đọc tiếp
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </button>
              </RevealItem>
            ))}
          </RevealGroup>

          <ViewAllButton label="Xem thêm bài viết" onClick={() => onNavigateTab('tin-tuc')} />
        </div>
      </section>
    </div>
  );
};
