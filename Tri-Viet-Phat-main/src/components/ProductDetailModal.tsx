import React, { useState } from 'react';
import { Product } from '../types';
import { ProvinceSelect } from './ProvinceSelect';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestQuote: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestQuote,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    region: 'Toàn quốc',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ tên/đơn vị để nhận tư vấn!');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại để nhận tư vấn!');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      onRequestQuote(product.name);
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  const defaultBenefits = product.benefits || [
    'Nhà cung cấp uy tín thiết bị y tế ở Việt Nam',
    'Thiết bị y tế đạt chất lượng giá cả hợp lý',
    'Thời gian bảo hành 12 tháng, dịch vụ chuyên nghiệp',
    'Hàng có sẵn kho có thể giao ngay',
    'Ưu đãi khi mua hàng với số lượng lớn',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-[#e2e8f0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] flex items-center justify-center transition-colors z-20 cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* TOP SECTION: 3 COLUMNS (IMAGE | INFO & BENEFITS | CONSULTATION FORM) */}
        <div className="p-5 sm:p-8 bg-white border-b border-[#e2e8f0]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="lg:col-span-4 flex items-center justify-center bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs">
              <img
                src={product.image}
                alt={product.alt}
                className="max-h-64 sm:max-h-72 w-full object-contain"
              />
            </div>

            {/* Center: Details & Benefits */}
            <div className="lg:col-span-5 space-y-3.5">
              <h1 className="text-[20px] sm:text-[22px] font-bold text-[#0f172a] leading-snug">
                {product.name}
              </h1>

              <div className="space-y-1.5 text-[14px] text-[#334155]">
                {product.model && (
                  <p>
                    <strong className="text-[#0f172a]">Model:</strong> {product.model}
                  </p>
                )}
                {product.manufacturer && (
                  <p>
                    <strong className="text-[#0f172a]">Hãng sản xuất:</strong>{' '}
                    {product.manufacturer}
                  </p>
                )}
                {product.countryOfOrigin && (
                  <p>
                    <strong className="text-[#0f172a]">Nước sản xuất:</strong>{' '}
                    {product.countryOfOrigin}
                  </p>
                )}
                {!product.manufacturer && (
                  <p>
                    <strong className="text-[#0f172a]">Hãng sản xuất:</strong> {product.brand}
                  </p>
                )}
                {!product.countryOfOrigin && (
                  <p>
                    <strong className="text-[#0f172a]">Xuất xứ:</strong> {product.origin}
                  </p>
                )}
              </div>

              {/* Red Bordered Benefits Box - Exactly 100% as in screenshot */}
              <div className="relative mt-6 pt-5 pb-4 px-4 sm:px-5 rounded-2xl border-2 border-[#d32f2f] bg-white">
                <div className="absolute -top-4 left-6 bg-[#d32f2f] text-white text-[12px] sm:text-[13px] font-bold py-1.5 px-4 rounded-full flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-white">check_circle</span>
                  <span className="tracking-wide">LỢI ÍCH KHI MUA HÀNG THIẾT BỊ Y TẾ</span>
                </div>
                <div className="space-y-3 pt-1 text-[13.5px] text-[#1e293b]">
                  <div className="flex items-start gap-3">
                    <span className="text-[#d32f2f] material-symbols-outlined text-[19px] shrink-0 mt-0.5">person</span>
                    <span>Nhà cung cấp uy tín thiết bị y tế ở Việt Nam</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-white bg-[#d32f2f] rounded-full w-4 h-4 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">P</span>
                    <span>Thiết bị y tế đạt chất lượng giá cả hợp lý</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#d32f2f] material-symbols-outlined text-[19px] shrink-0 mt-0.5">sync</span>
                    <span>Thời gian bảo hành 12 tháng, dịch vụ chuyên nghiệp</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#d32f2f] material-symbols-outlined text-[19px] shrink-0 mt-0.5">calendar_month</span>
                    <span>Hàng có sẵn kho có thể giao ngay</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#d32f2f] material-symbols-outlined text-[19px] shrink-0 mt-0.5">featured_seasonal_and_gifts</span>
                    <span>Ưu đãi khi mua hàng với số lượng lớn</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Registration Consultation Form - Exactly as in screenshot */}
            <div className="lg:col-span-3 bg-[#0088ff] text-white p-5 rounded-2xl shadow-md">
              <h3 className="text-center font-bold text-[16px] mb-3.5 tracking-tight text-white">
                Đăng ký nhận tư vấn
              </h3>

              {isSubmitted ? (
                <div className="p-4 bg-white/20 backdrop-blur-xs rounded-xl text-center space-y-2 text-white">
                  <span className="material-symbols-outlined text-[36px] text-white">
                    verified
                  </span>
                  <p className="text-[13px] font-bold">Gửi yêu cầu thành công!</p>
                  <p className="text-[11.5px] text-white/90">
                    Chuyên viên sẽ liên hệ lại ngay trong ít phút.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Họ tên/Đơn vị *"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-white text-[#0f172a] placeholder-[#94a3b8] text-[13px] px-3.5 py-2.5 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Điện thoại *"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-white text-[#0f172a] placeholder-[#94a3b8] text-[13px] px-3.5 py-2.5 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Địa chỉ email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-white text-[#0f172a] placeholder-[#94a3b8] text-[13px] px-3.5 py-2.5 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div>
                    <ProvinceSelect
                      value={formData.region}
                      onChange={(val) =>
                        setFormData({ ...formData, region: val })
                      }
                      variant="white"
                      includeAllNationOption={true}
                      hasIcon={false}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-[#e60000] hover:bg-[#cc0000] active:scale-[0.98] text-white font-bold text-[13px] py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
                  >
                    GỬI YÊU CẦU
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: CHI TIẾT SẢN PHẨM TAB & CONTENT */}
        <div className="p-5 sm:p-8 bg-white">
          {/* Red Tab Header: CHI TIẾT SẢN PHẨM */}
          <div className="border-b border-[#e2e8f0] mb-6">
            <div className="inline-block bg-[#d32f2f] text-white font-bold text-[14px] px-6 py-2 rounded-t-lg uppercase tracking-wider">
              CHI TIẾT SẢN PHẨM
            </div>
          </div>

          <div className="space-y-6 text-[#1e293b]">
            {/* Scraped Complete Content / Table from Website */}
            {product.detailHtml && (
              <div 
                className="product-detail-html overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: product.detailHtml }}
              />
            )}

            {/* 1. Thông số kỹ thuật (if no detailHtml or detailed specs available) */}
            {(!product.detailHtml || (product.specs && product.specs.length > 0 && product.id !== 'dewei')) && (
              <div>
                <h3 className="text-[17px] font-bold text-[#0f172a] mb-3">
                  {product.detailHtml ? 'Thông số bổ sung' : '1. Thông số kỹ thuật'}
                </h3>
                <ul className="space-y-2 text-[14px] pl-2 text-[#334155]">
                  {product.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#64748b]">-</span>
                      <span>
                        <strong className="text-[#0f172a]">{spec.label}:</strong> {spec.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 2. Đặc điểm kỹ thuật (if no detailHtml) */}
            {!product.detailHtml && (
              <div>
                <h3 className="text-[17px] font-bold text-[#0f172a] mb-3">
                  2. Đặc điểm kỹ thuật
                </h3>

                {product.detailedFeatures && product.detailedFeatures.length > 0 ? (
                  <div className="space-y-4 pl-2">
                    {product.detailedFeatures.map((feat, idx) => (
                      <div key={idx} className="space-y-1">
                        <h4 className="text-[14.5px] font-bold text-[#0f172a] flex items-center gap-2">
                          <span className="text-[#0f172a] text-[18px] leading-none">•</span>
                          <span>{feat.title}</span>
                        </h4>
                        <p className="text-[13.5px] text-[#475569] pl-4 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2 pl-2">
                    {product.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="text-[13.5px] text-[#475569] flex items-start gap-2"
                      >
                        <span className="text-[#0f172a]">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 3. Tiêu chuẩn chất lượng & Cam kết Trí Việt Phát */}
            {product.certifications && product.certifications.length > 0 && (
              <div className="pt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006194] text-[24px]">
                    verified_user
                  </span>
                  <div className="text-[13px] text-[#475569]">
                    <span className="font-bold text-[#0f172a] mr-2">
                      Tiêu chuẩn chứng nhận:
                    </span>
                    <span>{product.certifications.join(' • ')}</span>
                  </div>
                </div>

                <div className="text-[12.5px] text-[#64748b] italic">
                  Cam kết bảo hành chính hãng 12 tháng & hỗ trợ kỹ thuật trọn đời máy.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
