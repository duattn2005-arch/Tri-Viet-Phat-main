import React from 'react';
import { PageTab } from '../types';
import { SectionHeader } from './SectionHeader';

interface ProductCardsSectionProps {
  onNavigateTab: (tab: PageTab, categoryFilter?: string) => void;
}

const CORE_CATEGORIES = [
  {
    key: 'may-xet-nghiem-huyet-hoc',
    title: 'Máy xét nghiệm huyết học',
    desc: 'Hệ thống huyết học tự động 3-part và 5-part laser.',
    models: 'Dirui BF-6800, BCC-3000B, Rayto RT-7600',
  },
  {
    key: 'may-xet-nghiem-sinh-hoa',
    title: 'Máy xét nghiệm sinh hóa',
    desc: 'Hệ thống sinh hóa tự động tốc độ cao và bán tự động.',
    models: 'Dirui CS-T240, CS-600B, CS-1200, RT-1904C',
  },
  {
    key: 'may-xet-nghiem-nuoc-tieu',
    title: 'Máy phân tích nước tiểu',
    desc: 'Máy đọc que 10–14 thông số và hệ thống soi cặn tự động.',
    models: 'Dirui H-100, H-500, FUS-2000, que thử 10/11/14P',
  },
  {
    key: 'may-xet-nghiem-dien-giai',
    title: 'Máy xét nghiệm điện giải',
    desc: 'Đo điện giải đồ trực tiếp ISE (Na+, K+, Cl-, Ca++, pH).',
    models: 'Convergent ISE, Audicom AC9800, Rayto RT-7200',
  },
  {
    key: 'may-xet-nghiem-mien-dich',
    title: 'Miễn dịch và đông máu',
    desc: 'Máy miễn dịch huỳnh quang và phân tích đông máu tự động.',
    models: 'Wondfo Finecare, EKF Quo-Test, Rayto RAC-050',
  },
  {
    key: 'hoa-chat-xet-nghiem',
    title: 'Hóa chất và vật tư IVD',
    desc: 'Thuốc thử sinh hóa, hóa chất huyết học, vật tư phòng lab.',
    models: 'Dewei, Dirui, Chema Diagnostica, cuvette, kim lấy mẫu',
  },
];

export const ProductCardsSection: React.FC<ProductCardsSectionProps> = ({ onNavigateTab }) => {
  return (
    <section className="w-full py-14 sm:py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        <SectionHeader
          title="Danh mục sản phẩm"
          description="Giải pháp khép kín cho phòng xét nghiệm, từ máy phân tích tự động đến hóa chất, chất chuẩn và vật tư tiêu hao."
          actionLabel="Tất cả sản phẩm"
          onAction={() => onNavigateTab('san-pham')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#e2e8f0]">
          {CORE_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => onNavigateTab('san-pham', cat.key)}
              className="group text-left p-6 sm:p-7 border-r border-b border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors cursor-pointer"
            >
              <h3 className="text-[17px] font-semibold text-[#0f172a] group-hover:text-[#006194] transition-colors">
                {cat.title}
              </h3>
              <p className="mt-2 text-[14px] text-[#475569] leading-relaxed">{cat.desc}</p>
              <p className="mt-3 text-[13px] text-[#64748b]">{cat.models}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
