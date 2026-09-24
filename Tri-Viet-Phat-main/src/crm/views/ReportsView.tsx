import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  Users,
  Wrench,
  Star,
  Calendar,
  ChevronDown,
  Download,
} from 'lucide-react';

const MONTH_DATA = [
  { m: 'Tháng 1', rev: 145, ord: 32 },
  { m: 'Tháng 2', rev: 190, ord: 42 },
  { m: 'Tháng 3', rev: 230, ord: 48 },
  { m: 'Tháng 4', rev: 280, ord: 55 },
  { m: 'Tháng 5', rev: 310, ord: 64 },
  { m: 'Tháng 6', rev: 340, ord: 71 },
  { m: 'Tháng 7', rev: 375, ord: 80 },
  { m: 'Tháng 8', rev: 415, ord: 86 },
  { m: 'Tháng 9', rev: 495, ord: 104 },
];

const SOURCES = [
  { label: 'Website', pct: 32, color: '#1a64d6' },
  { label: 'Tư vấn trực tiếp', pct: 24, color: '#16a34a' },
  { label: 'Giới thiệu', pct: 16, color: '#f59e0b' },
  { label: 'Zalo', pct: 12, color: '#a855f7' },
  { label: 'Facebook', pct: 8, color: '#ec4899' },
  { label: 'Khác', pct: 8, color: '#64748b' },
];

const PROVINCES = [
  { name: 'Hà Nội', rev: 185000000, max: 200000000 },
  { name: 'Nam Định', rev: 92000000, max: 200000000 },
  { name: 'Hải Phòng', rev: 78000000, max: 200000000 },
  { name: 'Thanh Hóa', rev: 56000000, max: 200000000 },
  { name: 'Nghệ An', rev: 42000000, max: 200000000 },
  { name: 'Thái Bình', rev: 28000000, max: 200000000 },
  { name: 'Các tỉnh khác', rev: 56000000, max: 200000000 },
];

const TOP_CUSTOMERS = [
  { rank: 1, name: 'Bệnh viện Đa khoa Nam Định', province: 'Nam Định', revenue: '125.000.000 đ', orders: 12 },
  { rank: 2, name: 'PK Đa khoa An Bình', province: 'Hà Nội', revenue: '98.000.000 đ', orders: 9 },
  { rank: 3, name: 'TTYT Huyện Giao Thủy', province: 'Nam Định', revenue: '76.000.000 đ', orders: 8 },
  { rank: 4, name: 'Bệnh viện Sản Nhi Hà Nội', province: 'Hà Nội', revenue: '62.000.000 đ', orders: 6 },
  { rank: 5, name: 'Phòng khám Minh Tâm', province: 'Hải Phòng', revenue: '58.000.000 đ', orders: 6 },
];

