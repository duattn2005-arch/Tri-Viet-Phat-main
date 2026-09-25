import React, { useState } from 'react';
import { PageBanner } from '../PageBanner';
import { sendLead } from '../../lib/sendLead';

interface ContactScreenProps {
  onOpenConsultation?: () => void;
  onOpenRepairService?: () => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ onOpenRepairService }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      await sendLead('lien-he', {
        'Họ và tên': fullName,
        'Số điện thoại': phone,
        Email: email,
        'Lời nhắn': message,
      });
    } catch (err) {
      setSendError((err as Error).message);
      return;
    } finally {
      setSending(false);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 5000);
  };

  return (
    <div className="w-full fx-page-bg min-h-screen">
      {/* Banner */}
      <PageBanner
        title="Liên hệ"
        backgroundImage="https://thietbiytegroup.com/wp-content/uploads/2024/09/lien-he-mua-hang.png"
        breadcrumbs={[{ label: 'Trang chủ' }, { label: 'Liên hệ' }]}
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Slogan */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[15px] sm:text-[16.5px] text-[#111111] font-medium leading-relaxed italic">
            "Trí Việt Phát luôn tiên phong nghiên cứu, phát triển và cung cấp cho thị trường các loại thiết bị, sản phẩm với chất lượng tốt nhất."
          </p>
        </div>

        {/* Repair Service CTA Banner */}
        {onOpenRepairService && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6  bg-linear-to-r from-[#071a2e] to-[#0a2540] text-white ">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12  bg-white/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">build</span>
              </div>
              <div>
                <h3 className="text-[16px] sm:text-[17px] font-bold">
                  Thiết bị gặp sự cố cần sửa chữa?
                </h3>
                <p className="text-[13px] text-[#e5e5e5] [text-wrap:balance]">
                  Đăng ký dịch vụ sửa chữa để kỹ sư kỹ thuật liên hệ và xử lý nhanh nhất.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenRepairService}
              className="shrink-0 px-6 py-3  bg-white hover:bg-[#f3f7fb] text-[#111111] font-bold text-[13.5px]   transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Đăng ký sửa chữa</span>
            </button>
          </div>
        )}

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Contact Form */}
          <div className="lg:col-span-6 fx-panel p-5 sm:p-6  flex flex-col justify-between">
            <div>
              <h3 className="pb-3 border-b border-[#e5e5e5] text-[18px] font-bold text-[#111111] mb-5">Liên hệ gửi yêu cầu</h3>

              {submitted ? (
                <div className="p-5  bg-[#edf3f8] border border-[#e5e5e5] text-[#111111] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[15px]">
                    <span className="material-symbols-outlined text-[22px]">check_circle</span>
                    <span>Gửi yêu cầu liên hệ thành công!</span>
                  </div>
                  <p className="text-[13.5px]">
                    Cảm ơn bạn <strong>{fullName}</strong>. Đội ngũ chuyên viên tư vấn Trí Việt Phát sẽ liên hệ lại qua số điện thoại <strong>{phone}</strong> trong thời gian sớm nhất.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[13.5px] font-bold text-[#333333] mb-1.5">
                      Họ và tên <span className="text-[#e11d2a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên của bạn"
                      className="w-full px-4 py-2.5  border border-[#d4d4d4] text-[14px] focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540] transition-all bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13.5px] font-bold text-[#333333] mb-1.5">
                        Email của bạn <span className="text-[#e11d2a]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-4 py-2.5  border border-[#d4d4d4] text-[14px] focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540] transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[13.5px] font-bold text-[#333333] mb-1.5">
                        Số điện thoại <span className="text-[#e11d2a]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full px-4 py-2.5  border border-[#d4d4d4] text-[14px] focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540] transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-bold text-[#333333] mb-1.5">
                      Lời nhắn
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Vui lòng để lại nội dung yêu cầu báo giá, tư vấn thiết bị hoặc hợp tác..."
                      className="w-full px-4 py-2.5  border border-[#d4d4d4] text-[14px] focus:outline-none focus:border-[#0a2540] focus:ring-1 focus:ring-[#0a2540] transition-all bg-white"
                    />
                  </div>

                  {sendError && (
                    <p role="alert" className="text-[13.5px] font-semibold text-[#e11d2a]">
                      {sendError}
                    </p>
                  )}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="px-7 py-3  bg-[#0a2540] hover:bg-[#071a2e] disabled:opacity-60 disabled:cursor-wait text-white font-bold text-[14px]   transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>{sending ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: Company Info - Exactly 100% clone of thietbiytegroup.com */}
          <div className="lg:col-span-6 fx-panel p-5 sm:p-6  flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="pb-3 border-b border-[#e5e5e5] text-[18px] font-bold text-[#111111]">Thông tin công ty</h3>

              <div>
                <h3 className="text-[19px] font-bold text-[#111111] leading-snug mb-1.5">
                  Công ty thiết bị y tế Trí Việt Phát
                </h3>
                <p className="text-[13px] text-[#777777] leading-relaxed">
                  Công ty cung cấp thiết bị y tế dịch vụ Trí Việt Phát được thành lập theo Quyết định số <strong className="text-[#111111]">0105558779</strong> của Sở kế hoạch đầu tư thành phố Hà Nội
                </p>
              </div>

              <div className="space-y-3 pt-1 text-[13.5px]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9  bg-[#edf3f8] text-[#555555] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                  </div>
                  <div>
                    <span className="text-[#777777] text-[12px] block font-semibold">Hotline tư vấn 24/7:</span>
                    <a href="tel:0392123688" className="font-bold text-[#111111] text-[15px] fx-link">
                      0392.123.688
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9  bg-[#edf3f8] text-[#555555] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div>
                    <span className="text-[#777777] text-[12px] block font-semibold">Email:</span>
                    <a href="mailto:infothietbiyte168@gmail.com" className="font-bold text-[#111111] fx-link">
                      infothietbiyte168@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9  bg-[#edf3f8] text-[#555555] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">apartment</span>
                  </div>
                  <div>
                    <span className="text-[#777777] text-[12px] block font-semibold">Văn phòng giao dịch:</span>
                    <span className="text-[#111111] font-medium leading-relaxed text-[13px]">
                      Số 5, nhà P16 TT Trương Định, phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9  bg-[#edf3f8] text-[#555555] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <span className="text-[#777777] text-[12px] block font-semibold">Trụ sở công ty:</span>
                    <span className="text-[#111111] font-medium leading-relaxed text-[13px]">
                      Số 5, nhà P16 TT Trương Định, phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Google Map from original site */}
        <div className="fx-panel overflow-hidden ">
          <div className="p-3.5 bg-[#f3f7fb] border-b border-[#e5e5e5] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13.5px] font-bold text-[#111111]">
              <span className="material-symbols-outlined text-[#777777] text-[18px]">map</span>
              <span>Bản đồ chỉ đường - Trụ sở Công ty Thiết Bị Y Tế Trí Việt Phát</span>
            </div>
            <a
              href="https://maps.google.com/?q=168+Hoàng+Mai,+Hoàng+Văn+Thụ,+Hoàng+Mai,+Hà+Nội"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#111111] fx-link text-[12.5px] font-semibold flex items-center gap-1"
            >
              <span>Xem trên Google Maps</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>

          <div className="w-full h-[320px] sm:h-[360px]">
            <iframe
              title="Bản đồ chỉ đường Trí Việt Phát"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7450.086767292439!2d105.85339900000001!3d20.990897999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac1346790a47%3A0x6083b6d5d743c626!2zMTY4IMSQLiBIb8OgbmcgTWFpLCBIb8OgbmcgVsSDbiBUaOG7pSwgSG_DoG5nIE1haSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2sus!4v1715012797261!5m2!1svi!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
