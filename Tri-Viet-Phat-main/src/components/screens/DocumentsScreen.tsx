import React, { useState, useEffect, useMemo } from 'react';
import { PageBanner } from '../PageBanner';
import { SiteSidebar } from '../SiteSidebar';
import { ArticleFullView } from '../ArticleFullView';
import { REAL_DOCUMENTS, REAL_NEWS_ARTICLES, SiteArticle } from '../../data/realSiteContent';
import { PageTab } from '../../types';

interface DocumentsScreenProps {
  initialCategory?: string;
  onNavigateCategory?: (category: string) => void;
  onNavigateTab?: (tab: PageTab, cat?: string) => void;
}

interface CategoryOption {
  key: string;
  label: string;
  icon: string;
}

const DOCUMENT_CATEGORIES: CategoryOption[] = [
  { key: 'all', label: 'Tất cả tài liệu', icon: 'menu_book' },
  { key: 'video-huong-dan', label: 'Video hướng dẫn sử dụng', icon: 'play_circle' },
  { key: 'tai-lieu-san-pham', label: 'Tài liệu sản phẩm', icon: 'description' },
  { key: 'huong-dan-bao-tri', label: 'Hướng dẫn bảo trì sửa chữa', icon: 'build' },
];

const FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';

// Downloadable PDF catalogs & technical specs
interface DownloadableDoc {
  id: string;
  title: string;
  code: string;
  fileSize: string;
  format: string;
  pages: number;
  description: string;
}

const DOWNLOADABLE_DOCS: DownloadableDoc[] = [
  {
    id: 'catalog-tvp-2025',
    title: 'Catalog Tổng hợp Thiết bị Xét nghiệm & Vật tư Y tế Trí Việt Phát 2025',
    code: 'CAT-TVP-2025',
    fileSize: '4.8 MB',
    format: 'PDF',
    pages: 48,
    description:
      'Tổng hợp chi tiết danh mục máy xét nghiệm huyết học, sinh hóa, nước tiểu, hóa chất tiêu hao và vật tư y sinh đạt chuẩn ISO/CE.',
  },
  {
    id: 'quy-trinh-bao-duong-dinh-ky',
    title: 'Quy trình kiểm chuẩn & Bảo dưỡng định kỳ máy xét nghiệm sinh hóa',
    code: 'SOP-MAINT-02',
    fileSize: '2.4 MB',
    format: 'PDF',
    pages: 24,
    description:
      'Hướng dẫn kỹ thuật viên phòng Lab thực hiện vệ sinh đường ống, kiểm tra quang học, cân chỉnh pipette và hiệu chuẩn chuẩn độ.',
  },
  {
    id: 'tieu-chuan-phong-xet-nghiem',
    title: 'Sổ tay tiêu chuẩn an toàn vận hành phòng xét nghiệm y sinh ISO 15189',
    code: 'ISO-15189-LAB',
    fileSize: '3.6 MB',
    format: 'PDF',
    pages: 36,
    description:
      'Các quy tắc bắt buộc về an toàn sinh học, xử lý mẫu máu, bảo quản hóa chất nhạy sáng và kiểm soát nhiễm khuẩn buồng xét nghiệm.',
  },
  {
    id: 'bieu-mau-yeu-cau-ky-thuat',
    title: 'Phiếu yêu cầu khảo sát, bảo trì & hỗ trợ kỹ thuật thiết bị khẩn cấp',
    code: 'FORM-REQ-SRV',
    fileSize: '680 KB',
    format: 'PDF',
    pages: 4,
    description:
      'Mẫu biên bản tiếp nhận sự cố, chẩn đoán lỗi phần cứng máy xét nghiệm và đăng ký linh kiện thay thế chính hãng.',
  },
];

