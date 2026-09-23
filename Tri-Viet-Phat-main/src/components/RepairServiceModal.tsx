import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/mockData';

interface RepairServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export const RepairServiceModal: React.FC<RepairServiceModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [brand, setBrand] = useState('');
  const [address, setAddress] = useState('');
  const [urgency, setUrgency] = useState<'Bình thường' | 'Khẩn cấp'>('Bình thường');
  const [issueDescription, setIssueDescription] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubmitState('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/repair-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          deviceName,
          brand,
          address,
          urgency,
          issueDescription,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data.error || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
        setSubmitState('error');
        return;
      }

      setSubmitState('success');
    } catch {
      setErrorMessage('Không thể kết nối đến hệ thống. Vui lòng kiểm tra lại kết nối mạng và thử lại.');
      setSubmitState('error');
    }
  };

  const handleClose = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setDeviceName('');
    setBrand('');
    setAddress('');
    setUrgency('Bình thường');
    setIssueDescription('');
    setSubmitState('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white  max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#e5e5e5] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#555555] flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {submitState === 'success' ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#f2f2f2] text-[#555555] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="text-[20px] font-bold text-[#111111]">
              Đã gửi yêu cầu sửa chữa thành công!
            </h3>
            <p className="text-[14px] text-[#555555] max-w-sm mx-auto leading-relaxed">
              Cảm ơn Quý khách! Bộ phận kỹ thuật đã nhận được thông báo và sẽ liên hệ qua số điện thoại <strong>{phone}</strong> để sắp xếp lịch kiểm tra, sửa chữa trong thời gian sớm nhất.
            </p>
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-6 py-2.5  btn-3d-blue text-white text-[13.5px] font-bold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-[#111111] text-white text-[11px] font-bold mb-2">
                Dịch Vụ Kỹ Thuật 24/7
              </span>
              <h3 className="text-[20px] font-bold text-[#111111] [text-wrap:balance]">
                Đăng ký dịch vụ sửa chữa thiết bị y tế
              </h3>
              <p className="text-[13px] text-[#555555] mt-1 [text-wrap:balance]">
                Kỹ sư y sinh của Trí Việt Phát sẽ liên hệ và có mặt xử lý sự cố trong thời gian sớm nhất.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                    Họ tên/Đơn vị <span className="text-[#e11d2a]">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#555555] text-[18px]">
                      person
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Họ và tên hoặc tên đơn vị"
                      className="w-full pl-9 pr-3 py-2.5  bg-white text-[13.5px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] border border-[#d4d4d4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                    Số điện thoại <span className="text-[#e11d2a]">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#555555] text-[18px]">
                      call
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Số điện thoại liên hệ"
                      className="w-full pl-9 pr-3 py-2.5  bg-white text-[13.5px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] border border-[#d4d4d4]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                    Tên thiết bị / Model <span className="text-[#e11d2a]">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#555555] text-[18px]">
                      biotech
                    </span>
                    <input
                      type="text"
                      required
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="Ví dụ: Máy xét nghiệm sinh hóa CS-1600"
                      className="w-full pl-9 pr-3 py-2.5  bg-white text-[13.5px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] border border-[#d4d4d4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                    Hãng sản xuất
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#555555] text-[18px]">
                      factory
                    </span>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ví dụ: Dirui, Audicom..."
                      className="w-full pl-9 pr-3 py-2.5  bg-white text-[13.5px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] border border-[#d4d4d4]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                    Địa chỉ email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#555555] text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email nhận phản hồi (nếu có)"
                      className="w-full pl-9 pr-3 py-2.5  bg-white text-[13.5px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] border border-[#d4d4d4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                    Mức độ khẩn cấp
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as 'Bình thường' | 'Khẩn cấp')}
                    className="w-full px-3 py-2.5  bg-white text-[13.5px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] border border-[#d4d4d4] cursor-pointer"
                  >
                    <option value="Bình thường">Bình thường</option>
                    <option value="Khẩn cấp">Khẩn cấp (thiết bị ngừng hoạt động)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                  Địa chỉ lắp đặt thiết bị
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#555555] text-[18px]">
                    location_on
                  </span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Địa chỉ bệnh viện/phòng khám đang sử dụng thiết bị"
                    className="w-full pl-9 pr-3 py-2.5  bg-white text-[13.5px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] border border-[#d4d4d4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#111111] mb-1">
                  Mô tả sự cố <span className="text-[#e11d2a]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Mô tả chi tiết lỗi/sự cố thiết bị đang gặp phải..."
                  className="w-full p-3  bg-white text-[13.5px] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111] border border-[#d4d4d4]"
                ></textarea>
              </div>

              {submitState === 'error' && (
                <div className="flex items-start gap-2 p-3  bg-[#fef2f2] border border-[#e5e5e5] text-[#e11d2a] text-[13px]">
                  <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitState === 'submitting'}
                  className="flex-1 py-3.5  btn-3d-blue text-white text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer  disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitState === 'submitting' ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      <span>ĐANG GỬI...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">build</span>
                      <span>GỬI YÊU CẦU SỬA CHỮA</span>
                    </>
                  )}
                </button>
              </div>

              {/* Fast Direct Contact Bar */}
              <div className="pt-3 border-t border-[#f2f2f2] flex flex-wrap items-center justify-between gap-2 text-[12px]">
                <span className="text-[#777777]">Sự cố khẩn cấp cần xử lý ngay?</span>
                <a
                  href={`tel:${COMPANY_INFO.hotline.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-center gap-1 text-[#111111] font-bold hover:underline"
                >
                  <span className="material-symbols-outlined text-[15px]">call</span>
                  <span>Hotline: {COMPANY_INFO.hotline}</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
