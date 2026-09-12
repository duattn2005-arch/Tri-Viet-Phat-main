import React, { useState } from 'react';
import { PageBanner } from '../PageBanner';
import { REAL_JOBS, JobItem } from '../../data/realSiteContent';

export const CareersScreen: React.FC = () => {
  const [activeJob, setActiveJob] = useState<JobItem | null>(null);

  // Application form states
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateNote, setCandidateNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleSelectJob = (job: JobItem) => {
    setActiveJob(job);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="w-full bg-[#f8fafc] min-h-screen">
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

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {activeJob ? (
          /* Job Detail View */
          <div className="space-y-5">
            <button
              onClick={() => setActiveJob(null)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-[#006194] hover:text-[#bb0112] hover:border-[#bb0112] text-[13px] font-bold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">arrow_back</span>
              <span>Quay lại danh sách tin tuyển dụng</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Job Content Column */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 md:p-10 shadow-xs space-y-6">
                <div className="border-b border-[#f1f5f9] pb-6">
                  <span className="inline-block px-3 py-1 bg-[#fee2e2] text-[#bb0112] text-[12px] font-bold rounded-md uppercase mb-2">
                    Vị trí tuyển dụng
                  </span>
                  <h1 className="text-[24px] sm:text-[30px] font-extrabold text-[#0f172a] leading-tight mb-3">
                    {activeJob.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#64748b]">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#bb0112]">
                        calendar_today
                      </span>
                      <span>Ngày đăng: {activeJob.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#006194]">
                        group
                      </span>
                      <span>Số lượng: <strong className="text-[#0f172a]">{activeJob.quantity}</strong></span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#059669]">
                        location_on
                      </span>
                      <span>Địa điểm: <strong className="text-[#0f172a]">{activeJob.location}</strong></span>
                    </span>
                  </div>
                </div>

                {/* Job Content Rendered from thietbiytegroup.com */}
                <div
                  className="job-rendered-body space-y-4 text-[#334155] text-[15px] sm:text-[16px] leading-relaxed [&>h2]:text-[19px] [&>h2]:font-bold [&>h2]:text-[#0f172a] [&>h2]:mt-6 [&>h2]:mb-2.5 [&>h3]:text-[17px] [&>h3]:font-bold [&>h3]:text-[#0f172a] [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1.5"
                  dangerouslySetInnerHTML={{ __html: activeJob.contentHtml }}
                />

                {/* Contact for CV application */}
                <div className="p-5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] space-y-2">
                  <h4 className="font-bold text-[16px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#16a34a]">
                      mark_email_read
                    </span>
                    <span>Liên hệ gửi hồ sơ ứng tuyển trực tiếp:</span>
                  </h4>
                  <p className="text-[14px]">
                    - Vui lòng gửi CV qua email: <a href="mailto:dungtriduc@gmail.com" className="font-bold underline text-[#15803d]">dungtriduc@gmail.com</a>
                  </p>
                  <p className="text-[14px]">
                    - Điện thoại / Zalo phụ trách: <a href="tel:0979593888" className="font-bold underline text-[#15803d]">0979.593.888 (Mr. Dũng)</a>
                  </p>
                  <p className="text-[13px] text-[#166534]/80">
                    - Tiêu đề ứng tuyển: <strong>CV_Vị trí ứng tuyển_Họ tên</strong>
                  </p>
                </div>

                {/* Inline Fast Application Form */}
                <div className="mt-8 pt-8 border-t border-[#e2e8f0]">
                  <h3 className="text-[18px] font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006194]">badge</span>
                    <span>Nộp hồ sơ ứng tuyển nhanh trực tuyến</span>
                  </h3>

                  {appliedSuccess ? (
                    <div className="p-4 rounded-xl bg-[#e0f2fe] border border-[#bae6fd] text-[#006194] flex items-center gap-3">
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
                          <label className="block text-[13px] font-bold text-[#334155] mb-1">
                            Họ và tên của bạn *
                          </label>
                          <input
                            type="text"
                            required
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-[#cbd5e1] text-[14px] focus:outline-none focus:border-[#006194] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-[#334155] mb-1">
                            Số điện thoại *
                          </label>
                          <input
                            type="tel"
                            required
                            value={candidatePhone}
                            onChange={(e) => setCandidatePhone(e.target.value)}
                            placeholder="0912 345 678"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-[#cbd5e1] text-[14px] focus:outline-none focus:border-[#006194] bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-[#334155] mb-1">
                          Email của bạn *
                        </label>
                        <input
                          type="email"
                          required
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                          placeholder="ungvien@example.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#cbd5e1] text-[14px] focus:outline-none focus:border-[#006194] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-[#334155] mb-1">
                          Kinh nghiệm làm việc & Ghi chú
                        </label>
                        <textarea
                          rows={3}
                          value={candidateNote}
                          onChange={(e) => setCandidateNote(e.target.value)}
                          placeholder="Mô tả tóm tắt kinh nghiệm làm việc hoặc chuyên ngành đã học..."
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#cbd5e1] text-[14px] focus:outline-none focus:border-[#006194] bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#bb0112] hover:bg-[#99000e] text-white font-bold text-[14px] shadow-sm transition-colors cursor-pointer"
                      >
                        Nộp hồ sơ ngay
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Other Jobs Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs">
                  <div className="border-b-2 border-[#D7040F] bg-white">
                    <span className="inline-block bg-[#D7040F] text-white text-[15px] font-bold uppercase px-4 py-2 rounded-tr-[16px] tracking-wide">
                      Các vị trí mới nhất
                    </span>
                  </div>
                  <div className="p-4 space-y-3 divide-y divide-[#f1f5f9]">
                    {REAL_JOBS.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => handleSelectJob(j)}
                        className={`pt-3 first:pt-0 cursor-pointer group ${
                          activeJob.id === j.id ? 'opacity-70 pointer-events-none' : ''
                        }`}
                      >
                        <h4 className="text-[14px] font-bold text-[#1e293b] group-hover:text-[#bb0112] transition-colors leading-snug">
                          {j.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[12px] text-[#64748b] mt-1">
                          <span>Số lượng: {j.quantity}</span>
                          <span>•</span>
                          <span>{j.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Support Card */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs text-[13.5px] space-y-3">
                  <div className="font-bold text-[#0f172a] text-[15px] uppercase border-b border-[#f1f5f9] pb-2">
                    Công ty Thiết Bị Y Tế Trí Việt Phát
                  </div>
                  <p className="text-[#64748b]">
                    Môi trường làm việc năng động, chế độ đãi ngộ vượt trội, cơ hội đào tạo và phát triển bền vững cùng các hãng thiết bị y tế hàng đầu thế giới.
                  </p>
                  <div className="pt-2 text-[13px] text-[#006194]">
                    <strong>Hotline:</strong> 0904.698.699 - 0979.593.888
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Jobs List Grid - Exactly 100% clone of https://thietbiytegroup.com/tin-tuyen-dung/ */
          <div className="space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0f172a] uppercase">
                Cơ hội nghề nghiệp tại Trí Việt Phát
              </h2>
              <p className="text-[13.5px] text-[#64748b]">
                Gia nhập đội ngũ nhân sự chuyên nghiệp, môi trường văn minh, chế độ đãi ngộ hấp dẫn và cơ hội phát triển sự nghiệp lâu dài.
              </p>
            </div>

            {/* Exact list_tuyendung layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {REAL_JOBS.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail figure */}
                  <div
                    onClick={() => handleSelectJob(job)}
                    className="w-full h-[200px] overflow-hidden bg-[#f8fafc] cursor-pointer relative"
                  >
                    <img
                      src={job.image}
                      alt={job.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#bb0112] text-white text-[11px] font-bold shadow-xs">
                      {job.quantity}
                    </div>
                  </div>

                  {/* Post Meta */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => handleSelectJob(job)}
                        className="text-[16px] sm:text-[17px] font-bold text-[#006194] hover:text-[#bb0112] transition-colors leading-snug cursor-pointer mb-2 line-clamp-2"
                      >
                        {job.title}
                      </h3>

                      <p className="text-[13px] text-[#64748b] line-clamp-3 leading-relaxed mb-4">
                        {job.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#94a3b8]">
                        <span className="material-symbols-outlined text-[15px] text-[#bb0112]">
                          calendar_today
                        </span>
                        <span>{job.date}</span>
                      </div>

                      <button
                        onClick={() => handleSelectJob(job)}
                        className="inline-flex items-center gap-1 text-[#006194] hover:text-[#bb0112] text-[13px] font-bold transition-colors cursor-pointer group-hover:translate-x-0.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">link</span>
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