const TECHNICAL_FAQS = [
  {
    q: 'Tần suất bảo dưỡng định kỳ khuyến nghị cho máy xét nghiệm là bao lâu?',
    a: 'Đối với các dòng máy xét nghiệm huyết học và sinh hóa tự động, khuyến nghị bảo dưỡng kiểm chuẩn kỹ thuật chuyên sâu tối thiểu 3 - 6 tháng/lần. Hàng ngày, kỹ thuật viên cần chạy chương trình rửa ống và kiểm tra QC trước ca làm việc.',
  },
  {
    q: 'Thời gian kỹ sư Trí Việt Phát có mặt khi thiết bị gặp sự cố khẩn cấp?',
    a: 'Tại khu vực Hà Nội và các tỉnh lân cận, đội ngũ kỹ sư chuyên môn của Trí Việt Phát cam kết tiếp nhận và có mặt xử lý trực tiếp trong vòng 2 - 4 giờ làm việc. Đối với các tỉnh xa, chúng tôi hỗ trợ chẩn đoán từ xa 24/7 và điều phối kỹ sư trong 12h.',
  },
  {
    q: 'Linh kiện thay thế có đảm bảo chính hãng và có chế độ bảo hành không?',
    a: '100% linh kiện thay thế (bơm nhu động, van solenoid, bóng đèn quang phổ, sensor...) do Trí Việt Phát cung cấp đều được nhập khẩu chính hãng, có CO/CQ đầy đủ và được bảo hành từ 6 đến 12 tháng theo tiêu chuẩn của nhà sản xuất.',
  },
];

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  initialCategory = 'all',
  onNavigateCategory,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDoc, setActiveDoc] = useState<SiteArticle | null>(null);
  const [previewPdf, setPreviewPdf] = useState<DownloadableDoc | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync state when initialCategory prop changes from Header dropdown
  useEffect(() => {
    const nextCat = initialCategory || 'all';
    setSelectedCategory(nextCat);
    setActiveDoc(null);
  }, [initialCategory]);

  const handleCategoryChange = (key: string) => {
    setSelectedCategory(key);
    setActiveDoc(null);
    if (onNavigateCategory) {
      onNavigateCategory(key);
    }
  };

  const handleSelect = (doc: SiteArticle) => {
    setActiveDoc(doc);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Filtered documents matching the selected category and search query
  const filteredDocs = useMemo(() => {
    let list = REAL_DOCUMENTS;

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((doc) => {
        if (selectedCategory === 'video-huong-dan' || selectedCategory === 'video-huong-dan-su-dung-may') {
          return doc.id.includes('video') || doc.title.toLowerCase().includes('video');
        }
        if (selectedCategory === 'tai-lieu-san-pham') {
          return doc.id.includes('tai-lieu-thiet-bi') || doc.title.toLowerCase().includes('thiết bị y tế');
        }
        if (selectedCategory === 'huong-dan-bao-tri' || selectedCategory === 'tai-lieu-huong-dan-bao-tri-sua-chua') {
          return doc.id.includes('bao-tri') || doc.title.toLowerCase().includes('bảo trì');
        }
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          doc.excerpt.toLowerCase().includes(q) ||
          doc.plainText.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Documents from other categories to prevent whitespace when filtered
  const otherDocs = useMemo(() => {
    if (selectedCategory === 'all' && !searchQuery.trim()) {
      return [];
    }
    const currentIds = new Set(filteredDocs.map((d) => d.id));
    return REAL_DOCUMENTS.filter((d) => !currentIds.has(d.id));
  }, [selectedCategory, searchQuery, filteredDocs]);

  const getCategoryTitle = () => {
    const found = DOCUMENT_CATEGORIES.find((c) => c.key === selectedCategory);
    return found ? found.label : 'Tài liệu kỹ thuật';
  };

  const categoryTitle = getCategoryTitle();

  const handleSidebarCategoryClick = (catName: string) => {
    if (catName.includes('Video hướng dẫn')) {
      handleCategoryChange('video-huong-dan');
    } else if (catName.includes('Tài liệu sản phẩm')) {
      handleCategoryChange('tai-lieu-san-pham');
    } else if (catName.includes('bảo trì sửa chữa')) {
      handleCategoryChange('huong-dan-bao-tri');
    } else if (catName === 'Tài liệu') {
      handleCategoryChange('all');
    } else if (catName.includes('Kiến thức sức khỏe')) {
      onNavigateTab?.('tin-tuc', 'kien-thuc-suc-khoe');
    } else if (catName.includes('Tin y tế')) {
      onNavigateTab?.('tin-tuc', 'tin-y-te');
    } else if (catName.includes('Tin nội bộ')) {
      onNavigateTab?.('tin-tuc', 'tin-noi-bo');
    } else if (catName.includes('Tin tức')) {
      onNavigateTab?.('tin-tuc', 'all');
    } else if (catName.includes('Thiết bị') || catName.includes('sản phẩm')) {
      onNavigateTab?.('san-pham', 'all');
    }
  };

  const getDocBadge = (docId: string) => {
    if (docId.includes('video')) {
      return {
        label: 'Video hướng dẫn HD',
        icon: 'play_circle',
        badgeBg: 'bg-[#fee2e2]',
        textColor: 'text-[#bb0112]',
        type: 'Video',
      };
    }
    if (docId.includes('bao-tri')) {
      return {
        label: 'Cẩm nang bảo trì',
        icon: 'build_circle',
        badgeBg: 'bg-[#fef3c7]',
        textColor: 'text-[#b45309]',
        type: 'Kỹ thuật',
      };
    }
    return {
      label: 'Tài liệu sản phẩm',
      icon: 'description',
      badgeBg: 'bg-[#e0f2fe]',
      textColor: 'text-[#006194]',
      type: 'Tài liệu PDF',
    };
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Banner */}
      <PageBanner
        title={activeDoc ? activeDoc.title : categoryTitle}
        backgroundImage="https://thietbiytegroup.com/wp-content/uploads/2024/09/banner-anh-hop-tac.jpg"
        breadcrumbs={
          activeDoc
            ? [
                { label: 'Trang chủ', onClick: () => onNavigateTab?.('trang-chu') },
                {
                  label: 'Tài liệu',
                  onClick: () => {
                    setActiveDoc(null);
                    setSelectedCategory('all');
                  },
                },
                ...(selectedCategory !== 'all'
                  ? [{ label: categoryTitle, onClick: () => setActiveDoc(null) }]
                  : []),
                { label: activeDoc.title },
              ]
            : selectedCategory && selectedCategory !== 'all'
            ? [
                { label: 'Trang chủ', onClick: () => onNavigateTab?.('trang-chu') },
                { label: 'Tài liệu', onClick: () => handleCategoryChange('all') },
                { label: categoryTitle },
              ]
            : [
                { label: 'Trang chủ', onClick: () => onNavigateTab?.('trang-chu') },
                { label: 'Tài liệu' },
              ]
        }
      />

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {activeDoc ? (
          <ArticleFullView
            article={activeDoc}
            relatedArticles={[
              ...REAL_DOCUMENTS.filter((d) => d.id !== activeDoc.id),
              ...REAL_NEWS_ARTICLES.slice(0, 2),
            ]}
            categoryTitle={categoryTitle}
            onBack={() => setActiveDoc(null)}
            onSelectArticle={handleSelect}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Rich, balanced content area */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Toolbar: Category Tabs & Search Bar */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {DOCUMENT_CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.key;
                      const count =
                        cat.key === 'all'
                          ? REAL_DOCUMENTS.length
                          : 1;

                      return (
                        <button
                          key={cat.key}
                          onClick={() => handleCategoryChange(cat.key)}
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#006194] text-white shadow-xs'
                              : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#006194]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {cat.icon}
                          </span>
                          <span>{cat.label}</span>
                          <span
                            className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                              isActive
                                ? 'bg-white/25 text-white'
                                : 'bg-[#e2e8f0] text-[#64748b]'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search input */}
                  <div className="relative w-full md:w-72 shrink-0">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94a3b8]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm tài liệu, video..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#cbd5e1] text-[13px] focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194] bg-[#f8fafc]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f172a] text-[14px]"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 1: Main Document Cards (Modern 2-Column Grid) */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006194]" />
                    <h2 className="text-[16px] sm:text-[18px] font-bold text-[#0f172a] uppercase">
                      {selectedCategory === 'all'
                        ? 'Tài liệu hướng dẫn & Video chuyên ngành'
                        : `${categoryTitle} (${filteredDocs.length})`}
                    </h2>
                  </div>
                  <span className="text-[12px] text-[#64748b]">
                    Được chứng thực kỹ thuật bởi Trí Việt Phát
                  </span>
                </div>

                {filteredDocs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {filteredDocs.map((doc) => {
                      const badge = getDocBadge(doc.id);
                      return (
                        <div
                          key={doc.id}
                          className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs hover:shadow-md hover:border-[#006194]/40 transition-all group flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Image */}
                            <div
                              onClick={() => handleSelect(doc)}
                              className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#f1f5f9] cursor-pointer"
                            >
                              <img
                                src={doc.image}
                                alt={doc.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_THUMBNAIL;
                                }}
                              />
                              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                <span
                                  className={`inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-1 rounded-full shadow-xs ${badge.badgeBg} ${badge.textColor}`}
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    {badge.icon}
                                  </span>
                                  <span>{badge.label}</span>
                                </span>
                              </div>

                              {doc.id.includes('video') && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                  <div className="w-12 h-12 rounded-full bg-white/90 text-[#bb0112] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[28px]">
                                      play_arrow
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Card Content */}
                            <div className="p-4 sm:p-5">
                              <h3
                                onClick={() => handleSelect(doc)}
                                className="text-[15px] sm:text-[16px] font-bold text-[#0f172a] group-hover:text-[#006194] transition-colors line-clamp-2 leading-snug cursor-pointer mb-2.5"
                              >
                                {doc.title}
                              </h3>
                              <p className="text-[13px] text-[#64748b] line-clamp-3 leading-relaxed mb-4">
                                {doc.excerpt}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="px-4 sm:px-5 py-3 bg-[#f8fafc] border-t border-[#f1f5f9] flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[12px] text-[#94a3b8]">
                              <span className="material-symbols-outlined text-[15px] text-[#bb0112]">
                                calendar_today
                              </span>
                              <span>{doc.date}</span>
                            </div>

                            <button
                              onClick={() => handleSelect(doc)}
                              className="inline-flex items-center gap-1.5 text-[#006194] group-hover:text-[#bb0112] text-[13px] font-bold transition-colors cursor-pointer"
                            >
                              <span>Xem chi tiết</span>
                              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                                arrow_forward
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 text-center text-[#64748b]">
                    <span className="material-symbols-outlined text-[48px] text-[#94a3b8] mb-2">
                      search_off
                    </span>
                    <p className="text-[15px] font-semibold text-[#1e293b]">
                      Không tìm thấy tài liệu phù hợp với từ khóa "{searchQuery}"
                    </p>
                    <p className="text-[13px] text-[#64748b] mt-1">
                      Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="mt-4 px-4 py-2 bg-[#006194] text-white rounded-xl text-[13px] font-bold hover:bg-[#004e76] transition-colors cursor-pointer"
                    >
                      Xem tất cả tài liệu
                    </button>
                  </div>
                )}
              </div>

              {/* Section 2: Other Technical Documents (When filtered, ensures no empty void) */}
              {otherDocs.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-[#f1f5f9] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006194] text-[20px]">
                        library_books
                      </span>
                      <h3 className="text-[15px] sm:text-[16px] font-bold text-[#0f172a]">
                        Tài liệu & Cẩm nang kỹ thuật liên quan khác
                      </h3>
                    </div>
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="text-[12.5px] font-semibold text-[#006194] hover:text-[#bb0112] transition-colors"
                    >
                      Xem toàn bộ ({REAL_DOCUMENTS.length}) ▸
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherDocs.map((doc) => {
                      const badge = getDocBadge(doc.id);
                      return (
                        <div
                          key={doc.id}
                          onClick={() => handleSelect(doc)}
                          className="flex gap-3.5 p-3 rounded-xl border border-[#f1f5f9] hover:border-[#006194]/40 hover:bg-[#f8fafc] transition-all cursor-pointer group"
                        >
                          <div className="w-24 h-20 shrink-0 rounded-lg overflow-hidden bg-[#f1f5f9] border border-[#e2e8f0]">
                            <img
                              src={doc.image}
                              alt={doc.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_THUMBNAIL;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.badgeBg} ${badge.textColor} inline-block mb-1`}
                              >
                                {badge.type}
                              </span>
                              <h4 className="text-[13px] font-bold text-[#1e293b] group-hover:text-[#006194] line-clamp-2 leading-snug">
                                {doc.title}
                              </h4>
                            </div>
                            <span className="text-[11px] text-[#94a3b8] mt-1">
                              {doc.date}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 3: Technical Download Center (Catalogs & Specs PDF) */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 border-b border-[#f1f5f9] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#bb0112] text-[22px]">
                        cloud_download
                      </span>
                      <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0f172a]">
                        Trung tâm Tải về Tài liệu Kỹ thuật & Catalog (PDF)
                      </h3>
                    </div>
                    <p className="text-[13px] text-[#64748b] mt-1">
                      Tải về tài liệu thông số kỹ thuật, hồ sơ thiết bị y tế và bảng hướng dẫn vận hành chuẩn ISO
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[12px] text-[#059669] font-bold bg-[#d1fae5] px-3 py-1 rounded-full self-start sm:self-center">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span>Tải về miễn phí</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DOWNLOADABLE_DOCS.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 rounded-xl border border-[#e2e8f0] hover:border-[#006194] transition-all bg-[#fafafa] hover:bg-white flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-[#fee2e2] text-[#bb0112] flex items-center justify-center font-black text-[11px]">
                              PDF
                            </span>
                            <div>
                              <span className="text-[11px] font-mono text-[#64748b]">
                                {file.code}
                              </span>
                              <span className="text-[11px] text-[#94a3b8] ml-2">
                                • {file.pages} trang
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-[#006194] bg-[#e0f2fe] px-2 py-0.5 rounded">
                            {file.fileSize}
                          </span>
                        </div>

                        <h4 className="text-[13.5px] font-bold text-[#0f172a] group-hover:text-[#006194] line-clamp-2 leading-snug mb-1.5">
                          {file.title}
                        </h4>
                        <p className="text-[12.5px] text-[#64748b] line-clamp-2 leading-relaxed">
                          {file.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#e2e8f0]/80 flex items-center justify-between">
                        <button
                          onClick={() => setPreviewPdf(file)}
                          className="text-[12.5px] font-semibold text-[#006194] hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                          <span>Xem tóm tắt</span>
                        </button>

                        <button
                          onClick={() => {
                            alert(
                              `Đang chuẩn bị tải xuống: ${file.title} (${file.fileSize}). Quý khách cũng có thể liên hệ Hotline 0904.698.699 để nhận trọn bộ tài liệu gốc có đóng dấu Trí Việt Phát.`
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#006194] text-white hover:bg-[#bb0112] text-[12px] font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[15px]">download</span>
                          <span>Tải PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: 4-Step Technical Maintenance Process */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
                <div className="mb-5 border-b border-[#f1f5f9] pb-3">
                  <span className="text-[12px] font-bold text-[#006194] uppercase tracking-wider">
                    Dịch vụ sau bán hàng chuyên nghiệp
                  </span>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0f172a] mt-0.5">
                    Quy trình Bảo trì & Hỗ trợ Kỹ thuật Thiết bị Y tế 4 Bước
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] relative">
                    <span className="w-7 h-7 rounded-full bg-[#006194] text-white flex items-center justify-center text-[12px] font-bold mb-3">
                      1
                    </span>
                    <h4 className="text-[13.5px] font-bold text-[#0f172a] mb-1.5">
                      Tiếp nhận sự cố 24/7
                    </h4>
                    <p className="text-[12px] text-[#64748b] leading-relaxed">
                      Tiếp nhận thông tin qua hotline, chẩn đoán sơ bộ mã lỗi máy xét nghiệm qua video/ảnh chụp.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] relative">
                    <span className="w-7 h-7 rounded-full bg-[#006194] text-white flex items-center justify-center text-[12px] font-bold mb-3">
                      2
                    </span>
                    <h4 className="text-[13.5px] font-bold text-[#0f172a] mb-1.5">
                      Khảo sát trong 2 - 4h
                    </h4>
                    <p className="text-[12px] text-[#64748b] leading-relaxed">
                      Kỹ sư chuyên ngành có mặt trực tiếp tại cơ sở y tế với đầy đủ thiết bị đo kiểm và linh kiện.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] relative">
                    <span className="w-7 h-7 rounded-full bg-[#006194] text-white flex items-center justify-center text-[12px] font-bold mb-3">
                      3
                    </span>
                    <h4 className="text-[13.5px] font-bold text-[#0f172a] mb-1.5">
                      Sửa chữa & Thay thế
                    </h4>
                    <p className="text-[12px] text-[#64748b] leading-relaxed">
                      100% linh kiện chính hãng, vệ sinh hệ thống cơ điện tử và căn chỉnh quang học chính xác.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] relative">
                    <span className="w-7 h-7 rounded-full bg-[#059669] text-white flex items-center justify-center text-[12px] font-bold mb-3">
                      4
                    </span>
                    <h4 className="text-[13.5px] font-bold text-[#0f172a] mb-1.5">
                      Kiểm định & Bàn giao
                    </h4>
                    <p className="text-[12px] text-[#64748b] leading-relaxed">
                      Chạy mẫu nghiệm thu QC, lập biên bản kiểm chuẩn và dán tem bảo hành kỹ thuật Trí Việt Phát.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5: Technical FAQs (Accordion) */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#006194] text-[22px]">
                    help
                  </span>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0f172a]">
                    Câu hỏi thường gặp về Bảo trì & Sử dụng Thiết bị Y tế
                  </h3>
                </div>

                <div className="space-y-3">
                  {TECHNICAL_FAQS.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#e2e8f0] overflow-hidden transition-colors"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 text-left font-bold text-[14px] text-[#0f172a] flex items-center justify-between gap-3 hover:bg-[#f8fafc] cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#e0f2fe] text-[#006194] flex items-center justify-center text-[11px]">
                              Q
                            </span>
                            <span>{faq.q}</span>
                          </span>
                          <span
                            className={`material-symbols-outlined text-[18px] text-[#64748b] transition-transform ${
                              isOpen ? 'rotate-180 text-[#006194]' : ''
                            }`}
                          >
                            expand_more
                          </span>
                        </button>
                        {isOpen && (
                          <div className="p-4 pt-1 bg-[#f8fafc] text-[13px] text-[#475569] leading-relaxed border-t border-[#f1f5f9]">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 6: Related News Articles to bridge content */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-[#f1f5f9] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#bb0112] text-[20px]">
                      newspaper
                    </span>
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-[#0f172a]">
                      Kiến thức & Tin tức Y tế liên quan
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigateTab?.('tin-tuc', 'all')}
                    className="text-[12.5px] font-semibold text-[#006194] hover:text-[#bb0112] transition-colors cursor-pointer"
                  >
                    Xem tất cả tin tức ▸
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {REAL_NEWS_ARTICLES.slice(0, 3).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        onNavigateTab?.('tin-tuc', 'all');
                      }}
                      className="group p-3 rounded-xl border border-[#f1f5f9] hover:border-[#006194] transition-all cursor-pointer bg-[#fafafa] hover:bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-28 rounded-lg overflow-hidden mb-2 bg-[#f1f5f9]">
                          <img
                            src={art.image}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_THUMBNAIL;
                            }}
                          />
                        </div>
                        <h4 className="text-[13px] font-bold text-[#0f172a] group-hover:text-[#006194] line-clamp-2 leading-snug">
                          {art.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-[#94a3b8] mt-2 block">
                        {art.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar with balanced spacing */}
            <div className="lg:col-span-4 xl:col-span-3">
              <SiteSidebar
                onSelectArticle={handleSelect}
                onNavigateCategory={handleSidebarCategoryClick}
                className="sticky top-24"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview PDF Modal */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#cbd5e1] animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 border-b border-[#f1f5f9] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-[#fee2e2] text-[#bb0112] flex items-center justify-center font-black text-[13px]">
                  PDF
                </span>
                <div>
                  <span className="text-[11px] font-mono text-[#64748b]">
                    {previewPdf.code}
                  </span>
                  <h4 className="text-[15px] font-bold text-[#0f172a] leading-snug">
                    {previewPdf.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setPreviewPdf(null)}
                className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[13.5px] text-[#334155] leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-1.5 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Định dạng:</span>
                  <span className="font-semibold text-[#0f172a]">{previewPdf.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Dung lượng:</span>
                  <span className="font-semibold text-[#0f172a]">{previewPdf.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Số trang:</span>
                  <span className="font-semibold text-[#0f172a]">{previewPdf.pages} trang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Đơn vị phát hành:</span>
                  <span className="font-semibold text-[#006194]">Công ty TNHH Thiết bị Y tế Trí Việt Phát</span>
                </div>
              </div>

              <div>
                <strong className="block text-[#0f172a] text-[13px] mb-1">Mô tả nội dung tài liệu:</strong>
                <p className="text-[#64748b] text-[13px]">{previewPdf.description}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#eff6ff] text-[#1e40af] text-[12px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Tài liệu đã được kiểm duyệt kỹ thuật. Có thể chia sẻ nội bộ phòng khám / bệnh viện.</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewPdf(null)}
                className="px-4 py-2 rounded-xl text-[13px] font-medium text-[#64748b] hover:bg-[#f1f5f9] cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  alert(`Bắt đầu tải xuống file: ${previewPdf.title}`);
                  setPreviewPdf(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#006194] text-white hover:bg-[#bb0112] text-[13px] font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Tải về ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
