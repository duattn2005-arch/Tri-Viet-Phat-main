import React, { useState, useMemo } from 'react';
import { COMPANY_INFO, PRODUCTS, PARTNERS, ARTICLES, TESTIMONIALS } from '../../data/mockData';
import { Product, Article, PageTab } from '../../types';
import { ProvinceSelect } from '../ProvinceSelect';
import { TestimonialsCarousel } from '../TestimonialsCarousel';
import { HeroSection } from '../HeroSection';
import { ProductCardsSection } from '../ProductCardsSection';
import { SectionHeader } from '../SectionHeader';

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
  { value: COMPANY_INFO.yearsOfExperience, label: 'năm trong ngành thiết bị y tế' },
  { value: COMPANY_INFO.provincesCovered, label: 'tỉnh thành có khách hàng' },
  { value: COMPANY_INFO.genuineReagents, label: 'hàng chính hãng, đủ CO/CQ' },
  { value: '2–4 giờ', label: 'có mặt kỹ thuật tại Hà Nội' },
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
  'w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#cbd5e1] text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194]';

const LABEL_CLASS = 'block text-[13px] font-medium text-[#334155] mb-1.5';

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
      return PRODUCTS.slice(0, 8);
    }
    const filtered = PRODUCTS.filter((p) => p.category === featuredCategory);
    return filtered.length > 0 ? filtered.slice(0, 8) : PRODUCTS.slice(0, 8);
  }, [featuredCategory]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <HeroSection onOpenConsultation={onOpenConsultation} />

      {/* 2. Key facts — plain figures, no cards or icons */}
      <section className="w-full bg-[#f8fafc] border-b border-[#e2e8f0]">
        <dl className="max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4">
          {FACTS.map((fact, idx) => (
            <div
              key={fact.label}
              className={`py-6 sm:py-8 ${idx % 2 === 1 ? 'pl-5 sm:pl-8 border-l border-[#e2e8f0]' : ''} ${
                idx >= 2 ? 'border-t lg:border-t-0 border-[#e2e8f0]' : ''
              } ${idx === 2 ? 'lg:pl-8 lg:border-l' : ''}`}
            >
              <dt className="sr-only">{fact.label}</dt>
              <dd className="text-[24px] sm:text-[28px] font-bold text-[#0f172a] leading-none">{fact.value}</dd>
              <dd className="mt-2 text-[13px] sm:text-[14px] text-[#475569]">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 3. Product categories */}
      <ProductCardsSection onNavigateTab={onNavigateTab} />

      {/* 4. Featured products */}
      <section className="w-full py-14 sm:py-20 bg-[#f8fafc] border-y border-[#e2e8f0]" id="featured-products">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <SectionHeader
            title="Sản phẩm tiêu biểu"
            description="Thiết bị chẩn đoán và hóa chất xét nghiệm có sẵn tại kho Hà Nội, giao toàn quốc."
            actionLabel="Xem toàn bộ sản phẩm"
            onAction={() => onNavigateTab('san-pham')}
          />

          {/* Category tabs */}
          <div
            role="tablist"
            aria-label="Lọc theo danh mục"
            className="flex gap-6 overflow-x-auto no-scrollbar border-b border-[#e2e8f0] mb-8"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = featuredCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setFeaturedCategory(cat.key)}
                  className={`shrink-0 pb-3 -mb-px border-b-2 text-[14px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#006194] text-[#006194]'
                      : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {filteredFeaturedProducts.map((prod) => (
              <button
                key={prod.id}
                type="button"
                onClick={() => onSelectProduct(prod)}
                className="group flex flex-col h-full text-left bg-white border border-[#e2e8f0] rounded-lg overflow-hidden hover:border-[#cbd5e1] hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all cursor-pointer"
              >
                <div className="relative w-full aspect-[4/3] min-h-0 shrink-0 overflow-hidden bg-white border-b border-[#f1f5f9]">
                  <img
                    className="absolute inset-0 w-full h-full object-contain p-5"
                    alt={prod.alt}
                    src={prod.image}
                    loading="lazy"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 text-[12px] text-[#64748b]">
                    <span className="truncate">{prod.categoryLabel}</span>
                    {prod.brand && (
                      <span className="truncate max-w-[45%] text-right" title={prod.brand}>
                        {prod.brand.replace(' INDUSTRIAL CO., LTD', '')}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-[15px] font-semibold text-[#0f172a] group-hover:text-[#006194] transition-colors leading-snug line-clamp-2">
                    {prod.name}
                  </h3>
                  <p className="mt-2 text-[13px] text-[#475569] leading-relaxed line-clamp-2">
                    {prod.shortDesc}
                  </p>
                  <span className="mt-auto pt-4 text-[13px] font-semibold text-[#006194]">
                    Xem chi tiết <span aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. About & technical capability */}
      <section className="w-full py-14 sm:py-20 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <img
              className="w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] object-cover rounded-lg bg-[#f1f5f9]"
              alt="Kỹ sư y sinh Trí Việt Phát"
              src={COMPANY_INFO.aboutImage}
              loading="lazy"
            />
          </div>

          <div className="lg:col-span-7">
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#0f172a] tracking-tight leading-tight">
              Về Trí Việt Phát
            </h2>
            <p className="mt-4 text-[15px] sm:text-[16px] text-[#475569] leading-relaxed">
              {COMPANY_INFO.name} được thành lập theo giấy phép số {COMPANY_INFO.licenseNo} của{' '}
              {COMPANY_INFO.licensedBy}. Hơn {COMPANY_INFO.yearsOfExperience.replace('+', '')} năm qua, chúng tôi
              là đối tác cung ứng thiết bị và hóa chất xét nghiệm cho các bệnh viện đa khoa, trung tâm y tế và phòng
              khám trên toàn quốc.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {CAPABILITIES.map((cap) => (
                <div key={cap.title} className="py-5 border-t border-[#e2e8f0]">
                  <h3 className="text-[15px] font-semibold text-[#0f172a]">{cap.title}</h3>
                  <p className="mt-1.5 text-[14px] text-[#475569] leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[14px] font-semibold">
              <button
                type="button"
                onClick={() => onNavigateTab('gioi-thieu')}
                className="text-[#006194] hover:text-[#004a73] cursor-pointer"
              >
                Tìm hiểu về công ty <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={onOpenRepairService}
                className="text-[#006194] hover:text-[#004a73] cursor-pointer"
              >
                Đăng ký bảo trì, sửa chữa <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Partners — uniform wordmarks, no per-brand colours */}
      <section className="w-full py-12 sm:py-16 bg-white border-t border-[#e2e8f0]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <p className="text-[14px] text-[#64748b] mb-6">
            Phân phối chính thức sản phẩm của các hãng chẩn đoán IVD
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-[#e2e8f0] border border-[#e2e8f0]">
            {PARTNERS.map((partner) => (
              <li
                key={partner.name}
                className="bg-white h-20 flex flex-col items-center justify-center text-center px-2"
              >
                <span className="text-[16px] font-semibold text-[#475569] tracking-wide leading-tight">
                  {partner.name}
                </span>
                {partner.subName && (
                  <span className="text-[10px] text-[#94a3b8] tracking-wider uppercase mt-0.5">
                    {partner.subName}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Testimonials */}
      <TestimonialsCarousel testimonials={TESTIMONIALS} />

      {/* 8. Consultation form */}
      <section className="w-full py-14 sm:py-20 bg-[#f8fafc] border-y border-[#e2e8f0]" id="tu-van-form">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="text-[24px] sm:text-[30px] font-bold text-[#0f172a] tracking-tight leading-tight">
              Yêu cầu tư vấn và báo giá
            </h2>
            <p className="mt-4 text-[15px] text-[#475569] leading-relaxed">
              Bệnh viện, phòng khám hoặc đơn vị dự thầu vui lòng gửi thông tin. Kỹ sư phụ trách khu vực sẽ liên hệ lại
              với báo giá và cấu hình phù hợp.
            </p>

            <ul className="mt-6 space-y-3">
              {FORM_ASSURANCES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#334155]">
                  <span className="material-symbols-outlined text-[18px] text-[#006194] mt-px">check</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-8 pt-6 border-t border-[#e2e8f0] grid grid-cols-2 gap-6 text-[14px]">
              <div>
                <dt className="text-[#64748b]">Hotline</dt>
                <dd className="mt-1 space-y-0.5">
                  <a
                    href={`tel:${COMPANY_INFO.hotline.replace(/\./g, '')}`}
                    className="block font-semibold text-[#0f172a] hover:text-[#006194]"
                  >
                    {COMPANY_INFO.hotline}
                  </a>
                  <a
                    href={`tel:${COMPANY_INFO.hotline2.replace(/\./g, '')}`}
                    className="block font-semibold text-[#0f172a] hover:text-[#006194]"
                  >
                    {COMPANY_INFO.hotline2}
                  </a>
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[#64748b]">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="block font-semibold text-[#0f172a] hover:text-[#006194] break-all"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 sm:p-8">
              {formSubmitted ? (
                <div className="py-10 text-center" role="status">
                  <span className="material-symbols-outlined text-[40px] text-[#006194]">check_circle</span>
                  <h3 className="mt-3 text-[19px] font-semibold text-[#0f172a]">Đã tiếp nhận yêu cầu</h3>
                  <p className="mt-2 text-[14px] text-[#475569] max-w-md mx-auto">
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
                          className="text-[13px] px-3 py-1.5 rounded-full border border-[#cbd5e1] text-[#334155] hover:border-[#006194] hover:text-[#006194] transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="home-form-name" className={LABEL_CLASS}>
                        Họ tên / Đơn vị <span className="text-[#bb0112]">*</span>
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
                        Số điện thoại <span className="text-[#bb0112]">*</span>
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
                        Tỉnh/thành phố <span className="text-[#bb0112]">*</span>
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
                    className="btn-primary w-full sm:w-auto h-12 px-8 rounded-md text-[15px] font-semibold cursor-pointer"
                    type="submit"
                  >
                    Gửi yêu cầu
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. News */}
      <section className="w-full py-14 sm:py-20 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <SectionHeader
            title="Tin tức và hướng dẫn kỹ thuật"
            actionLabel="Xem tất cả bài viết"
            onAction={() => onNavigateTab('tin-tuc')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.slice(0, 3).map((art) => (
              <button
                key={art.id}
                type="button"
                onClick={() => onSelectArticle(art)}
                className="group flex flex-col text-left cursor-pointer"
              >
                <div className="w-full aspect-[16/9] overflow-hidden rounded-lg bg-[#f1f5f9]">
                  <img
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    alt={art.alt}
                    src={art.image}
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 text-[13px] text-[#64748b]">
                  {art.category || 'Tin y tế'} · {art.date}
                </div>
                <h3 className="mt-2 text-[17px] font-semibold text-[#0f172a] group-hover:text-[#006194] transition-colors leading-snug line-clamp-2">
                  {art.title}
                </h3>
                <p className="mt-2 text-[14px] text-[#475569] leading-relaxed line-clamp-3">{art.excerpt}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
