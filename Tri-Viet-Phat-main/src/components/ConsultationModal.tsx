import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/mockData';
import { ProvinceSelect } from './ProvinceSelect';
import { sendLead } from '../lib/sendLead';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledProduct?: string;
}

const QUICK_CHIPS = ['Máy huyết học', 'Máy sinh hóa', 'Máy nước tiểu', 'Máy điện giải', 'Hóa chất Dewei'];

const INPUT_CLASS =
  'w-full h-11 px-3.5 bg-white border border-[#d4d4d4] text-[14px] text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#0a2540]';
const LABEL_CLASS = 'block text-[13px] font-semibold text-[#111111] mb-1.5';

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, prefilledProduct = '' }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('Hà Nội');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    setNote(prefilledProduct ? `Tôi cần báo giá thiết bị: ${prefilledProduct}` : '');
    setSubmitted(false);
    setSendError('');
  }, [prefilledProduct, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    try {
      await sendLead('bao-gia', {
        'Họ và tên': fullName,
        'Số điện thoại': phone,
        Email: email,
        'Tỉnh/Thành': province,
        'Nội dung': note,
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
      onClose();
    }, 3000);
  };

  const addChip = (chip: string) =>
    setNote((prev) => (prev.includes(chip) ? prev : prev ? `${prev}, ${chip}` : `Cần báo giá: ${chip}`));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-title"
    >
      <div
        className="bg-white max-w-xl w-full max-h-[calc(100vh-32px)] overflow-y-auto p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[#111111] hover:opacity-60 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-10" role="status">
            <span className="material-symbols-outlined text-[44px] text-[#111111]">check_circle</span>
            <h3 className="mt-3 text-[20px] font-bold text-[#111111]">Đã gửi yêu cầu</h3>
            <p className="mt-2 text-[14px] text-[#555555] max-w-sm mx-auto leading-relaxed">
              Kỹ sư Trí Việt Phát sẽ liên hệ qua số <strong className="text-[#111111]">{phone}</strong> để gửi báo giá.
            </p>
          </div>
        ) : (
          <>
            <h3 id="consultation-title" className="pr-10 text-[22px] font-bold text-[#111111] leading-tight">
              Yêu cầu tư vấn và báo giá
            </h3>
            <p className="mt-2 text-[14px] text-[#555555] leading-relaxed">
              Để lại thông tin, kỹ sư phụ trách khu vực sẽ liên hệ lại với báo giá và cấu hình phù hợp.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <span className={LABEL_CLASS}>Chọn nhanh</span>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => addChip(chip)}
                      className="h-8 px-3 border border-[#d4d4d4] text-[13px] text-[#333333] hover:border-[#0a2540] hover:text-[#111111] transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cm-name" className={LABEL_CLASS}>
                    Họ tên / Đơn vị <span className="text-[#e11d2a]">*</span>
                  </label>
                  <input
                    id="cm-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Họ tên hoặc tên cơ sở y tế"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="cm-phone" className={LABEL_CLASS}>
                    Số điện thoại <span className="text-[#e11d2a]">*</span>
                  </label>
                  <input
                    id="cm-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại liên hệ"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cm-email" className={LABEL_CLASS}>
                    Email
                  </label>
                  <input
                    id="cm-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email nhận báo giá (nếu có)"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <span className={LABEL_CLASS}>
                    Tỉnh/thành phố <span className="text-[#e11d2a]">*</span>
                  </span>
                  <ProvinceSelect value={province} onChange={(val) => setProvince(val)} variant="white" />
                </div>
              </div>

              <div>
                <label htmlFor="cm-note" className={LABEL_CLASS}>
                  Nội dung cần tư vấn
                </label>
                <textarea
                  id="cm-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: cần báo giá máy điện giải và hóa chất huyết học Dewei"
                  className={`${INPUT_CLASS} h-auto py-2.5`}
                ></textarea>
              </div>

              {sendError && (
                <p role="alert" className="text-[13.5px] font-semibold text-[#e11d2a]">
                  {sendError}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full h-12 text-[14px] font-semibold uppercase tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                {sending ? 'Đang gửi...' : 'Gửi yêu cầu báo giá'}
              </button>

              <div className="pt-4 border-t border-[#e5e5e5] flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#555555]">
                <span>Cần gấp?</span>
                <span className="flex items-center gap-4">
                  <a
                    href={`tel:${COMPANY_INFO.hotline.replace(/[^0-9]/g, '')}`}
                    className="font-semibold text-[#111111] fx-link"
                  >
                    Hotline {COMPANY_INFO.hotline}
                  </a>
                  <a
                    href={COMPANY_INFO.zaloUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#111111] fx-link"
                  >
                    Chat Zalo
                  </a>
                </span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
