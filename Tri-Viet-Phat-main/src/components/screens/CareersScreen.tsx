import React, { useState } from 'react';
import { PageBanner } from '../PageBanner';
import { sendLead } from '../../lib/sendLead';
import { REAL_JOBS, JobItem } from '../../data/realSiteContent';

export const CareersScreen: React.FC = () => {
  const [activeJob, setActiveJob] = useState<JobItem | null>(null);

  // Application form states
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateNote, setCandidateNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');

  const handleSelectJob = (job: JobItem) => {
    setActiveJob(job);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    try {
      await sendLead('ung-tuyen', {
        'Vị trí': activeJob?.title ?? '',
        'Họ và tên': candidateName,
        'Số điện thoại': candidatePhone,
        Email: candidateEmail,
        'Kinh nghiệm & ghi chú': candidateNote,
      });
    } catch (err) {
      setApplyError((err as Error).message);
      return;
    } finally {
      setApplying(false);
    }
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setCandidateName('');
      setCandidatePhone('');
      setCandidateEmail('');
      setCandidateNote('');
    }, 5000);
  };

  return (
    <div className="w-full bg-white">
      {/* Banner */}
      <PageBanner
        title={activeJob ? activeJob.title : 'Tin tuyển dụng'}
        backgroundImage="https://thietbiytegroup.com/wp-content/uploads/2024/09/tin-tuyen-dung.png"
        breadcrumbs={
          activeJob
            ? [
                { label: 'Trang chủ', onClick: () => setActiveJob(null) },
                { label: 'Tin tuyển dụng', onClick: () => setActiveJob(null) },
                { label: activeJob.title },
              ]
            : [{ label: 'Trang chủ' }, { label: 'Tin tuyển dụng' }]
        }
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
        {activeJob ? (
          /* Job Detail View */
          <div className="space-y-5">
            <button
              onClick={() => setActiveJob(null)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5  bg-white border border-[#e5e5e5] text-[#111111] hover:text-[#000000] hover:border-[#0a2540] text-[13px] font-bold  transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              <span>Quay lại danh sách tin tuyển dụng</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Job Content Column */}
              <div className="lg:col-span-8 fx-panel p-6 sm:p-8 md:p-10  space-y-6">
                <div className="border-b border-[#f2f2f2] pb-6">
                  <h1 className="text-[24px] sm:text-[30px] font-bold text-[#111111] leading-tight mb-3">
                    {activeJob.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#777777]">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#777777]">
                        calendar_today
                      </span>
                      <span>Ngày đăng: {activeJob.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#111111]">
                        group
                      </span>
                      <span>Số lượng: <strong className="text-[#111111]">{activeJob.quantity}</strong></span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#777777]">
                        location_on
                      </span>
                      <span>Địa điểm: <strong className="text-[#111111]">{activeJob.location}</strong></span>
                    </span>
                  </div>
                </div>

                {/* Job Content Rendered from thietbiytegroup.com */}
                <div
                  className="job-rendered-body space-y-4 text-[#333333] text-[15px] sm:text-[16px] leading-relaxed [&>h2]:text-[19px] [&>h2]:font-bold [&>h2]:text-[#111111] [&>h2]:mt-6 [&>h2]:mb-2.5 [&>h3]:text-[17px] [&>h3]:font-bold [&>h3]:text-[#111111] [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5"
                  dangerouslySetInnerHTML={{ __html: activeJob.contentHtml }}
                />

                {/* Inline Fast Application Form */}
                <div className="mt-8 pt-8 border-t border-[#e5e5e5]">
                  <h3 className="text-[18px] font-bold text-[#111111] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#111111]">badge</span>
                    <span>Nộp hồ sơ ứng tuyển nhanh trực tuyến</span>
                  </h3>

                  {appliedSuccess ? (
                    <div className="p-4  bg-[#edf3f8] border border-[#e5e5e5] text-[#111111] flex items-center gap-3">
                      <span className="material-symbols-outlined text-[24px]">verified</span>
                      <div>
                        <div className="font-bold text-[14px]">Đã nhận hồ sơ ứng tuyển thành công!</div>
                        <div className="text-[13px]">
                          Ban Nhân sự Trí Việt Phát sẽ liên hệ với bạn trong thời gian sớm nhất qua số điện thoại {candidatePhone}.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-[#333333] mb-1">
                            Họ và tên của bạn *
                          </label>
                          <input
                            type="text"
                            required
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            className="w-full px-3.5 py-2.5  border border-[#d4d4d4] text-[14px] focus:outline-none focus:border-[#0a2540] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-[#333333] mb-1">
                            Số điện thoại *
                          </label>
                          <input
                            type="tel"
                            required
                            value={candidatePhone}
                            onChange={(e) => setCandidatePhone(e.target.value)}
                            placeholder="0912 345 678"
                            className="w-full px-3.5 py-2.5  border border-[#d4d4d4] text-[14px] focus:outline-none focus:border-[#0a2540] bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-[#333333] mb-1">
                          Email của bạn *
                        </label>
                        <input
                          type="email"
                          required
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                          placeholder="ungvien@example.com"
                          className="w-full px-3.5 py-2.5  border border-[#d4d4d4] text-[14px] focus:outline-none focus:border-[#0a2540] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-[#333333] mb-1">
                          Kinh nghiệm làm việc & Ghi chú
                        </label>
                        <textarea
                          rows={3}
                          value={candidateNote}
                          onChange={(e) => setCandidateNote(e.target.value)}
                          placeholder="Mô tả tóm tắt kinh nghiệm làm việc hoặc chuyên ngành đã học..."
                          className="w-full px-3.5 py-2.5  border border-[#d4d4d4] text-[14px] focus:outline-none focus:border-[#0a2540] bg-white"
                        />
                      </div>

                      {applyError && (
                        <p role="alert" className="text-[13px] font-semibold text-[#e11d2a]">
                          {applyError}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={applying}
                        className="px-6 py-2.5  bg-[#0a2540] hover:bg-[#071a2e] disabled:opacity-60 disabled:cursor-wait text-white font-bold text-[14px]  transition-colors cursor-pointer"
                      >
                        {applying ? 'Đang gửi...' : 'Nộp hồ sơ ngay'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Other Jobs Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="fx-panel overflow-hidden ">
                  <h3 className="px-4 py-3 border-b border-[#e5e5e5] text-[16px] font-bold text-[#111111]">
                    Các vị trí đang tuyển
                  </h3>
                  <div className="p-4 space-y-3 divide-y divide-[#f2f2f2]">
                    {REAL_JOBS.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => handleSelectJob(j)}
                        className={`pt-3 first:pt-0 cursor-pointer group ${
                          activeJob.id === j.id ? 'opacity-70 pointer-events-none' : ''
                        }`}
                      >
                        <h4 className="text-[14px] font-bold text-[#111111] group-hover:text-[#000000] transition-colors leading-snug">
                          {j.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[12px] text-[#777777] mt-1">
                          <span>Số lượng: {j.quantity}</span>
                          <span>•</span>
                          <span>{j.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Support Card */}
                <div className="fx-panel p-5  text-[13.5px] space-y-3">
                  <div className="font-bold text-[#111111] text-[15px] border-b border-[#f2f2f2] pb-2">
                    Công ty Thiết Bị Y Tế Trí Việt Phát
                  </div>
                  <p className="text-[#777777]">
                    Môi trường làm việc năng động, chế độ đãi ngộ vượt trội, cơ hội đào tạo và phát triển bền vững cùng các hãng thiết bị y tế hàng đầu thế giới.
                  </p>
                  <div className="pt-2 text-[13px] text-[#111111]">
                    <strong>Hotline:</strong> 0904.698.699
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Jobs list — plain rows, aligned to the page grid */
          <div>
            <p className="max-w-2xl text-[15px] text-[#555555] leading-relaxed">
              Gia nhập đội ngũ kỹ sư và kinh doanh thiết bị y tế của Trí Việt Phát. Hiện có{' '}
              <strong className="text-[#111111]">{REAL_JOBS.length} vị trí</strong> đang tuyển.
            </p>

            <ul className="mt-8 border-t border-[#0a2540]">
              {REAL_JOBS.map((job) => (
                <li key={job.id} className="border-b border-[#e5e5e5]">
                  <button
                    type="button"
                    onClick={() => handleSelectJob(job)}
                    className="group w-full text-left py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-start cursor-pointer"
                  >
                    <div className="md:col-span-4">
                      <h3 className="text-[18px] sm:text-[19px] font-bold text-[#111111] leading-snug group-hover:text-[#0a94dc] transition-colors duration-300">
                        {job.title}
                      </h3>
                      <p className="mt-2 text-[14px] text-[#777777]">
                        {job.quantity} · {job.location} · {job.date}
                      </p>
                    </div>
                    <p className="md:col-span-6 text-[14px] sm:text-[15px] text-[#555555] leading-relaxed line-clamp-2">
                      {job.excerpt}
                    </p>
                    <span className="md:col-span-2 md:text-right text-[14px] font-semibold text-[#111111] whitespace-nowrap">
                      Xem chi tiết <span aria-hidden="true">→</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

          </div>
        )}
      </div>
    </div>
  );
};
