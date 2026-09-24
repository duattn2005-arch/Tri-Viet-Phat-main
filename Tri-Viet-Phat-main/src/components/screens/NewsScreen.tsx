import React, { useState, useEffect, useMemo } from 'react';
import { PageBanner } from '../PageBanner';
import { SiteSidebar } from '../SiteSidebar';
import { ArticleFullView } from '../ArticleFullView';
import { REAL_NEWS_ARTICLES, SiteArticle } from '../../data/realSiteContent';
import { PageTab } from '../../types';

interface NewsScreenProps {
  initialCategory?: string;
  onNavigateCategory?: (category: string) => void;
  onNavigateTab?: (tab: PageTab, cat?: string) => void;
  /** Article to open on arrival, e.g. picked on the home page or in search */
  initialArticleId?: string;
}

interface NewsCategoryOption {
  key: string;
  label: string;
  icon: string;
}

const NEWS_CATEGORIES: NewsCategoryOption[] = [
  {
    key: 'all',
    label: 'Tất cả tin tức & sự kiện',
    icon: 'feed',
  },
  {
    key: 'kien-thuc-suc-khoe',
    label: 'Kiến thức sức khỏe',
    icon: 'health_and_safety',
  },
  {
    key: 'tin-y-te',
    label: 'Tin y tế',
    icon: 'medical_services',
  },
  {
    key: 'tin-noi-bo',
    label: 'Tin nội bộ',
    icon: 'corporate_fare',
  },
];

// Each article picks its category (categorySlug) in the CMS
const countInCategory = (key: string) =>
  key === 'all' ? REAL_NEWS_ARTICLES.length : REAL_NEWS_ARTICLES.filter((a) => a.categorySlug === key).length;

const FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';

const TRENDING_TAGS = [
  '#Vật tư tiêu hao y tế 2025',
  '#Máy xét nghiệm sinh hóa',
  '#Tiêu chuẩn phòng Lab ISO',
  '#Bảo trì thiết bị y tế',
  '#Hóa chất xét nghiệm',
  '#Thiết bị y tế Hà Nội',
  '#An toàn sinh học',
];

