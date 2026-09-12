import React, { useState } from 'react';
import { PageBanner } from '../PageBanner';

interface ContactScreenProps {
  onOpenConsultation?: () => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Banner */}
      <PageBanner
        title="Liên hệ"
        backgroundImage="https://thietbiytegroup.com/wp-content/uploads/2024/09/lien-he-mua-hang.png"
        breadcrumbs={[{ label: 'Trang chủ' }, { label: 'Liên hệ' }]}
      />

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Slogan */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[15px] sm:text-[16.5px] text-[#1e293b] font-medium leading-relaxed italic">
            "Trí Việt Phát luôn tiên phong nghiên cứu, phát triển và cung cấp cho thị trường các loại thiết bị, sản phẩm với chất lượng tốt nhất."
          </p>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Contact Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-[#D7040F] mb-5">
                <span className="inline-block bg-[#D7040F] text-white text-[14.5px] font-bold uppercase px-3.5 py-1.5 rounded-tr-[14px] tracking-wide">
                  Liên hệ gửi yêu cầu
                </span>
              </div>

              {submitted ? (
                <div className="p-5 rounded-xl bg-[#e0f2fe] border border-[#bae6fd] text-[#006194] space-y-2">
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
                    <label className="block text-[13.5px] font-bold text-[#334155] mb-1.5">
                      Họ và tên <span className="text-[#bb0112]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên của bạn"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[14px] focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194] transition-all bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13.5px] font-bold text-[#334155] mb-1.5">
                        Email của bạn <span className="text-[#bb0112]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[14px] focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194] transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[13.5px] font-bold text-[#334155] mb-1.5">
                        Số điện thoại <span className="text-[#bb0112]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[14px] focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194] transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-bold text-[#334155] mb-1.5">
                      Lời nhắn
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Vui lòng để lại nội dung yêu cầu báo giá, tư vấn thiết bị hoặc hợp tác..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[14px] focus:outline-none focus:border-[#006194] focus:ring-1 focus:ring-[#006194] transition-all bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl bg-[#D7040F] hover:bg-[#b0030c] text-white font-bold text-[14px] uppercase tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Gửi yêu cầu</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: Company Info - Exactly 100% clone of thietbiytegroup.com */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b-2 border-[#D7040F] pb-0">
                <span className="inline-block bg-[#D7040F] text-white text-[14.5px] font-bold uppercase px-3.5 py-1.5 rounded-tr-[14px] tracking-wide">
                  Thông tin công ty
                </span>
              </div>

              <div>
                <h3 className="text-[19px] font-extrabold text-[#006194] uppercase leading-snug mb-1.5">
                  Công ty thiết bị y tế Trí Việt Phát
                </h3>
                <p className="text-[13px] text-[#64748b] leading-relaxed">
                  Công ty cung cấp thiết bị y tế dịch vụ Trí Việt Phát được thành lập theo Quyết định số <strong className="text-[#0f172a]">0105558779</strong> của Sở kế hoạch đầu tư thành phố Hà Nội
                </p>
              </div>

              <div className="space-y-3 pt-1 text-[13.5px]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#fee2e2] text-[#bb0112] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">phone</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-[12px] block font-semibold">Điện thoại bàn:</span>
                    <a href="tel:0392123688" className="font-bold text-[#bb0112] text-[15px] hover:underline">
                      0392.123.688
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#fee2e2] text-[#bb0112] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-[12px] block font-semibold">Hotline tư vấn 24/7:</span>
                    <a href="tel:0904698699" className="font-bold text-[#bb0112] text-[15px] hover:underline">
                      0904.698.699
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#006194] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-[12px] block font-semibold">Email:</span>
                    <a href="mailto:infothietbiyte168@gmail.com" className="font-bold text-[#006194] hover:underline">
                      infothietbiyte168@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#006194] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">apartment</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-[12px] block font-semibold">Văn phòng giao dịch:</span>
                    <span className="text-[#1e293b] font-medium leading-relaxed text-[13px]">
                      Số 5, nhà P16 TT Trương Định, phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#006194] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] text-[12px] block font-semibold">Trụ sở công ty:</span>
                    <span className="text-[#1e293b] font-medium leading-relaxed text-[13px]">
                      Số 5, nhà P16 TT Trương Định, phường Tương Mai, Quận Hoàng Mai, Thành phố Hà Nội, Việt Nam
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Google Map from original site */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs">
          <div className="p-3.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13.5px] font-bold text-[#0f172a]">
              <span className="material-symbols-outlined text-[#bb0112] text-[18px]">map</span>
              <span>Bản đồ chỉ đường - Trụ sở Công ty Thiết Bị Y Tế Trí Việt Phát</span>
            </div>
            <a
              href="https://maps.google.com/?q=168+Hoàng+Mai,+Hoàng+Văn+Thụ,+Hoàng+Mai,+Hà+Nội"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#006194] hover:underline text-[12.5px] font-semibold flex items-center gap-1"
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
