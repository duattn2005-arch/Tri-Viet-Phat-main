import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../../data/mockData';
import { Product } from '../../types';

interface ProductsScreenProps {
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onOpenConsultation: (prefilledProduct?: string) => void;
}

const CATEGORIES = [
  { key: 'all', label: 'Tất cả sản phẩm', icon: 'apps' },
  { key: 'may-xet-nghiem-sinh-hoa', label: 'Xét nghiệm sinh hóa', icon: 'biotech' },
  { key: 'may-xet-nghiem-nuoc-tieu', label: 'Xét nghiệm nước tiểu', icon: 'water_drop' },
  { key: 'may-xet-nghiem-huyet-hoc', label: 'Xét nghiệm huyết học', icon: 'bloodtype' },
  { key: 'may-xet-nghiem-dien-giai', label: 'Xét nghiệm điện giải', icon: 'bolt' },
  { key: 'may-xet-nghiem-mien-dich', label: 'Xét nghiệm miễn dịch', icon: 'vaccines' },
  { key: 'may-phan-tich-dong-mau', label: 'Phân tích đông máu', icon: 'hourglass_empty' },
  { key: 'may-xet-nghiem-hba1c', label: 'Xét nghiệm HbA1c', icon: 'monitor_heart' },
  { key: 'hoa-chat-xet-nghiem', label: 'Hóa chất & Thuốc thử', icon: 'science' },
  { key: 'thiet-bi-khac', label: 'Máy ly tâm & Khác', icon: 'cyclone' },
];

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onOpenConsultation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-medical-grid-3d py-4 sm:py-6 lg:py-7">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 space-y-4 sm:space-y-5">
        {/* Filter Bar & Search */}
        <div className="card-3d bg-white p-4 sm:p-5 rounded-2xl space-y-3.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#475569] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên máy, hãng..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#f1f5f9] text-[13.5px] text-[#0f172a] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006194] border border-[#e2e8f0]/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[#475569] hover:text-[#0f172a] text-[12px] font-medium"
                >
                  Xóa
                </button>
              )}
            </div>

            <div className="text-[13px] text-[#475569] bg-[#f8fafc] px-3.5 py-1.5 rounded-xl border border-[#e2e8f0]">
              Hiển thị: <strong className="text-[#006194]">{filteredProducts.length}</strong> thiết bị
            </div>
          </div>

          {/* Category Filter Grid - Symmetrical & Balanced */}
          <div className="pt-3 border-t border-[#f1f5f9]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {CATEGORIES.map((cat) => {
                const count =
                  cat.key === 'all'
                    ? PRODUCTS.length
                    : PRODUCTS.filter((p) => p.category === cat.key).length;
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'btn-3d-blue text-white'
                        : 'card-3d-subtle bg-linear-to-b from-[#ffffff] to-[#f8fafc] text-[#334155] border-[#e2e8f0] hover:text-[#006194]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      <span
                        className={`material-symbols-outlined text-[18px] shrink-0 ${
                          isSelected ? 'text-white' : 'text-[#006194]'
                        }`}
                      >
                        {cat.icon}
                      </span>
                      <span className="truncate">{cat.label}</span>
                    </div>
                    <span
                      className={`text-[11px] min-w-[20px] h-5 px-1.5 rounded-full font-bold inline-flex items-center justify-center shrink-0 ml-1.5 ${
                        isSelected
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
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e2e8f0] space-y-4">
            <span className="material-symbols-outlined text-[48px] text-[#bfc7d2]">
              manage_search
            </span>
            <h3 className="text-[18px] font-bold text-[#0f172a]">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-[14px] text-[#475569]">
              Vui lòng thử tìm kiếm bằng từ khóa khác hoặc chọn danh mục khác.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-xl bg-[#006194] text-white text-[13px] font-bold"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col h-full card-3d rounded-2xl overflow-hidden group"
              >
                <div className="relative bg-linear-to-b from-[#f8fafc] to-[#f1f5f9] p-4 sm:p-6 flex items-center justify-center h-48 sm:h-56 shrink-0 border-b border-[#e2e8f0]/80">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,97,148,0.04),transparent_70%)] pointer-events-none"></div>
                  <img
                    className="max-h-36 sm:max-h-44 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    alt={prod.alt}
                    src={prod.image}
                  />
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-[#e0f2fe] text-[#075985] text-[11px] px-2.5 py-0.5 rounded-lg font-bold truncate max-w-[65%] shadow-xs border border-[#bae6fd]">
                        {prod.categoryLabel}
                      </span>
                      {prod.brand && (
                        <span className="text-[11px] text-[#64748b] font-medium truncate max-w-[32%] text-right" title={prod.brand}>
                          {prod.brand.replace(' INDUSTRIAL CO., LTD', '')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[14.5px] sm:text-[15px] font-bold text-[#0f172a] line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-[#006194] transition-colors leading-snug min-h-[40px] sm:h-[44px] flex items-start">
                      {prod.name}
                    </h3>
                    <p className="text-[12px] sm:text-[12.5px] text-[#475569] line-clamp-2 mb-3 sm:mb-4 leading-relaxed min-h-[34px] sm:h-[38px]">
                      {prod.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#f1f5f9] mt-auto">
                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl btn-3d-red text-[12.5px] sm:text-[13px] font-bold tracking-wide cursor-pointer"
                    >
                      <span>XEM CHI TIẾT</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                    <button
                      onClick={() => onOpenConsultation(prod.name)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-linear-to-b from-[#f0f9ff] to-[#e0f2fe] hover:from-[#e0f2fe] hover:to-[#bae6fd] text-[#006194] border border-[#bae6fd] text-[12px] sm:text-[12.5px] font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">request_quote</span>
                      <span>Nhận báo giá</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Contact Strip with 3D Bevel */}
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#003d66] via-[#00517d] to-[#003865] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_12px_32px_rgba(0,60,120,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-[#006194]/40 mt-8">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-[20px] font-bold text-white">Cần cấu hình hoặc bảng báo giá dự thầu?</h3>
            <p className="text-[14px] text-[#cce5ff]">
              Đội ngũ chuyên gia kỹ thuật Trí Việt Phát sẵn sàng tư vấn giải pháp phòng xét nghiệm tối ưu chi phí.
            </p>
          </div>
          <button
            onClick={() => onOpenConsultation()}
            className="px-6 py-3 rounded-xl bg-[#d91828] hover:bg-[#b91c1c] text-white font-bold text-[14px] transition-all shadow cursor-pointer shrink-0 inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">request_quote</span>
            <span>Yêu cầu tư vấn & Báo giá</span>
          </button>
        </div>
      </div>
    </div>
  );
};
