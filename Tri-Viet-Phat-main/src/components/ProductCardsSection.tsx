import React, { useMemo } from 'react';
import { PageTab } from '../types';
import { PRODUCTS } from '../data/mockData';
import { SectionHeader } from './SectionHeader';
import { RevealGroup, RevealItem } from './motion/Reveal';
import { Tilt } from './motion/Tilt';
import { HOME_PAGE } from '../content/pages';

interface ProductCardsSectionProps {
  onNavigateTab: (tab: PageTab, categoryFilter?: string) => void;
}

const CORE_CATEGORIES = [
  { key: 'may-xet-nghiem-sinh-hoa', title: 'Máy xét nghiệm sinh hóa' },
  { key: 'may-xet-nghiem-huyet-hoc', title: 'Máy xét nghiệm huyết học' },
  { key: 'may-xet-nghiem-nuoc-tieu', title: 'Máy xét nghiệm nước tiểu' },
  { key: 'may-xet-nghiem-dien-giai', title: 'Máy xét nghiệm điện giải' },
  { key: 'may-xet-nghiem-mien-dich', title: 'Máy xét nghiệm miễn dịch' },
  { key: 'may-phan-tich-dong-mau', title: 'Máy phân tích đông máu' },
  { key: 'may-xet-nghiem-hba1c', title: 'Máy xét nghiệm HbA1c' },
  { key: 'hoa-chat-xet-nghiem', title: 'Hóa chất xét nghiệm' },
];

/** Category cards (first product photo per category) with a frosted navy label bar. */
export const ProductCardsSection: React.FC<ProductCardsSectionProps> = ({ onNavigateTab }) => {
  const tiles = useMemo(
    () =>
      CORE_CATEGORIES.map((cat) => {
        const inCategory = PRODUCTS.filter((p) => p.category === cat.key);
        return { ...cat, image: inCategory[0]?.image, count: inCategory.length };
      }).filter((t) => t.count > 0),
    []
  );

  return (
    <section className="relative w-full py-14 sm:py-20 bg-white bg-dots">
      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-8">
        <SectionHeader
          align="center"
          title={HOME_PAGE.categoriesTitle}
          description={HOME_PAGE.categoriesDesc}
          actionLabel="Xem tất cả sản phẩm"
          onAction={() => onNavigateTab('san-pham')}
        />

        <RevealGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tiles.map((tile) => (
            <RevealItem key={tile.key}>
              <Tilt className="rounded-2xl">
                <button
                  type="button"
                  onClick={() => onNavigateTab('san-pham', tile.key)}
                  className="group fx-shine relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[#f3f7fb] border border-[#e3ebf3] shadow-[0_4px_16px_rgba(10,37,64,0.06)] hover:shadow-[0_24px_48px_-16px_rgba(10,37,64,0.35)] transition-shadow duration-500 text-left cursor-pointer"
                >
                  {tile.image && (
                    <img
                      src={tile.image}
                      alt={tile.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain p-6 sm:p-8 pb-20 sm:pb-24 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-translate-y-2"
                    />
                  )}

                  {/* Count badge */}
                  <span className="absolute right-3 top-3 z-10 px-2.5 py-1 rounded-full bg-white/90 text-[11px] sm:text-[12px] font-semibold text-[#0a2540] shadow-sm">
                    {tile.count} sản phẩm
                  </span>

                  {/* Frosted label bar */}
                  <span className="absolute inset-x-2.5 bottom-2.5 z-10 rounded-xl overflow-hidden">
                    <span className="absolute inset-0 bg-[#0a2540]/85 backdrop-blur-sm" aria-hidden="true" />
                    <span
                      className="absolute inset-0 bg-linear-to-r from-[#0a94dc] to-[#e11d2a] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      aria-hidden="true"
                    />
                    <span className="relative flex items-center justify-between gap-2 px-3 sm:px-4 py-3">
                      <span className="text-[12px] sm:text-[14px] font-bold uppercase tracking-wide text-white leading-tight">
                        {tile.title}
                      </span>
                      <span className="material-symbols-outlined shrink-0 text-[20px] text-white transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-45">
                        arrow_forward
                      </span>
                    </span>
                  </span>
                </button>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
};
