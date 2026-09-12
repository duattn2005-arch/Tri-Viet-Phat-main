import React, { useState, useMemo } from 'react';
import { PRODUCTS, ARTICLES } from '../data/mockData';
import { Product, Article } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return PRODUCTS.slice(0, 4);
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredArticles = useMemo(() => {
    if (!query.trim()) return ARTICLES.slice(0, 3);
    const q = query.toLowerCase();
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#e2e8f0] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="p-4 border-b border-[#e2e8f0] flex items-center gap-3 bg-[#f8fafc]">
          <span className="material-symbols-outlined text-[#006194] text-[24px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm máy xét nghiệm, hóa chất, tài liệu, bài viết..."
            className="flex-1 bg-transparent text-[15px] text-[#0f172a] focus:outline-none placeholder:text-[#bfc7d2]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#475569] hover:text-[#0f172a] text-[13px] px-2 py-1 rounded bg-[#e2e8f0]"
            >
              Xóa
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#475569] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-5">
          {/* Products results */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-[#006194] uppercase tracking-wider">
                Thiết bị & Hóa chất ({filteredProducts.length})
              </span>
            </div>
            {filteredProducts.length === 0 ? (
              <p className="text-[13px] text-[#475569] py-2">Không tìm thấy sản phẩm phù hợp</p>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#e0f2fe]/40 transition-colors text-left border border-transparent hover:border-[#cce5ff] group"
                  >
                    <img
                      src={prod.image}
                      alt={prod.alt}
                      className="w-12 h-12 object-contain rounded-lg bg-[#f8fafc] p-1 border border-[#e2e8f0]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#e0f2fe] text-[#006194] text-[10px] font-bold">
                          {prod.categoryLabel}
                        </span>
                        <span className="text-[11px] text-[#475569]">{prod.brand}</span>
                      </div>
                      <h4 className="text-[13.5px] font-bold text-[#0f172a] truncate group-hover:text-[#006194]">
                        {prod.name}
                      </h4>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-[#bfc7d2] group-hover:text-[#006194]">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Articles results */}
          <div className="pt-3 border-t border-[#f1f5f9]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-[#bb0112] uppercase tracking-wider">
                Bài viết & Tin tức ({filteredArticles.length})
              </span>
            </div>
            {filteredArticles.length === 0 ? (
              <p className="text-[13px] text-[#475569] py-2">Không tìm thấy bài viết phù hợp</p>
            ) : (
              <div className="space-y-2">
                {filteredArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => {
                      onClose();
                      onSelectArticle(art);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors text-left border border-transparent hover:border-[#e2e8f0] group"
                  >
                    <img
                      src={art.image}
                      alt={art.alt}
                      className="w-12 h-12 object-cover rounded-lg bg-[#f8fafc] border border-[#e2e8f0]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-[#bb0112] font-semibold">{art.date}</span>
                      <h4 className="text-[13px] font-bold text-[#0f172a] line-clamp-1 group-hover:text-[#006194]">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-[#475569] line-clamp-1">{art.excerpt}</p>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-[#bfc7d2] group-hover:text-[#006194]">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
