import React from 'react';
import { COMPANY_INFO, CORE_VALUES, BUSINESS_AREAS, PARTNERS } from '../../data/mockData';

interface AboutScreenProps {
  onOpenConsultation: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onOpenConsultation }) => {
  return (
    <div className="w-full bg-medical-grid-3d py-4 sm:py-6 lg:py-7">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 space-y-6">

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 rounded-3xl overflow-hidden card-3d p-2 bg-white border border-[#cbd5e1]">
            <img
              src={COMPANY_INFO.aboutImage}
              alt="Đội ngũ chuyên gia Trí Việt Phát"
              className="w-full h-[320px] sm:h-[360px] object-cover rounded-2xl"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-5 sm:p-6 rounded-2xl card-3d space-y-2.5">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#006194] bg-[#e0f2fe] px-3 py-1 rounded-full inline-block">
                Hành Trình 16+ Năm
              </span>
              <h2 className="text-[22px] font-extrabold text-[#0f172a]">
                Xây Dựng Niềm Tin & Chuẩn Hóa Y Tế
              </h2>
              <p className="text-[13.5px] text-[#475569] leading-relaxed">
                Được thành lập theo Giấy phép ĐKKD số{' '}
                <strong className="text-[#006194]">{COMPANY_INFO.licenseNo}</strong> do{' '}
                {COMPANY_INFO.licensedBy},{' '}
                <strong className="text-[#0f172a]">Công ty TNHH Thương mại Dịch vụ Trí Việt Phát</strong> đã có hơn 16 năm liên tục phát triển trong ngành cung ứng trang thiết bị y tế và hóa chất xét nghiệm chẩn đoán in vitro (IVD).
              </p>
              <p className="text-[13.5px] text-[#475569] leading-relaxed">
                Với tôn chỉ “Chất lượng là nền tảng - Uy tín là tài sản”, chúng tôi là cầu nối tin cậy giữa các hãng thiết bị y tế hàng đầu thế giới (DIRUI, Wondfo, EKF, Dewei, Drawray, Audicom) và hệ thống các bệnh viện, phòng khám đa khoa, trung tâm xét nghiệm trên toàn quốc.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white p-4 rounded-2xl card-3d-subtle border border-[#bae6fd]">
                <div className="flex items-center gap-1.5 text-[#006194] mb-1">
                  <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                  <span className="text-[24px] font-black">16+ Năm</span>
                </div>
                <span className="text-[12px] font-medium text-[#475569]">
                  Kinh nghiệm phân phối và chuyển giao công nghệ
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl card-3d-subtle border border-[#fecaca]">
                <div className="flex items-center gap-1.5 text-[#bb0112] mb-1">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                  <span className="text-[24px] font-black">100%</span>
                </div>
                <span className="text-[12px] font-medium text-[#475569]">
                  Hóa chất & máy móc chính hãng có CO/CQ, CFS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="bg-white p-6 rounded-2xl card-3d flex flex-col h-full space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] text-[#006194] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[28px]">visibility</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#0f172a]">Tầm nhìn chiến lược</h3>
            <p className="text-[13.5px] text-[#475569] leading-relaxed flex-1">
              Trở thành thương hiệu hàng đầu Việt Nam về cung cấp giải pháp trọn gói phòng xét nghiệm y khoa, chuẩn hóa quy trình chẩn đoán lâm sàng theo tiêu chuẩn quốc tế ISO 15189.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl card-3d flex flex-col h-full space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#fee2e2] text-[#bb0112] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[28px]">flag</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#0f172a]">Sứ mệnh cao cả</h3>
            <p className="text-[13.5px] text-[#475569] leading-relaxed flex-1">
              Cung cấp trang thiết bị chuẩn xác, an toàn, hỗ trợ tối đa các y bác sĩ đưa ra quyết định điều trị kịp thời, chính xác cho hàng triệu bệnh nhân mỗi năm.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl card-3d flex flex-col h-full space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[28px]">military_tech</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#0f172a]">Giá trị cốt lõi</h3>
            <p className="text-[13.5px] text-[#475569] leading-relaxed flex-1">
              Chất lượng tối ưu - Uy tín tuyệt đối - Đồng hành dài lâu. Mọi hoạt động của công ty luôn đặt sự an toàn của người bệnh lên hàng đầu.
            </p>
          </div>
        </div>

        {/* Business Activities */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl card-3d space-y-4">
          <div className="border-b border-[#f1f5f9] pb-3">
            <h3 className="text-[20px] font-bold text-[#0f172a]">
              Lĩnh Vực Hoạt Động Chuyên Môn
            </h3>
            <p className="text-[13px] text-[#475569]">
              Danh mục các sản phẩm và dịch vụ thế mạnh của Trí Việt Phát
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {BUSINESS_AREAS.map((area, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl card-3d-subtle bg-white hover:bg-[#e0f2fe]/30 transition-colors h-full flex flex-col justify-start"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-[#006194] text-[18px] shrink-0">
                    check_circle
                  </span>
                  <h4 className="text-[14.5px] font-bold text-[#0f172a]">{area.title}</h4>
                </div>
                <p className="text-[12.5px] text-[#475569] leading-relaxed flex-1">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner with 3D Bevel */}
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#003d66] via-[#00517d] to-[#003865] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_12px_32px_rgba(0,60,120,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-[#006194]/40">
          <div className="space-y-1 text-center sm:text-left max-w-xl">
            <h3 className="text-[19px] font-bold text-white">Hợp tác cùng Trí Việt Phát</h3>
            <p className="text-[13px] text-[#cce5ff] leading-relaxed">
              Liên hệ ngay để nhận catalog chi tiết, bảng báo giá dự toán và chính sách ưu đãi dành riêng cho cơ sở y tế của bạn.
            </p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="px-6 py-3 rounded-xl btn-3d-red text-white font-bold text-[13.5px] cursor-pointer shrink-0 inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">handshake</span>
            <span>Đăng ký hợp tác / Báo giá</span>
          </button>
        </div>
      </div>
    </div>
  );
};
