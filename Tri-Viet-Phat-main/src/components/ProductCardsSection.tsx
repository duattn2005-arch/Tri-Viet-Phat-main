import React from 'react';
import { motion } from 'motion/react';
import { PageTab } from '../types';

interface ProductCardsSectionProps {
  onNavigateTab: (tab: PageTab, categoryFilter?: string) => void;
}

const CORE_CATEGORIES = [
  {
    key: 'may-xet-nghiem-huyet-hoc',
    title: 'Máy Xét Nghiệm Huyết Học',
    desc: 'Hệ thống huyết học tự động 3-part & 5-part laser',
    models: 'Dirui BF-6800, BCC-3000B, Rayto RT-7600...',
    icon: 'bloodtype',
    count: '12+ Thiết bị',
    iconColor: 'text-[#bb0112]',
    iconBg: 'bg-[#fee2e2]',
    borderColor: 'hover:border-[#bb0112]/40',
  },
  {
    key: 'may-xet-nghiem-sinh-hoa',
    title: 'Máy Xét Nghiệm Sinh Hóa',
    desc: 'Hệ thống sinh hóa tự động tốc độ cao & bán tự động',
    models: 'Dirui CS-T240, CS-600B, CS-1200, RT-1904C...',
    icon: 'biotech',
    count: '10+ Thiết bị',
    iconColor: 'text-[#006194]',
    iconBg: 'bg-[#e0f2fe]',
    borderColor: 'hover:border-[#006194]/40',
  },
  {
    key: 'may-xet-nghiem-nuoc-tieu',
    title: 'Máy Phân Tích Nước Tiểu',
    desc: 'Máy đọc que 10-14 thông số và hệ thống soi cặn tự động',
    models: 'Dirui H-100, H-500, FUS-2000, Que thử 10/11/14P...',
    icon: 'water_drop',
    count: '8+ Dòng máy & Que',
    iconColor: 'text-[#0284c7]',
    iconBg: 'bg-[#e0f2fe]',
    borderColor: 'hover:border-[#0284c7]/40',
  },
  {
    key: 'may-xet-nghiem-dien-giai',
    title: 'Máy Xét Nghiệm Điện Giải',
    desc: 'Đo điện giải đồ trực tiếp ISE (Na+, K+, Cl-, Ca++, pH)',
    models: 'Convergent ISE, Audicom AC9800, Rayto RT-7200...',
    icon: 'bolt',
    count: '6+ Thiết bị',
    iconColor: 'text-[#7c3aed]',
    iconBg: 'bg-[#ede9fe]',
    borderColor: 'hover:border-[#7c3aed]/40',
  },
  {
    key: 'may-xet-nghiem-mien-dich',
    title: 'Miễn Dịch & Đông Máu',
    desc: 'Máy miễn dịch huỳnh quang và phân tích đông máu tự động',
    models: 'Wondfo Finecare, EKF Quo-Test, Rayto RAC-050...',
    icon: 'vaccines',
    count: '8+ Dòng máy',
    iconColor: 'text-[#e11d48]',
    iconBg: 'bg-[#ffe4e6]',
    borderColor: 'hover:border-[#e11d48]/40',
  },
  {
    key: 'hoa-chat-xet-nghiem',
    title: 'Hóa Chất & Tiêu Hao IVD',
    desc: 'Thuốc thử sinh hóa, hóa chất huyết học, vật tư phòng Lab',
    models: 'Dewei, Dirui, Chema Diagnostica, Cuvette, Kim lấy mẫu...',
    icon: 'science',
    count: '30+ Hóa chất',
    iconColor: 'text-[#059669]',
    iconBg: 'bg-[#d1fae5]',
    borderColor: 'hover:border-[#059669]/40',
  },
];

export const ProductCardsSection: React.FC<ProductCardsSectionProps> = ({ onNavigateTab }) => {
  return (
    <section className="w-full py-8 sm:py-10 bg-[#f8fafc] border-b border-[#e2e8f0]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          className="flex flex-col items-center mb-6 sm:mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#006194] bg-[#e0f2fe] px-3 py-1 rounded-full mb-2">
            Hệ Thống Thiết Bị Toàn Diện
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight uppercase [text-wrap:balance]">
            DANH MỤC THIẾT BỊ & HÓA CHẤT TRỌNG TÂM
          </h2>
          <div className="w-14 h-1 bg-[#bb0112] rounded-full mt-2"></div>
          <p className="text-[13.5px] text-[#475569] max-w-2xl mt-2 [text-wrap:balance]">
            Giải pháp khép kín cho phòng xét nghiệm: Từ máy phân tích tự động chuẩn mực đến hóa chất, chất chuẩn và vật tư tiêu hao chính hãng.
          </p>
        </motion.div>

        {/* 6 Category Cards - staggered scroll entrance + 3D hover lift */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CORE_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.key}
              onClick={() => onNavigateTab('san-pham', cat.key)}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
              className={`card-3d rounded-2xl p-5 cursor-pointer flex flex-col justify-between group border ${cat.borderColor}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shadow-xs`}
                  >
                    <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                  </motion.div>
                  <span className="text-[11.5px] font-bold text-[#475569] bg-[#f1f5f9] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">
                    {cat.count}
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-[#0f172a] group-hover:text-[#006194] transition-colors mb-1.5">
                  {cat.title}
                </h3>

                <p className="text-[13px] text-[#475569] leading-relaxed mb-3">
                  {cat.desc}
                </p>

                <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]/80 text-[11.5px] text-[#64748b]">
                  <strong className="text-[#334155]">Tiêu biểu:</strong> {cat.models}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#f1f5f9] flex items-center justify-between text-[#006194] text-[13px] font-bold group-hover:text-[#bb0112] transition-colors">
                <span>Xem chi tiết danh mục</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
