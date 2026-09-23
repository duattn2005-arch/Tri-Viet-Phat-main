import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../../data/mockData';
import { brandName, originName } from '../../data/productMeta';
import { Product } from '../../types';

interface ProductsScreenProps {
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onOpenConsultation: (prefilledProduct?: string) => void;
}

const CATEGORIES = [
  { key: 'all', label: 'Tất cả sản phẩm' },
  { key: 'may-xet-nghiem-sinh-hoa', label: 'Xét nghiệm sinh hóa' },
  { key: 'may-xet-nghiem-nuoc-tieu', label: 'Xét nghiệm nước tiểu' },
  { key: 'may-xet-nghiem-huyet-hoc', label: 'Xét nghiệm huyết học' },
  { key: 'may-xet-nghiem-dien-giai', label: 'Xét nghiệm điện giải' },
  { key: 'may-xet-nghiem-mien-dich', label: 'Xét nghiệm miễn dịch' },
  { key: 'may-phan-tich-dong-mau', label: 'Phân tích đông máu' },
  { key: 'may-xet-nghiem-hba1c', label: 'Xét nghiệm HbA1c' },
  { key: 'hoa-chat-xet-nghiem', label: 'Hóa chất và thuốc thử' },
  { key: 'thiet-bi-khac', label: 'Máy ly tâm và thiết bị khác' },
];

type SortKey = 'featured' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Sản phẩm nổi bật' },
  { key: 'name-asc', label: 'Tên A → Z' },
  { key: 'name-desc', label: 'Tên Z → A' },
];

/** Sorted unique values with their product counts. */
function tally(values: string[]): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, 'vi'));
}

const FilterGroup: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-5 border-b border-[#e5e7eb]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-[18px] font-bold text-[#111] cursor-pointer"
      >
        <span>{title}</span>
        <span className="material-symbols-outlined text-[22px] font-light">{open ? 'remove' : 'add'}</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
};