export const NewsScreen: React.FC<NewsScreenProps> = ({
  initialCategory = 'all',
  onNavigateCategory,
  onNavigateTab,
  initialArticleId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<SiteArticle | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);

  // Sync state when initialCategory prop changes from Header dropdown
  useEffect(() => {
    const nextCat = initialCategory || 'all';
    setSelectedCategory(nextCat);
    setActiveArticle(null);
  }, [initialCategory]);

  useEffect(() => {
    if (!initialArticleId) return;
    const art = REAL_NEWS_ARTICLES.find((a) => a.id === initialArticleId);
    if (art) setActiveArticle(art);
  }, [initialArticleId]);

  const handleCategoryChange = (key: string) => {
    setSelectedCategory(key);
    setActiveArticle(null);
    if (onNavigateCategory) {
      onNavigateCategory(key);
    }
  };

  const handleSelect = (art: SiteArticle) => {
    setActiveArticle(art);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Filtered articles based on selected category & search
  const filteredArticles = useMemo(() => {
    let list = REAL_NEWS_ARTICLES;

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((art) => art.categorySlug === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.excerpt.toLowerCase().includes(q) ||
          art.plainText.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Secondary articles from other categories to fill space when filtered
  const otherArticles = useMemo(() => {
    if (selectedCategory === 'all' && !searchQuery.trim()) {
      return [];
    }
    const currentIds = new Set(filteredArticles.map((a) => a.id));
    return REAL_NEWS_ARTICLES.filter((a) => !currentIds.has(a.id));
  }, [selectedCategory, searchQuery, filteredArticles]);

  const getCategoryTitle = () => {
    const found = NEWS_CATEGORIES.find((c) => c.key === selectedCategory);
    return found ? found.label : 'Tin tức & Sự kiện';
  };

  const getArticleCategoryBadge = (articleId: string) => {
    const slug = REAL_NEWS_ARTICLES.find((a) => a.id === articleId)?.categorySlug;
    return NEWS_CATEGORIES.find((c) => c.key !== 'all' && c.key === slug)?.label ?? 'Tin y tế';
  };

  const categoryTitle = getCategoryTitle();

  const handleSidebarCategoryClick = (catName: string) => {
    if (catName.includes('Kiến thức sức khỏe')) {
      handleCategoryChange('kien-thuc-suc-khoe');
    } else if (catName.includes('Tin y tế')) {
      handleCategoryChange('tin-y-te');
    } else if (catName.includes('Tin nội bộ')) {
      handleCategoryChange('tin-noi-bo');
    } else if (catName === 'Tin tức') {
      handleCategoryChange('all');
    } else if (catName.includes('Video hướng dẫn')) {
      onNavigateTab?.('tai-lieu', 'video-huong-dan');
    } else if (catName.includes('Tài liệu sản phẩm')) {
      onNavigateTab?.('tai-lieu', 'tai-lieu-san-pham');
    } else if (catName.includes('bảo trì sửa chữa')) {
      onNavigateTab?.('tai-lieu', 'huong-dan-bao-tri');
    } else if (catName === 'Tài liệu') {
      onNavigateTab?.('tai-lieu', 'all');
    } else if (catName.includes('Thiết bị') || catName.includes('sản phẩm')) {
      onNavigateTab?.('san-pham', 'all');
    }
  };

  // Hero featured article: first article when viewing 'all' with no search
  const featuredArticle = useMemo(() => {
    if (selectedCategory === 'all' && !searchQuery.trim() && filteredArticles.length > 0) {
      return filteredArticles[0];
    }
    return null;
  }, [selectedCategory, searchQuery, filteredArticles]);

  // Regular articles list excluding the featured one
  const gridArticles = useMemo(() => {
    if (featuredArticle) {
      return filteredArticles.slice(1);
    }
    return filteredArticles;
  }, [featuredArticle, filteredArticles]);

  return (
    <div className="w-full bg-[#f3f7fb] min-h-screen">
      {/* Banner */}
      <PageBanner
        title={activeArticle ? activeArticle.title : categoryTitle}
        backgroundImage="https://thietbiytegroup.com/wp-content/uploads/2024/09/hop-tac-cong-ty-y-te.jpg"
        breadcrumbs={
          activeArticle
            ? [
                { label: 'Trang chủ', onClick: () => onNavigateTab?.('trang-chu') },
                {
                  label: 'Tin tức',
                  onClick: () => {
                    setActiveArticle(null);
                    setSelectedCategory('all');
                  },
                },
                ...(selectedCategory !== 'all'
                  ? [{ label: categoryTitle, onClick: () => setActiveArticle(null) }]
                  : []),
                { label: activeArticle.title },
              ]
            : selectedCategory && selectedCategory !== 'all'
            ? [
                { label: 'Trang chủ', onClick: () => onNavigateTab?.('trang-chu') },
                { label: 'Tin tức', onClick: () => handleCategoryChange('all') },
                { label: categoryTitle },
              ]
            : [
                { label: 'Trang chủ', onClick: () => onNavigateTab?.('trang-chu') },
                { label: 'Tin tức' },
              ]
        }
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-5 sm:py-6">
        {activeArticle ? (
          <ArticleFullView
            article={activeArticle}
            relatedArticles={REAL_NEWS_ARTICLES.filter((a) => a.id !== activeArticle.id)}
            categoryTitle={categoryTitle}
            onBack={() => setActiveArticle(null)}
            onSelectArticle={handleSelect}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Rich, balanced news content */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Category Filter Pills & Search Bar */}
              <div className="bg-white  border border-[#e5e5e5] p-4 sm:p-5 ">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Category Filter - dropdown select on mobile, pills from sm+ */}
                  <div className="relative sm:hidden">
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      aria-label="Chọn danh mục tin tức"
                      className="w-full appearance-none pl-3.5 pr-10 py-3  border border-[#d4d4d4] bg-[#f3f7fb] text-[13.5px] font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#0a2540] cursor-pointer"
                    >
                      {NEWS_CATEGORIES.map((cat) => {
                        const count = countInCategory(cat.key);
                        return (
                          <option key={cat.key} value={cat.key}>
                            {cat.label} ({count})
                          </option>
                        );
                      })}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#111111]">
                      expand_more
                    </span>
                  </div>

                  <div className="hidden sm:flex flex-wrap items-center gap-x-6 gap-y-2">
                    {NEWS_CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.key;
                      const count = countInCategory(cat.key);

                      return (
                        <button
                          key={cat.key}
                          onClick={() => handleCategoryChange(cat.key)}
                          className={`inline-flex items-center gap-1.5 pb-2 border-b-2 text-[15px] font-semibold transition-colors cursor-pointer ${
                            isActive
                              ? 'border-[#0a2540] text-[#111111]'
                              : 'border-transparent text-[#999999] hover:text-[#333333]'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className="text-[13px] font-medium text-[#999999]">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search input */}
                  <div className="relative w-full md:w-72 shrink-0">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#999999]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm bài viết, tin tức..."
                      className="w-full pl-9 pr-8 py-2  border border-[#d4d4d4] text-[13px] focus:outline-none focus:border-[#0a2540] bg-white"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999999] fx-link text-[14px]"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Featured Hero Article (when on All view) */}
              {featuredArticle && (
                <div className="bg-white  border border-[#e5e5e5] overflow-hidden   transition-all group">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div
                      onClick={() => handleSelect(featuredArticle)}
                      className="md:col-span-6 relative h-64 md:h-full min-h-[260px] overflow-hidden bg-[#edf3f8] cursor-pointer"
                    >
                      <img
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_THUMBNAIL;
                        }}
                      />
                    </div>

                    <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[12px] font-semibold uppercase tracking-wide text-[#777777]">
                            {getArticleCategoryBadge(featuredArticle.id)}
                          </span>
                          <span className="text-[12px] text-[#999999] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {featuredArticle.date}
                          </span>
                        </div>

                        <h2
                          onClick={() => handleSelect(featuredArticle)}
                          className="text-[18px] sm:text-[21px] font-bold text-[#111111] group-hover:text-[#0a94dc] transition-colors duration-300 transition-colors leading-snug cursor-pointer mb-3"
                        >
                          {featuredArticle.title}
                        </h2>

                        <p className="text-[13.5px] text-[#555555] line-clamp-3 leading-relaxed mb-4">
                          {featuredArticle.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#f2f2f2]">
                        <span className="text-[12.5px] text-[#777777] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Biên tập bởi Trí Việt Phát</span>
                        </span>

                        <button
                          onClick={() => handleSelect(featuredArticle)}
                          className="inline-flex items-center gap-1.5 px-4 py-2  bg-[#0a2540] text-white hover:bg-[#071a2e] text-[13px] font-bold transition-colors cursor-pointer "
                        >
                          <span>Đọc chi tiết</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Articles (Modern 2-Column Grid) */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0a2540]" />
                    <h3 className="text-[16px] sm:text-[18px] font-bold text-[#111111]">
                      {selectedCategory === 'all'
                        ? 'Các bài viết mới nhất'
                        : `${categoryTitle} (${filteredArticles.length})`}
                    </h3>
                  </div>
                  <span className="text-[12px] text-[#777777]">
                    {gridArticles.length} bài viết
                  </span>
                </div>

                {gridArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {gridArticles.map((art) => (
                      <div
                        key={art.id}
                        className="bg-white  border border-[#e5e5e5] overflow-hidden   hover:border-[#0a2540]/40 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          {/* Thumbnail */}
                          <div
                            onClick={() => handleSelect(art)}
                            className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#edf3f8] cursor-pointer"
                          >
                            <img
                              src={art.image}
                              alt={art.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_THUMBNAIL;
                              }}
                            />
                            <div className="absolute top-3 left-3">
                              <span className="inline-block bg-[#0a2540]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 ">
                                {getArticleCategoryBadge(art.id)}
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-4 sm:p-5">
                            <h4
                              onClick={() => handleSelect(art)}
                              className="text-[15px] sm:text-[16px] font-bold text-[#111111] group-hover:text-[#0a94dc] transition-colors duration-300 transition-colors line-clamp-2 leading-snug cursor-pointer mb-2.5"
                            >
                              {art.title}
                            </h4>
                            <p className="text-[13px] text-[#777777] line-clamp-3 leading-relaxed mb-3">
                              {art.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-4 sm:px-5 py-3 bg-[#f3f7fb] border-t border-[#f2f2f2] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[12px] text-[#999999]">
                            <span className="material-symbols-outlined text-[15px] text-[#777777]">
                              calendar_today
                            </span>
                            <span>{art.date}</span>
                          </div>

                          <button
                            onClick={() => handleSelect(art)}
                            className="inline-flex items-center gap-1 text-[#111111] group-hover:text-[#000000] text-[13px] font-bold transition-colors cursor-pointer"
                          >
                            <span>Xem chi tiết</span>
                            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                              arrow_forward
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white  border border-[#e5e5e5] p-10 text-center text-[#777777]">
                    <span className="material-symbols-outlined text-[48px] text-[#999999] mb-2">
                      search_off
                    </span>
                    <p className="text-[15px] font-semibold text-[#111111]">
                      Không tìm thấy bài viết phù hợp với từ khóa "{searchQuery}"
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="mt-4 px-4 py-2 bg-[#0a2540] text-white  text-[13px] font-bold hover:bg-[#071a2e] transition-colors cursor-pointer"
                    >
                      Xem tất cả tin tức
                    </button>
                  </div>
                )}
              </div>

              {/* Other Articles Section (When filtered, ensures no empty space) */}
              {otherArticles.length > 0 && (
                <div className="bg-white  border border-[#e5e5e5] p-5 sm:p-6 ">
                  <div className="flex items-center justify-between mb-4 border-b border-[#f2f2f2] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#111111] text-[20px]">
                        recommend
                      </span>
                      <h3 className="text-[16px] sm:text-[17px] font-bold text-[#111111]">
                        Bài viết đề xuất từ chuyên mục khác
                      </h3>
                    </div>
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="text-[12.5px] font-semibold text-[#111111] hover:text-[#000000] transition-colors cursor-pointer"
                    >
                      Xem toàn bộ ({REAL_NEWS_ARTICLES.length}) ▸
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherArticles.slice(0, 4).map((art) => (
                      <div
                        key={art.id}
                        onClick={() => handleSelect(art)}
                        className="flex gap-3.5 p-3  border border-[#f2f2f2] hover:border-[#0a2540]/40 hover:bg-[#f3f7fb] transition-all cursor-pointer group"
                      >
                        <div className="w-24 h-20 shrink-0  overflow-hidden bg-[#edf3f8] border border-[#e5e5e5]">
                          <img
                            src={art.image}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_THUMBNAIL;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#edf3f8] text-[#555555] inline-block mb-1">
                              {getArticleCategoryBadge(art.id)}
                            </span>
                            <h4 className="text-[13px] font-bold text-[#111111] group-hover:text-[#0a94dc] transition-colors duration-300 line-clamp-2 leading-snug">
                              {art.title}
                            </h4>
                          </div>
                          <span className="text-[11px] text-[#999999] mt-1">
                            {art.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics & Newsletter Box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Trending Tags */}
                <div className="md:col-span-6 bg-white  border border-[#e5e5e5] p-5 ">
                  <div className="flex items-center gap-2 mb-3 border-b border-[#f2f2f2] pb-2">
                    <span className="material-symbols-outlined text-[#777777] text-[20px]">
                      local_fire_department
                    </span>
                    <h4 className="text-[15px] font-bold text-[#111111]">
                      Chủ đề Y tế được quan tâm
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {TRENDING_TAGS.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const keyword = tag.replace('#', '').split(' ')[0];
                          setSearchQuery(keyword);
                        }}
                        className="px-3 py-1.5  bg-[#edf3f8] hover:bg-[#edf3f8] text-[#333333] fx-link text-[12px] font-medium transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Newsletter Box */}
                <div className="md:col-span-6 bg-linear-to-br from-[#0a2540] to-[#071a2e]  p-5 text-white  flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[20px] text-amber-300">
                        mail
                      </span>
                      <h4 className="text-[15px] font-bold">
                        Đăng ký nhận Bảng giá & Bản tin Y tế
                      </h4>
                    </div>
                    <p className="text-[12.5px] text-white/80 leading-relaxed mb-3">
                      Nhận thông tin cập nhật văn bản pháp quy, cẩm nang phòng Lab và báo giá thiết bị Trí Việt Phát mới nhất.
                    </p>
                  </div>

                  {newsletterSubscribed ? (
                    <div className="p-2.5  bg-white/20 text-[12.5px] font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-emerald-300">
                        check_circle
                      </span>
                      <span>Cảm ơn quý khách đã đăng ký!</span>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (newsletterEmail.trim()) {
                          setNewsletterSubscribed(true);
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Nhập email hoặc SĐT..."
                        className="flex-1 px-3 py-2  bg-white text-[#111111] text-[12.5px] focus:outline-none placeholder:text-[#999999]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0a2540] hover:bg-[#071a2e] text-white font-bold text-[12.5px]  transition-colors shrink-0 cursor-pointer"
                      >
                        Gửi
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
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
    </div>
  );
};
