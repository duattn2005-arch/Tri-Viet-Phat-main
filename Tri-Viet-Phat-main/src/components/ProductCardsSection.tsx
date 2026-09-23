import React, { useMemo } from 'react';
import { PageTab } from '../types';
import { PRODUCTS } from '../data/mockData';
import { SectionHeader } from './SectionHeader';
import { RevealGroup, RevealItem } from './motion/Reveal';

interface ProductCardsSectionProps {
  onNavigateTab: (tab: PageTab, categoryFilter?: string) => void;
}

const CORE_CATEGORIES = [
  { key: 'may-xet-nghiem-huyet-hoc', title: 'Huyết học' },
  { key: 'may-xet-nghiem-sinh-hoa', title: 'Sinh hóa' },
  { key: 'may-xet-nghiem-nuoc-tieu', title: 'Nước tiểu' },
  { key: 'may-xet-nghiem-dien-giai', title: 'Điện giải' },
  { key: 'may-xet-nghiem-mien-dich', title: 'Miễn dịch' },
  { key: 'hoa-chat-xet-nghiem', title: 'Hóa chất' },
];

/** Image tiles, one per category, using the first product photo in that category. */
export const ProductCardsSection: React.FC<ProductCardsSectionProps> = ({ onNavigateTab }) => {
  const tiles = useMemo(
    () =>
      CORE_CATEGORIES.map((cat) => {
        const inCategory = PRODUCTS.filter((p) => p.category === cat.key);
        return { ...cat, image: inCategory[0]?.image, count: inCategory.length };
      }),
    []
  );

  return (
    <section className="w-full py-12 sm:py-16 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        <SectionHeader
          title="Danh mục sản phẩm"
          actionLabel="Tất cả sản phẩm"
          onAction={() => onNavigateTab('san-pham')}
        />

        <RevealGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {tiles.map((tile) => (
            <RevealItem key={tile.key}>
              <button
                type="button"
                onClick={() => onNavigateTab('san-pham', tile.key)}
                className="group relative w-full aspect-[3/4] overflow-hidden bg-[#f2f2f2] hover:bg-[#e9e9e9] transition-colors duration-500 text-left cursor-pointer"
              >
                {tile.image && (
                  <img
                    src={tile.image}
                    alt={`Máy xét nghiệm ${tile.title.toLowerCase()}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-6 pb-16 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-translate-y-2"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-center justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block text-[15px] sm:text-[16px] font-semibold text-[#111111]">{tile.title}</span>
                    {tile.count > 0 && (
                      <span className="block text-[12px] text-[#777777]">{tile.count} sản phẩm</span>
                    )}
                  </span>
                  <span className="shrink-0 w-9 h-9 rounded-full bg-white text-[#111111] flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px] transition-transform duration-500 group-hover:-rotate-45">arrow_forward</span>
                  </span>
                </div>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
};