const CheckRow: React.FC<{ label: string; count: number; checked: boolean; onChange: () => void }> = ({
  label,
  count,
  checked,
  onChange,
}) => (
  <label className="flex items-center gap-3 py-1.5 text-[16px] text-[#222] cursor-pointer select-none group">
    <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
    <span className="w-[18px] h-[18px] border border-[#9ca3af] flex items-center justify-center peer-checked:bg-[#111] peer-checked:border-[#111] peer-focus-visible:ring-2 peer-focus-visible:ring-[#006194]">
      {checked && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
    </span>
    <span className="flex-1 group-hover:text-[#006194]">{label}</span>
    <span className="text-[14px] text-[#9ca3af]">{count}</span>
  </label>
);

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onOpenConsultation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
  }, [initialCategory]);

  const inCategory = useMemo(
    () => PRODUCTS.filter((p) => selectedCategory === 'all' || p.category === selectedCategory),
    [selectedCategory]
  );

  // Facet counts reflect the current category so users never pick an empty combination.
  const brandFacets = useMemo(() => tally(inCategory.map(brandName)), [inCategory]);
  const originFacets = useMemo(() => tally(inCategory.map(originName)), [inCategory]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = inCategory.filter((p) => {
      if (selectedBrands.length && !selectedBrands.includes(brandName(p))) return false;
      if (selectedOrigins.length && !selectedOrigins.includes(originName(p))) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    });
    if (sortKey === 'featured') return list;
    const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    return sortKey === 'name-desc' ? sorted.reverse() : sorted;
  }, [inCategory, selectedBrands, selectedOrigins, searchQuery, sortKey]);

  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const selectCategory = (key: string) => {
    setSelectedCategory(key);
    setSelectedBrands([]);
    setSelectedOrigins([]);
    setMobileFiltersOpen(false);
  };

  const resetAll = () => {
    selectCategory('all');
    setSearchQuery('');
  };

  const categoryLabel = CATEGORIES.find((c) => c.key === selectedCategory)?.label || 'Sản phẩm';
  const activeFilterCount = selectedBrands.length + selectedOrigins.length;

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb bar */}
      <div className="bg-[#f5f5f5]">
        <nav
          aria-label="Breadcrumb"
          className="max-w-[1320px] mx-auto px-4 sm:px-8 h-11 flex items-center gap-2 text-[15px] text-[#333]"
        >
          <button onClick={() => selectCategory('all')} className="hover:text-[#006194] cursor-pointer">
            Sản phẩm
          </button>
          {selectedCategory !== 'all' && (
            <>
              <span className="text-[#bbb]">/</span>
              <span aria-current="page">{categoryLabel}</span>
            </>
          )}
        </nav>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 sm:py-10 lg:flex lg:gap-12">
        {/* Filter sidebar */}
        <aside
          className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block lg:w-[260px] shrink-0 mb-8 lg:mb-0`}
          aria-label="Bộ lọc sản phẩm"
        >
          <h2 className="hidden lg:block text-[30px] font-bold text-[#111] leading-none pb-2">Bộ lọc</h2>

          <div className="pt-4 lg:pt-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#6b7280]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên máy, hãng..."
                aria-label="Tìm sản phẩm"
                className="w-full h-11 pl-10 pr-3 border border-[#d1d5db] text-[15px] text-[#111] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#111]"
              />
            </div>
          </div>

          <FilterGroup title="Danh mục sản phẩm">
            <ul className="space-y-0.5">
              {CATEGORIES.map((cat) => {
                const count =
                  cat.key === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat.key).length;
                if (count === 0) return null;
                const isSelected = selectedCategory === cat.key;
                return (
                  <li key={cat.key}>
                    <button
                      type="button"
                      onClick={() => selectCategory(cat.key)}
                      className={`w-full flex items-center justify-between py-1.5 text-left text-[16px] tracking-[0.01em] cursor-pointer transition-colors ${
                        isSelected ? 'text-[#111] font-bold' : 'text-[#333] hover:text-[#006194]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[14px] font-medium text-[#9ca3af]">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </FilterGroup>

          {brandFacets.length > 1 && (
            <FilterGroup title="Hãng sản xuất">
              {brandFacets.map((f) => (
                <CheckRow
                  key={f.value}
                  label={f.value}
                  count={f.count}
                  checked={selectedBrands.includes(f.value)}
                  onChange={() => toggle(selectedBrands, f.value, setSelectedBrands)}
                />
              ))}
            </FilterGroup>
          )}

          {originFacets.length > 1 && (
            <FilterGroup title="Xuất xứ">
              {originFacets.map((f) => (
                <CheckRow
                  key={f.value}
                  label={f.value}
                  count={f.count}
                  checked={selectedOrigins.includes(f.value)}
                  onChange={() => toggle(selectedOrigins, f.value, setSelectedOrigins)}
                />
              ))}
            </FilterGroup>
          )}

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedBrands([]);
                setSelectedOrigins([]);
              }}
              className="mt-5 text-[15px] text-[#111] underline underline-offset-4 cursor-pointer"
            >
              Xóa bộ lọc ({activeFilterCount})
            </button>
          )}
        </aside>

        {/* Listing */}
        <section className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h1 className="flex items-baseline gap-3 text-[#111]">
              <span className="text-[24px] sm:text-[28px] font-bold leading-tight">{categoryLabel}</span>
              <span className="text-[16px] sm:text-[18px]">
                <strong className="font-bold">{filteredProducts.length}</strong> sản phẩm
              </span>
            </h1>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                aria-expanded={mobileFiltersOpen}
                className="lg:hidden h-12 px-4 border border-[#d1d5db] text-[15px] text-[#111] inline-flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <span>Bộ lọc{activeFilterCount ? ` (${activeFilterCount})` : ''}</span>
              </button>
              <label className="hidden sm:inline text-[16px] text-[#333]" htmlFor="product-sort">
                Sắp xếp theo
              </label>
              <div className="relative flex-1 sm:flex-none">
                <select
                  id="product-sort"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="w-full sm:w-[240px] h-12 appearance-none pl-4 pr-10 border border-[#d1d5db] bg-white text-[16px] text-[#111] focus:outline-none focus:border-[#111] cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#111]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[18px] text-[#111]">Không tìm thấy sản phẩm phù hợp.</p>
              <button
                onClick={resetAll}
                className="mt-5 h-11 px-8 border border-[#111] text-[14px] font-semibold uppercase tracking-wide text-[#111] hover:bg-[#111] hover:text-white transition-colors cursor-pointer"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
              {filteredProducts.map((prod) => (
                <article key={prod.id} className="group flex flex-col">
                  <div className="relative w-full aspect-square overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(prod)}
                      aria-label={`Xem chi tiết ${prod.name}`}
                      className="absolute inset-0 cursor-pointer"
                    >
                      <img
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        alt={prod.alt}
                        src={prod.image}
                        loading="lazy"
                      />
                    </button>

                    {/* Hover actions — desktop only; on touch screens tapping the photo opens the detail view */}
                    <div className="absolute inset-x-2 bottom-2 hidden lg:flex gap-2 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:focus-within:opacity-100 lg:focus-within:translate-y-0 transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => onOpenConsultation(prod.name)}
                        className="flex-1 h-11 bg-white border border-[#e5e7eb] text-[12px] sm:text-[13px] font-bold uppercase tracking-wide text-[#111] inline-flex items-center justify-center gap-1.5 hover:bg-[#111] hover:text-white hover:border-[#111] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">request_quote</span>
                        <span>Báo giá</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectProduct(prod)}
                        aria-label={`Xem nhanh ${prod.name}`}
                        className="w-11 h-11 bg-[#333] text-white inline-flex items-center justify-center hover:bg-[#111] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 text-[14px] sm:text-[15px] text-[#555]">
                      <span className="truncate">{brandName(prod)}</span>
                      <span className="truncate text-right">{originName(prod)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(prod)}
                      className="mt-2 text-left text-[15px] sm:text-[16px] text-[#111] leading-snug line-clamp-2 hover:text-[#006194] transition-colors cursor-pointer"
                    >
                      {prod.name}
                    </button>
                    <div className="mt-2 text-[15px] sm:text-[16px] font-bold text-[#e11d2a]">Liên hệ báo giá</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