export const ReportsView: React.FC = () => {
  const [reportType, setReportType] = useState('all');
  const [employee, setEmployee] = useState('all');

  const handleExport = () => {
    alert('Đang tải xuống báo cáo tổng hợp CRM dạng Excel (XLSX)...');
  };

  return (
    <div className="space-y-4">
      {/* Title & Description */}
      <div>
        <h1 className="text-[26px] font-bold text-[#0f1f3d] leading-tight">Báo cáo</h1>
        <p className="mt-1 text-[14px] text-[#55637d]">
          Phân tích tổng quan về khách hàng, doanh số, sửa chữa, chăm sóc khách hàng và hiệu quả theo khu vực.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] hover:bg-[#f8fafd] cursor-pointer">
            <Calendar size={15} className="text-[#8b99af]" />
            <span>01/09/2025 - 30/09/2025</span>
            <ChevronDown size={14} className="text-[#8b99af]" />
          </button>

          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] outline-none cursor-pointer"
            >
              <option value="all">Tất cả loại báo cáo</option>
              <option value="revenue">Báo cáo doanh thu</option>
              <option value="service">Báo cáo sửa chữa & kỹ thuật</option>
              <option value="cskh">Báo cáo chăm sóc khách hàng</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] outline-none cursor-pointer"
            >
              <option value="all">Tất cả nhân viên</option>
              <option value="nv_a">Nguyễn Văn A</option>
              <option value="tt_b">Trần Thị B</option>
              <option value="lm_c">Lê Minh C</option>
              <option value="pt_d">Phạm Thị D</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13.5px] font-medium transition-colors shadow-[0_4px_12px_-3px_rgba(26,100,214,0.6)] cursor-pointer"
        >
          <Download size={16} />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total revenue */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Coins size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Tổng doanh thu</div>
            <div className="mt-0.5 text-[17px] font-bold text-[#0f1f3d] truncate">495.000.000 đ</div>
            <div className="text-[11px] text-[#16a34a] font-medium truncate">↑ 32% so với tháng trước</div>
          </div>
        </div>

        {/* Growth */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e6f7ee] text-[#16a34a] flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Tăng trưởng doanh thu</div>
            <div className="mt-0.5 text-[22px] font-bold text-[#0f1f3d]">+32%</div>
            <div className="text-[11px] text-[#5b6780] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* Conversion rate */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Tỷ lệ chuyển đổi</div>
            <div className="mt-0.5 text-[22px] font-bold text-[#0f1f3d]">23,8%</div>
            <div className="text-[11px] text-[#16a34a] font-medium truncate">↑ 4,6% so với tháng trước</div>
          </div>
        </div>

        {/* Repair tickets */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Wrench size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Số đơn sửa chữa</div>
            <div className="mt-0.5 text-[22px] font-bold text-[#0f1f3d]">72</div>
            <div className="text-[11px] text-[#16a34a] font-medium truncate">↑ 25% so với tháng trước</div>
          </div>
        </div>

        {/* CSAT */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#fff6dd] text-[#d97706] flex items-center justify-center shrink-0">
            <Star size={22} fill="#d97706" />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Điểm hài lòng (CSAT)</div>
            <div className="mt-0.5 text-[22px] font-bold text-[#0f1f3d]">4,7/5</div>
            <div className="text-[11px] text-[#16a34a] font-medium truncate">↑ 0,3 so với tháng trước</div>
          </div>
        </div>
      </div>

      {/* Row 1: Revenue trend (Left 60%) + Source donut (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* Xu hướng doanh thu theo tháng */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-[#0f1f3d]">Xu hướng doanh thu theo tháng</h3>
            <select className="text-[12px] bg-[#f8fafd] border border-[#dfe6f1] rounded-lg px-2.5 py-1 text-[#27344d] outline-none">
              <option>Theo tháng</option>
              <option>Theo quý</option>
            </select>
          </div>

          <div className="flex items-center justify-center gap-6 text-[12px] text-[#5b6780] mb-3">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-[#93c5fd]" />
              Doanh thu (triệu đồng)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a64d6]" />
              Số đơn hàng
            </span>
          </div>

          <div className="w-full h-56">
            <svg viewBox="0 0 540 200" className="w-full h-full overflow-visible">
              {/* Y-axis lines */}
              {[0, 50, 100, 150].map((yVal, i) => {
                const y = 170 - (yVal / 150) * 140;
                return (
                  <g key={i}>
                    <line x1="45" y1={y} x2="495" y2={y} stroke="#edf2f9" strokeDasharray="3 3" />
                    <text x="38" y={y + 3.5} fontSize="10" fill="#8b99af" textAnchor="end">
                      {yVal * 4}
                    </text>
                    <text x="502" y={y + 3.5} fontSize="10" fill="#8b99af" textAnchor="start">
                      {Math.round((yVal / 150) * 120)}
                    </text>
                  </g>
                );
              })}

              {/* Bars and month labels */}
              {MONTH_DATA.map((d, i) => {
                const x = 70 + i * 48;
                const barH = (d.rev / 600) * 140;
                return (
                  <g key={d.m}>
                    <rect x={x - 11} y={170 - barH} width="22" height={barH} rx="2" fill="#93c5fd" opacity="0.85" />
                    <text x={x} y="188" fontSize="10" fill="#5b6780" textAnchor="middle">
                      {d.m.replace('Tháng ', 'T')}
                    </text>
                  </g>
                );
              })}

              {/* Line chart for orders */}
              <path
                d={MONTH_DATA.map((d, i) => {
                  const x = 70 + i * 48;
                  const y = 170 - (d.ord / 120) * 140;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#1a64d6"
                strokeWidth="2.5"
              />

              {/* Circles on line */}
              {MONTH_DATA.map((d, i) => {
                const x = 70 + i * 48;
                const y = 170 - (d.ord / 120) * 140;
                return (
                  <circle key={`pt-${i}`} cx={x} cy={y} r="3.5" fill="#1a64d6" stroke="#ffffff" strokeWidth="2">
                    <title>{`${d.m}: ${d.ord} đơn, ${d.rev} triệu`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Nguồn khách hàng */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-[#0f1f3d]">Nguồn khách hàng</h3>
            <select className="text-[12px] bg-[#f8fafd] border border-[#dfe6f1] rounded-lg px-2.5 py-1 text-[#27344d] outline-none">
              <option>Theo số lượng</option>
              <option>Theo tỷ lệ %</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 my-auto">
            <div className="relative w-40 h-40 shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {(() => {
                  const r = 44;
                  const c = 2 * Math.PI * r;
                  let accum = 0;
                  return SOURCES.map((s) => {
                    const dash = `${(s.pct / 100) * c} ${c}`;
                    const offset = -accum;
                    accum += (s.pct / 100) * c;
                    return (
                      <circle
                        key={s.label}
                        cx="60"
                        cy="60"
                        r={r}
                        fill="transparent"
                        stroke={s.color}
                        strokeWidth="18"
                        strokeDasharray={dash}
                        strokeDashoffset={offset}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[20px] font-bold text-[#0f1f3d] leading-none">1.284</span>
                <span className="text-[11px] text-[#5b6780] mt-0.5">khách hàng</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2 text-[12px]">
              {SOURCES.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#44526b]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.label}</span>
                  </span>
                  <span className="font-semibold text-[#0f1f3d]">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 3 Cards: Province sales + Repair rate + Top customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Doanh số theo tỉnh/thành phố */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14.5px] font-bold text-[#0f1f3d]">Doanh số theo tỉnh/thành phố</h3>
            <select className="text-[11.5px] bg-[#f8fafd] border border-[#dfe6f1] rounded px-2 py-0.5 text-[#27344d] outline-none">
              <option>Top 7 tỉnh/thành phố</option>
            </select>
          </div>

          <div className="space-y-2.5 pt-1">
            {PROVINCES.map((p) => {
              const widthPct = Math.round((p.rev / p.max) * 100);
              return (
                <div key={p.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="text-[#44526b] font-medium">{p.name}</span>
                    <span className="font-semibold text-[#0f1f3d]">{p.rev.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f1f5fa] overflow-hidden">
                    <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tỷ lệ hoàn thành sửa chữa */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)] flex flex-col justify-between">
          <h3 className="text-[14.5px] font-bold text-[#0f1f3d] mb-2">Tỷ lệ hoàn thành sửa chữa</h3>

          <div className="my-auto flex flex-col items-center">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="45" fill="transparent" stroke="#f1f5fa" strokeWidth="16" />
                {/* 92% complete */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#16a34a"
                  strokeWidth="16"
                  strokeDasharray={`${0.92 * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                />
                {/* 6% in progress */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="16"
                  strokeDasharray={`${0.06 * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  strokeDashoffset={-0.92 * 2 * Math.PI * 45}
                />
                {/* 2% overdue */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="16"
                  strokeDasharray={`${0.02 * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                  strokeDashoffset={-0.98 * 2 * Math.PI * 45}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[20px] font-bold text-[#0f1f3d] leading-none">92%</span>
                <span className="text-[11px] text-[#16a34a] font-medium mt-0.5">Hoàn thành</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[11.5px]">
              <span className="flex items-center gap-1.5 text-[#44526b]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                Đã hoàn thành 92%
              </span>
              <span className="flex items-center gap-1.5 text-[#44526b]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                Đang xử lý 6%
              </span>
              <span className="flex items-center gap-1.5 text-[#44526b]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                Quá hạn 2%
              </span>
            </div>
          </div>
        </div>

        {/* Top 5 khách hàng theo doanh thu */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14.5px] font-bold text-[#0f1f3d]">Top 5 khách hàng theo doanh thu</h3>
            <select className="text-[11.5px] bg-[#f8fafd] border border-[#dfe6f1] rounded px-2 py-0.5 text-[#27344d] outline-none">
              <option>Theo doanh thu</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11.5px]">
              <thead className="text-[#8b99af] border-b border-[#eef2f8]">
                <tr>
                  <th className="pb-2 font-medium w-6">#</th>
                  <th className="pb-2 font-medium">Khách hàng</th>
                  <th className="pb-2 font-medium">Tỉnh/Thành phố</th>
                  <th className="pb-2 font-medium">Doanh thu</th>
                  <th className="pb-2 font-medium text-center">Số đơn hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5fa]">
                {TOP_CUSTOMERS.map((c) => (
                  <tr key={c.rank} className="hover:bg-[#f9fbfe]">
                    <td className="py-2 font-bold text-[#8b99af]">{c.rank}</td>
                    <td className="py-2 font-medium text-[#0f1f3d] truncate max-w-[120px]" title={c.name}>{c.name}</td>
                    <td className="py-2 text-[#55637d]">{c.province}</td>
                    <td className="py-2 font-semibold text-[#1a64d6] whitespace-nowrap">{c.revenue}</td>
                    <td className="py-2 text-center text-[#27344d] font-medium">{c.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
