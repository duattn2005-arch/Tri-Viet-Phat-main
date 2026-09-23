import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { COMPANY_INFO, PRODUCTS, PARTNERS, ARTICLES, TESTIMONIALS } from '../../data/mockData';
import { Product, Article, PageTab } from '../../types';
import { ProvinceSelect } from '../ProvinceSelect';
import { TestimonialsCarousel } from '../TestimonialsCarousel';
import { HeroSection } from '../HeroSection';
import { ProductCardsSection } from '../ProductCardsSection';
import { SectionHeader, ViewAllButton } from '../SectionHeader';
import { ProductCard } from '../ProductCard';
import { Reveal, RevealGroup, RevealItem, WipeImage, CountUp } from '../motion/Reveal';

interface HomeScreenProps {
  onSelectProduct: (product: Product) => void;
  onSelectArticle: (article: Article) => void;
  onNavigateTab: (tab: PageTab, categoryFilter?: string) => void;
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

const MARQUEE_WORDS = ['Huyết học', 'Sinh hóa', 'Nước tiểu', 'Điện giải', 'Miễn dịch', 'Đông máu', 'Hóa chất IVD'];

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
  'w-full px-3.5 py-2.5 bg-white border border-[#d4d4d4] text-[14px] text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]';

const LABEL_CLASS = 'block text-[13px] font-medium text-[#333333] mb-1.5';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectProduct,
  onSelectArticle,
  onNavigateTab,
  onOpenConsultation,
  onOpenRepairService,
}) => {
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
      return PRODUCTS.slice(0, 10);
    }
    const filtered = PRODUCTS.filter((p) => p.category === featuredCategory);
    return filtered.length > 0 ? filtered.slice(0, 10) : PRODUCTS.slice(0, 10);
  }, [featuredCategory]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <HeroSection onOpenConsultation={onOpenConsultation} />

      {/* 2. Key facts — dark band, counters with an accent line that draws in */}
      <section className="w-full bg-[#111111] text-white">
        <dl className="max-w-[1320px] mx-auto px-4 sm:px-8 py-12 sm:py-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-10 gap-y-12">
          {FACTS.map((fact, idx) => (
            <Reveal key={fact.label} delay={idx * 0.12} className="relative pt-6">
              {/* Top rule: faint base with an accent segment that grows in */}
              <span className="absolute top-0 inset-x-0 h-px bg-white/15" aria-hidden="true" />
              <motion.span
                className="absolute top-0 left-0 h-[2px] w-16 bg-[#e11d2a] origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3 + idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              />
              <dd className="text-[44px] sm:text-[56px] lg:text-[64px] font-bold leading-none tracking-tight tabular-nums">
                <CountUp
                  to={fact.to}
                  prefix={fact.prefix}
                  suffix={fact.suffix}
                  suffixClassName="text-[#e11d2a] text-[0.6em] align-top ml-1"
                />
              </dd>
              <dt className="mt-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-white">{fact.label}</dt>
              <dd className="mt-2 text-[13px] sm:text-[14px] text-white/55 leading-snug">{fact.note}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* 3. Product categories */}
      <ProductCardsSection onNavigateTab={onNavigateTab} />

      {/* 4. Featured products — tabs double as the section heading */}
      <section className="w-full py-12 sm:py-16 bg-[#f7f7f7]" id="featured-products">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
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
                      ? 'border-[#111111] text-[#111111]'
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

      {/* Big scrolling word band — alternating dark and light type */}
      <section className="w-full overflow-hidden py-10 sm:py-14 bg-white" aria-hidden="true">
        <div className="marquee-track marquee-slow flex w-max items-center">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, idx) => (
            <span key={idx} className="flex items-center shrink-0">
              <span
                className={`px-6 sm:px-10 text-[48px] sm:text-[80px] lg:text-[104px] font-bold uppercase leading-none tracking-tight whitespace-nowrap ${
                  idx % 2 ? 'text-[#d4d4d4]' : 'text-[#111111]'
                }`}
              >
                {word}
              </span>
              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#e11d2a] shrink-0" />
            </span>
          ))}
        </div>
      </section>

      {/* 5. About & technical capability */}
      <section className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <WipeImage
              wrapperClassName="bg-[#f2f2f2]"
              className="w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] object-cover"
              alt="Kỹ thuật viên phòng xét nghiệm làm việc với kính hiển vi"
              src={COMPANY_INFO.aboutImage}
              loading="lazy"
            />
          </div>

          <Reveal className="lg:col-span-7" delay={0.15}>
            <h2 className="text-[20px] sm:text-[26px] font-bold text-[#111111] uppercase leading-tight">
              Về Trí Việt Phát
            </h2>
            <p className="mt-4 text-[15px] sm:text-[16px] text-[#555555] leading-relaxed">
              {COMPANY_INFO.name} được thành lập theo giấy phép số {COMPANY_INFO.licenseNo} của{' '}
              {COMPANY_INFO.licensedBy}. Hơn {COMPANY_INFO.yearsOfExperience.replace('+', '')} năm qua, chúng tôi
              là đối tác cung ứng thiết bị và hóa chất xét nghiệm cho các bệnh viện đa khoa, trung tâm y tế và phòng
              khám trên toàn quốc.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {CAPABILITIES.map((cap) => (
                <div key={cap.title} className="py-5 border-t border-[#e5e5e5]">
                  <h3 className="text-[15px] font-semibold text-[#111111]">{cap.title}</h3>
                  <p className="mt-1.5 text-[14px] text-[#555555] leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[14px] font-semibold">
              <button
                type="button"
                onClick={() => onNavigateTab('gioi-thieu')}
                className="text-[#111111] hover:text-[#000000] cursor-pointer"
              >
                Tìm hiểu về công ty <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={onOpenRepairService}
                className="text-[#111111] hover:text-[#000000] cursor-pointer"
              >
                Đăng ký bảo trì, sửa chữa <span aria-hidden="true">→</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Partners — uniform wordmarks, no per-brand colours */}
      <section className="w-full py-12 sm:py-16 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <Reveal>
            <SectionHeader title="Đối tác của chúng tôi" description="Nhà phân phối chính thức sản phẩm của các hãng chẩn đoán IVD hàng đầu." />
          </Reveal>
          {/* Infinite marquee: the list is rendered twice and slid by -50% */}
          <div className="marquee group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <ul className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
              {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                <li
                  key={`${partner.name}-${idx}`}
                  aria-hidden={idx >= PARTNERS.length}
                  className="h-28 w-[190px] sm:w-[240px] shrink-0 flex items-center justify-center px-6"
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={idx < PARTNERS.length ? partner.name : ''}
                      loading="lazy"
                      className="max-h-12 sm:max-h-14 max-w-full object-contain hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-[18px] font-semibold text-[#999999]">{partner.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <TestimonialsCarousel testimonials={TESTIMONIALS} />

      {/* 8. Consultation form */}
      <section className="w-full py-12 sm:py-16 bg-[#f7f7f7]" id="tu-van-form">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <h2 className="text-[20px] sm:text-[26px] font-bold text-[#111111] uppercase leading-tight">
              Yêu cầu tư vấn và báo giá
            </h2>
            <p className="mt-4 text-[15px] text-[#555555] leading-relaxed">
              Bệnh viện, phòng khám hoặc đơn vị dự thầu vui lòng gửi thông tin. Kỹ sư phụ trách khu vực sẽ liên hệ lại
              với báo giá và cấu hình phù hợp.
            </p>

            <ul className="mt-6 space-y-3">
              {FORM_ASSURANCES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#333333]">
                  <span className="material-symbols-outlined text-[18px] text-[#111111] mt-px">check</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-8 pt-6 border-t border-[#e5e5e5] grid grid-cols-2 gap-6 text-[14px]">
              <div>
                <dt className="text-[#777777]">Hotline</dt>
                <dd className="mt-1 space-y-0.5">
                  <a
                    href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
                    className="block font-semibold text-[#111111] hover:text-[#111111] hover:underline underline-offset-4"
                  >
                    {COMPANY_INFO.hotline}
                  </a>
                  <a
                    href={`tel:${COMPANY_INFO.hotline2.replace(/\./g, '')}`}
                    className="block font-semibold text-[#111111] hover:text-[#111111] hover:underline underline-offset-4"
                  >
                    {COMPANY_INFO.hotline2}
                  </a>
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[#777777]">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="block font-semibold text-[#111111] hover:text-[#111111] hover:underline underline-offset-4 break-all"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.15}>
            <div className="bg-white p-6 sm:p-8">
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
                          className="text-[13px] px-3 py-1.5 border border-[#d4d4d4] text-[#333333] hover:border-[#111111] hover:text-[#111111] hover:underline underline-offset-4 transition-colors cursor-pointer"
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

                  <button
                    className="btn-primary w-full sm:w-auto h-12 px-10 text-[14px] font-semibold uppercase tracking-wide cursor-pointer"
                    type="submit"
                  >
                    Gửi yêu cầu
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. News */}
      <section className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <SectionHeader title="Tin tức và hướng dẫn kỹ thuật" />

          <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.slice(0, 3).map((art) => (
              <RevealItem key={art.id}>
                <button
                  type="button"
                  onClick={() => onSelectArticle(art)}
                  className="group flex flex-col text-left cursor-pointer"
                >
                  <div className="w-full aspect-[16/9] overflow-hidden bg-[#f2f2f2]">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      alt={art.alt}
                      src={art.image}
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 text-[12px] font-medium uppercase tracking-wide text-[#777777]">
                    {art.category || 'Tin y tế'} · {art.date}
                  </div>
                  <h3 className="mt-2 text-[17px] font-semibold text-[#111111] group-hover:underline underline-offset-4 transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="mt-2 text-[14px] text-[#555555] leading-relaxed line-clamp-3">{art.excerpt}</p>
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
