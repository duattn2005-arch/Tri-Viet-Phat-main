import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Coins,
  FileSignature,
  FileText,
  Filter,
  Headphones,
  Home,
  Megaphone,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  User,
  Users,
  Wrench,
} from 'lucide-react';

/* ------------------------------------------------------------------ data */
// Demo data for the dashboard layout. Replace with API data when the CRM backend exists.

const NAV = [
  { label: 'Tổng quan', icon: Home },
  { label: 'CRM - Khách hàng', icon: Users },
  { label: 'Khách hàng', icon: User },
  { label: 'Cơ hội kinh doanh', icon: Filter },
  { label: 'Báo giá', icon: FileText },
  { label: 'Đơn hàng', icon: Package },
  { label: 'Sửa chữa - Bảo trì', icon: Wrench },
  { label: 'Lịch hẹn kỹ thuật', icon: CalendarDays },
  { label: 'Hợp đồng', icon: FileSignature },
  { label: 'Chăm sóc khách hàng', icon: Headphones },
  { label: 'Marketing', icon: Megaphone, sub: true },
  { label: 'Báo cáo', icon: BarChart3 },
  { label: 'Cài đặt', icon: Settings },
];

const KPIS = [
  { label: 'Tổng khách hàng', value: '1.284', trend: '12%', icon: Users },
  { label: 'Cơ hội kinh doanh', value: '186', trend: '18%', icon: Filter },
  { label: 'Báo giá đã gửi', value: '96', trend: '8%', icon: FileText },
  { label: 'Đơn sửa chữa', value: '72', trend: '25%', icon: Wrench },
  { label: 'Doanh thu ước tính', value: '495.000.000 đ', trend: '32%', icon: Coins, green: true },
];

const PIPELINE = [
  { label: 'Khách hàng tiềm năng', value: 486, pct: '100%', color: '#1f6fe5' },
  { label: 'Đã liên hệ', value: 312, pct: '64%', color: '#3ba1f3' },
  { label: 'Đang tư vấn', value: 186, pct: '38%', color: '#2fbf71' },
  { label: 'Đã gửi báo giá', value: 96, pct: '20%', color: '#f7a02c' },
  { label: 'Đã chốt', value: 72, pct: '15%', color: '#ef3b3b' },
];

const MONTHS = ['Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'];
const REVENUE = [170, 240, 280, 350, 380, 490]; // triệu đồng (left axis 0–500)
const ORDERS = [12, 17, 18, 24, 27, 37]; // đơn (right axis 0–50)

const SOURCES = [
  { label: 'Website', pct: 32, color: '#1f6fe5' },
  { label: 'Tư vấn trực tiếp', pct: 24, color: '#22c55e' },
  { label: 'Giới thiệu', pct: 18, color: '#fb923c' },
  { label: 'Zalo', pct: 12, color: '#a855f7' },
  { label: 'Facebook', pct: 8, color: '#f472b6' },
  { label: 'Khác', pct: 6, color: '#a3b8d4' },
];

type Tone = 'blue' | 'green' | 'orange' | 'amber' | 'red';

const TONE: Record<Tone, string> = {
  blue: 'bg-[#e8f1fe] text-[#1f6fe5]',
  green: 'bg-[#e6f7ee] text-[#16a34a]',
  orange: 'bg-[#fff1e6] text-[#ea6c0c]',
  amber: 'bg-[#fff6dd] text-[#d97706]',
  red: 'bg-[#fdecec] text-[#dc2626]',
};

type CustomerRow = {
  initials: string;
  name: string;
  sub: string;
  type: [string, Tone];
  need: string;
  date: string;
  status: [string, Tone];
};

const NEW_CUSTOMERS: CustomerRow[] = [
  { initials: 'BN', name: 'Bệnh viện Đa khoa Nam Định', sub: 'namdinh-hospital.vn', type: ['Bệnh viện', 'blue'], need: 'Máy xét nghiệm', date: '24/09/2025', status: ['Mới', 'blue'] },
  { initials: 'AB', name: 'Phòng khám An Bình', sub: '0965.123.456', type: ['Phòng khám', 'green'], need: 'Máy siêu âm', date: '23/09/2025', status: ['Đang tư vấn', 'orange'] },
  { initials: 'GT', name: 'TTYT huyện Giao Thủy', sub: 'giaothuy.gov.vn', type: ['Trung tâm y tế', 'orange'], need: 'Sửa chữa máy X-quang', date: '22/09/2025', status: ['Đã gửi báo giá', 'amber'] },
  { initials: 'SN', name: 'Bệnh viện Sản Nhi Hà Nội', sub: 'sanhi-hanoi.vn', type: ['Bệnh viện', 'blue'], need: 'Bảo trì định kỳ', date: '21/09/2025', status: ['Đã chốt', 'green'] },
  { initials: 'MT', name: 'Phòng khám Minh Tâm', sub: '0387.654.321', type: ['Phòng khám', 'green'], need: 'Máy điện tim', date: '20/09/2025', status: ['Đang tư vấn', 'orange'] },
];

const APPOINTMENTS: { time: string; customer: string; device: string; place: string; status: [string, Tone] }[] = [
  { time: '24/09 08:00', customer: 'Bệnh viện ĐK Nam Định', device: 'Máy xét nghiệm sinh hóa', place: 'Nam Định', status: ['Sắp tới', 'blue'] },
  { time: '24/09 13:30', customer: 'PK An Bình', device: 'Máy siêu âm', place: 'Hà Nội', status: ['Sắp tới', 'blue'] },
  { time: '25/09 08:00', customer: 'TTYT Giao Thủy', device: 'Máy X-quang', place: 'Giao Thủy', status: ['Đã xác nhận', 'green'] },
  { time: '25/09 14:00', customer: 'PK Minh Tâm', device: 'Máy điện tim', place: 'Nam Định', status: ['Chờ xác nhận', 'amber'] },
  { time: '26/09 08:00', customer: 'BV Sản Nhi Hà Nội', device: 'Máy thở', place: 'Hà Nội', status: ['Sắp tới', 'blue'] },
];

const ACTIVITIES = [
  { who: 'Nguyễn Văn A', action: 'đã thêm khách hàng mới', target: 'Bệnh viện Đa khoa Nam Định', ago: '10 phút trước', icon: Users, tone: 'blue' as Tone },
  { who: 'Trần Thị B', action: 'đã cập nhật trạng thái báo giá', target: '#BG-2025-128', ago: '35 phút trước', icon: FileText, tone: 'green' as Tone },
  { who: 'Lê Văn C', action: 'đã hoàn thành phiếu sửa chữa', target: '#SC-2025-056', ago: '1 giờ trước', icon: Wrench, tone: 'orange' as Tone },
];

const INITIAL_TASKS: { task: string; customer: string; due: string; done: boolean }[] = [
  { task: 'Gọi lại khách hàng báo giá', customer: 'PK An Bình', due: '24/09/2025', done: false },
  { task: 'Chuẩn bị báo giá máy xét nghiệm', customer: 'Bệnh viện ĐK Nam Định', due: '24/09/2025', done: true },
  { task: 'Theo dõi sau sửa chữa', customer: 'TTYT Giao Thủy', due: '25/09/2025', done: false },
  { task: 'Hẹn lịch bảo trì định kỳ', customer: 'BV Sản Nhi Hà Nội', due: '26/09/2025', done: false },
];

const CRM_STORAGE_KEYS = {
  customers: 'tri-viet-phat-crm-customers',
  tasks: 'tri-viet-phat-crm-tasks',
  modules: 'tri-viet-phat-crm-modules',
} as const;

const MODULE_DESCRIPTIONS: Record<string, string> = {
  'Cơ hội kinh doanh': 'Theo dõi các cơ hội bán hàng và giai đoạn tư vấn.',
  'Báo giá': 'Quản lý báo giá đã tạo, đã gửi và đang chờ phản hồi.',
  'Đơn hàng': 'Theo dõi đơn hàng thiết bị và hóa chất của khách hàng.',
  'Sửa chữa - Bảo trì': 'Tiếp nhận và theo dõi các phiếu sửa chữa, bảo trì.',
  'Lịch hẹn kỹ thuật': 'Quản lý lịch kỹ thuật viên đến làm việc tại cơ sở.',
  'Hợp đồng': 'Lưu trữ và theo dõi hợp đồng dịch vụ, bảo trì.',
  'Chăm sóc khách hàng': 'Theo dõi lịch sử chăm sóc và phản hồi của khách hàng.',
  Marketing: 'Quản lý các chiến dịch và nguồn khách hàng.',
  'Báo cáo': 'Tổng hợp báo cáo kinh doanh và hiệu quả dịch vụ.',
  'Cài đặt': 'Cấu hình người dùng, thông báo và thiết lập CRM.',
};

type ModuleTable = { columns: string[]; rows: string[][] };

const MODULE_RECORDS: Record<string, ModuleTable> = {
  'Cơ hội kinh doanh': {
    columns: ['Cơ hội', 'Khách hàng', 'Giá trị dự kiến', 'Giai đoạn', 'Người phụ trách'],
    rows: [
      ['Cung cấp máy xét nghiệm', 'Bệnh viện ĐK Nam Định', '680.000.000 đ', 'Đang tư vấn', 'Nguyễn Văn A'],
      ['Gói hóa chất huyết học 2025', 'PK An Bình', '96.000.000 đ', 'Đã gửi báo giá', 'Trần Thị B'],
      ['Hợp đồng bảo trì X-quang', 'TTYT Giao Thủy', '120.000.000 đ', 'Khách hàng tiềm năng', 'Lê Văn C'],
    ],
  },
  'Báo giá': {
    columns: ['Mã báo giá', 'Khách hàng', 'Nội dung', 'Tổng tiền', 'Trạng thái'],
    rows: [
      ['#BG-2025-128', 'PK An Bình', 'Máy siêu âm', '420.000.000 đ', 'Đã gửi'],
      ['#BG-2025-127', 'BV Sản Nhi Hà Nội', 'Gói bảo trì định kỳ', '85.000.000 đ', 'Đang soạn'],
      ['#BG-2025-126', 'TTYT Giao Thủy', 'Sửa chữa máy X-quang', '32.500.000 đ', 'Chờ phản hồi'],
    ],
  },
  'Đơn hàng': {
    columns: ['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Ngày đặt', 'Trạng thái'],
    rows: [
      ['#DH-2025-084', 'BV Sản Nhi Hà Nội', 'Máy xét nghiệm HbA1c', '20/09/2025', 'Đang giao'],
      ['#DH-2025-083', 'Phòng khám Minh Tâm', 'Máy điện tim', '18/09/2025', 'Đã hoàn thành'],
      ['#DH-2025-082', 'PK An Bình', 'Hóa chất huyết học Dewei', '16/09/2025', 'Đang xử lý'],
    ],
  },
  'Sửa chữa - Bảo trì': {
    columns: ['Mã phiếu', 'Khách hàng', 'Thiết bị', 'Kỹ thuật viên', 'Trạng thái'],
    rows: [
      ['#SC-2025-056', 'TTYT Giao Thủy', 'Máy X-quang', 'Lê Văn C', 'Đang xử lý'],
      ['#SC-2025-055', 'BV Sản Nhi Hà Nội', 'Máy thở', 'Phạm Văn D', 'Đã hoàn thành'],
      ['#SC-2025-054', 'PK Minh Tâm', 'Máy điện tim', 'Nguyễn Văn E', 'Chờ tiếp nhận'],
    ],
  },
  'Lịch hẹn kỹ thuật': {
    columns: ['Thời gian', 'Khách hàng', 'Thiết bị', 'Địa điểm', 'Trạng thái'],
    rows: APPOINTMENTS.map((appointment) => [appointment.time, appointment.customer, appointment.device, appointment.place, appointment.status[0]]),
  },
  'Hợp đồng': {
    columns: ['Mã hợp đồng', 'Khách hàng', 'Loại hợp đồng', 'Hiệu lực đến', 'Trạng thái'],
    rows: [
      ['#HD-2025-031', 'BV Sản Nhi Hà Nội', 'Bảo trì thiết bị', '31/12/2026', 'Đang hiệu lực'],
      ['#HD-2025-030', 'TTYT Giao Thủy', 'Cung cấp hóa chất', '30/06/2026', 'Đang hiệu lực'],
      ['#HD-2025-029', 'PK Minh Tâm', 'Sửa chữa định kỳ', '30/09/2025', 'Sắp hết hạn'],
    ],
  },
  'Chăm sóc khách hàng': {
    columns: ['Ngày', 'Khách hàng', 'Nội dung', 'Nhân viên', 'Kết quả'],
    rows: [
      ['24/09/2025', 'PK An Bình', 'Gọi lại sau báo giá', 'Nguyễn Văn A', 'Đã liên hệ'],
      ['23/09/2025', 'BV ĐK Nam Định', 'Gửi tài liệu kỹ thuật', 'Trần Thị B', 'Đã gửi'],
      ['22/09/2025', 'TTYT Giao Thủy', 'Khảo sát sau sửa chữa', 'Lê Văn C', 'Hài lòng'],
    ],
  },
  Marketing: {
    columns: ['Chiến dịch', 'Kênh', 'Thời gian', 'Khách hàng tiềm năng', 'Trạng thái'],
    rows: [
      ['Máy xét nghiệm tháng 9', 'Website', '01/09 - 30/09/2025', '86', 'Đang chạy'],
      ['Chăm sóc khách hàng cũ', 'Zalo', '15/09 - 30/09/2025', '42', 'Đang chạy'],
      ['Giới thiệu bảo trì', 'Facebook', '01/08 - 31/08/2025', '28', 'Đã kết thúc'],
    ],
  },
  'Báo cáo': {
    columns: ['Báo cáo', 'Kỳ báo cáo', 'Người tạo', 'Cập nhật gần nhất', 'Trạng thái'],
    rows: [
      ['Doanh thu theo tháng', 'Tháng 9/2025', 'Nguyễn Văn A', '24/09/2025 09:30', 'Đã cập nhật'],
      ['Hiệu quả nguồn khách hàng', 'Quý III/2025', 'Trần Thị B', '23/09/2025 16:20', 'Đã cập nhật'],
      ['Tình trạng phiếu sửa chữa', 'Tháng 9/2025', 'Lê Văn C', '22/09/2025 14:10', 'Đã cập nhật'],
    ],
  },
  'Cài đặt': {
    columns: ['Thiết lập', 'Giá trị hiện tại', 'Mô tả', 'Trạng thái'],
    rows: [
      ['Thông báo lịch hẹn', 'Bật', 'Nhắc lịch trước 24 giờ', 'Đang hoạt động'],
      ['Tự động lưu dữ liệu', 'Bật', 'Lưu trên trình duyệt hiện tại', 'Đang hoạt động'],
      ['Định dạng tiền tệ', 'VND', 'Hiển thị giá trị bằng đồng Việt Nam', 'Đang hoạt động'],
    ],
  },
};

const ModuleWorkspace: React.FC<{
  name: string;
  module: ModuleTable;
  query: string;
  onQueryChange: (value: string) => void;
  onAdd: () => void;
  onEdit: (rowIndex: number) => void;
  onDelete: (rowIndex: number) => void;
}> = ({ name, module, query, onQueryChange, onAdd, onEdit, onDelete }) => {
  if (!module) return null;
  const visibleRows = module.rows.filter((row) => row.join(' ').toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-tight">{name}</h1>
          <p className="mt-1 text-[14.5px] text-[#44526b]">{MODULE_DESCRIPTIONS[name]}</p>
        </div>
        <button onClick={onAdd} className="inline-flex items-center justify-center gap-2 h-[42px] px-4 rounded-lg bg-[#1a64d6] text-white text-[13.5px] font-medium cursor-pointer">
          <Plus size={18} />
          Thêm bản ghi
        </button>
      </div>
      <Card>
        <div className="flex items-center gap-2 p-3 border-b border-[#eef2f8]">
          <Search size={16} className="text-[#6b7891]" />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={`Tìm trong ${name.toLowerCase()}...`} className="w-full bg-transparent text-[13px] outline-none" />
        </div>
        <div className="overflow-x-auto p-3">
          <table className="w-full">
            <thead className="bg-[#f4f7fc]">
              <tr>{module.columns.map((column) => <th key={column} className={TH}>{column}</th>)}<th className={TH}>Thao tác</th></tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => {
                const rowIndex = module.rows.indexOf(row);
                return (
                <tr key={`${name}-${rowIndex}`} className="border-b border-[#eef2f8] last:border-0 hover:bg-[#f8fafd]">
                  {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className={cellIndex === 0 ? `${TD} font-medium text-[#1a64d6]` : TD}>{cell}</td>)}
                  <td className={`${TD} space-x-3`}><button onClick={() => onEdit(rowIndex)} className="text-[#1a64d6] hover:underline cursor-pointer">Sửa</button><button onClick={() => onDelete(rowIndex)} className="text-[#dc2626] hover:underline cursor-pointer">Xóa</button></td>
                </tr>
                );
              })}
              {!visibleRows.length && <tr><td colSpan={module.columns.length + 1} className="px-3 py-8 text-center text-[13px] text-[#5b6780]">Chưa có dữ liệu phù hợp.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

/* ------------------------------------------------------------ primitives */

const Badge: React.FC<{ tone: Tone; children: React.ReactNode }> = ({ tone, children }) => (
  <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-[3px] text-[11.5px] font-medium ${TONE[tone]}`}>
    {children}
  </span>
);

const Card: React.FC<{ title?: string; link?: string; className?: string; children: React.ReactNode }> = ({
  title,
  link,
  className = '',
  children,
}) => (
  <section className={`min-w-0 rounded-xl bg-white border border-[#e6ecf5] shadow-[0_1px_3px_rgba(16,42,90,0.04)] ${className}`}>
    {title && (
      <header className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-[17px] font-semibold text-[#0f1f3d]">{title}</h2>
        {link && (
          <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1f6fe5] hover:underline cursor-pointer">
            {link}
            <ArrowRight size={15} />
          </button>
        )}
      </header>
    )}
    {children}
  </section>
);

const TH = 'px-1.5 py-2 text-left text-[12px] font-medium text-[#44526b] whitespace-nowrap';
const TD = 'px-1.5 py-2.5 text-[12.5px] text-[#27344d] whitespace-nowrap';
/** Cell allowed to wrap (long device / need names). */
const TD_WRAP = 'px-2 py-2.5 text-[12.5px] text-[#27344d] min-w-[96px]';

/* ------------------------------------------------------------------ charts */

const Funnel: React.FC = () => {
  const W = 230;
  const rowH = 46;
  const gap = 4;
  // Top width per step (then each trapezoid narrows to the next step's width).
  const widths = [216, 172, 138, 104, 82, 70];
  return (
    <svg viewBox={`0 0 ${W} ${PIPELINE.length * (rowH + gap)}`} className="w-full max-w-[230px]" role="img" aria-label="Phễu khách hàng">
      {PIPELINE.map((p, i) => {
        const y = i * (rowH + gap);
        const top = widths[i];
        const bottom = widths[i + 1];
        const x1 = (W - top) / 2;
        const x2 = (W - bottom) / 2;
        return (
          <g key={p.label}>
            <path
              d={`M${x1 + 4} ${y} H${W - x1 - 4} Q${W - x1} ${y} ${W - x1 - 1} ${y + 4} L${W - x2} ${y + rowH - 4} Q${W - x2} ${y + rowH} ${W - x2 - 4} ${y + rowH} H${x2 + 4} Q${x2} ${y + rowH} ${x2} ${y + rowH - 4} L${x1 + 1} ${y + 4} Q${x1} ${y} ${x1 + 4} ${y} Z`}
              fill={p.color}
            />
            <text x={W / 2} y={y + rowH / 2 + 6} textAnchor="middle" fontSize="17" fontWeight="600" fill="#fff">
              {p.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const LineChart: React.FC = () => {
  const W = 420;
  const H = 190;
  const pad = { l: 34, r: 30, t: 10, b: 28 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (iw / (MONTHS.length - 1)) * i;
  const yL = (v: number) => pad.t + ih - (v / 500) * ih;
  const yR = (v: number) => pad.t + ih - (v / 50) * ih;
  const rev = REVENUE.map((v, i) => [x(i), yL(v)] as const);
  const ord = ORDERS.map((v, i) => [x(i), yR(v)] as const);
  const line = (pts: readonly (readonly [number, number])[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Doanh thu và số đơn hàng theo tháng">
      <defs>
        <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1f6fe5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1f6fe5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 100, 200, 300, 400, 500].map((v, i) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={yL(v)} y2={yL(v)} stroke="#e8edf5" />
          <text x={pad.l - 8} y={yL(v) + 4} textAnchor="end" fontSize="10.5" fill="#5b6780">
            {v}
          </text>
          <text x={W - pad.r + 8} y={yL(v) + 4} fontSize="10.5" fill="#5b6780">
            {i * 10}
          </text>
        </g>
      ))}
      {MONTHS.map((m, i) => (
        <g key={m}>
          <line x1={x(i)} x2={x(i)} y1={pad.t} y2={pad.t + ih} stroke="#eef2f8" />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#5b6780">
            {m}
          </text>
        </g>
      ))}
      <path d={`${line(rev)} L${x(MONTHS.length - 1)} ${pad.t + ih} L${x(0)} ${pad.t + ih} Z`} fill="url(#revFill)" />
      <path d={line(rev)} fill="none" stroke="#1f6fe5" strokeWidth="2.2" />
      <path d={line(ord)} fill="none" stroke="#22b35e" strokeWidth="2.2" />
      {rev.map(([cx, cy], i) => (
        <circle key={`r${i}`} cx={cx} cy={cy} r="3.6" fill="#1f6fe5" stroke="#fff" strokeWidth="1.5">
          <title>{`${MONTHS[i]}: ${REVENUE[i]} triệu đồng`}</title>
        </circle>
      ))}
      {ord.map(([cx, cy], i) => (
        <circle key={`o${i}`} cx={cx} cy={cy} r="3.6" fill="#22b35e" stroke="#fff" strokeWidth="1.5">
          <title>{`${MONTHS[i]}: ${ORDERS[i]} đơn`}</title>
        </circle>
      ))}
    </svg>
  );
};

const Donut: React.FC = () => {
  const r = 62;
  const c = 2 * Math.PI * r;
  const gapLen = 3;
  let offset = 0;
  return (
    <div className="relative w-[170px] h-[170px] shrink-0">
      <svg viewBox="0 0 170 170" className="w-full h-full -rotate-90" role="img" aria-label="Nguồn khách hàng">
        {SOURCES.map((s) => {
          const len = (s.pct / 100) * c;
          const el = (
            <circle
              key={s.label}
              cx="85"
              cy="85"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="24"
              strokeDasharray={`${Math.max(len - gapLen, 0)} ${c}`}
              strokeDashoffset={-offset}
            >
              <title>{`${s.label}: ${s.pct}%`}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold text-[#0f1f3d]">1.284</span>
        <span className="text-[12.5px] text-[#44526b]">khách hàng</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- dashboard */

export const CrmDashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('CRM - Khách hàng');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [customers, setCustomers] = useState<CustomerRow[]>(NEW_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerNeed, setNewCustomerNeed] = useState('');
  const [moduleRecords, setModuleRecords] = useState<Record<string, ModuleTable>>(MODULE_RECORDS);
  const [moduleQuery, setModuleQuery] = useState('');
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [moduleDraft, setModuleDraft] = useState<string[]>([]);
  const [editingModuleRow, setEditingModuleRow] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedCustomers = window.localStorage.getItem(CRM_STORAGE_KEYS.customers);
      const storedTasks = window.localStorage.getItem(CRM_STORAGE_KEYS.tasks);
      const storedModules = window.localStorage.getItem(CRM_STORAGE_KEYS.modules);
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers) as CustomerRow[]);
      if (storedTasks) setTasks(JSON.parse(storedTasks) as typeof INITIAL_TASKS);
      if (storedModules) setModuleRecords(JSON.parse(storedModules) as Record<string, ModuleTable>);
    } catch {
      // Ignore malformed browser data and continue with the demo defaults.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CRM_STORAGE_KEYS.customers, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    window.localStorage.setItem(CRM_STORAGE_KEYS.tasks, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    window.localStorage.setItem(CRM_STORAGE_KEYS.modules, JSON.stringify(moduleRecords));
  }, [moduleRecords]);

  useEffect(() => {
    setModuleQuery('');
  }, [activeNav]);

  const visibleCustomers = customers.filter((customer) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return `${customer.name} ${customer.sub} ${customer.need}`.toLowerCase().includes(query);
  });

  const addCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newCustomerName.trim();
    const need = newCustomerNeed.trim();
    if (!name || !need) return;

    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(-2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
    setCustomers((current) => [
      { initials, name, sub: 'Khách hàng mới', type: ['Phòng khám', 'green'], need, date: '24/09/2025', status: ['Mới', 'blue'] },
      ...current,
    ]);
    setNewCustomerName('');
    setNewCustomerNeed('');
    setIsAddCustomerOpen(false);
  };

  const deleteCustomer = (name: string) => {
    if (!window.confirm(`Xóa khách hàng "${name}"?`)) return;
    setCustomers((current) => current.filter((customer) => customer.name !== name));
  };

  const isDashboard = activeNav === 'Tổng quan' || activeNav === 'CRM - Khách hàng';

  const openModuleForm = (rowIndex?: number) => {
    setEditingModuleRow(rowIndex ?? null);
    setModuleDraft(rowIndex === undefined ? new Array(moduleRecords[activeNav]?.columns.length || 0).fill('') : [...moduleRecords[activeNav].rows[rowIndex]]);
    setIsAddModuleOpen(true);
  };

  const addModuleRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!moduleDraft.length || moduleDraft.some((value) => !value.trim())) return;
    setModuleRecords((current) => {
      const rows = [...current[activeNav].rows];
      if (editingModuleRow === null) rows.unshift(moduleDraft.map((value) => value.trim()));
      else rows[editingModuleRow] = moduleDraft.map((value) => value.trim());
      return { ...current, [activeNav]: { ...current[activeNav], rows } };
    });
    setModuleDraft([]);
    setEditingModuleRow(null);
    setIsAddModuleOpen(false);
  };

  const deleteModuleRecord = (rowIndex: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bản ghi này không?')) return;
    setModuleRecords((current) => ({
      ...current,
      [activeNav]: { ...current[activeNav], rows: current[activeNav].rows.filter((_, index) => index !== rowIndex) },
    }));
  };

  const sidebar = (
    <aside className="flex h-full w-[205px] flex-col bg-white border-r border-[#e6ecf5]">
      <a href="/" className="flex items-center gap-2 px-4 h-[60px] shrink-0" title="Về website Trí Việt Phát">
        <img src="/tri-viet-phat1.jpg" alt="Logo Trí Việt Phát" className="h-10 w-[46px] object-cover object-left" />
        <span className="leading-tight">
          <span className="block text-[17px] font-bold text-[#0b2a6b] whitespace-nowrap">Trí Việt Phát</span>
          <span className="block text-[10.5px] font-semibold tracking-[0.18em] text-[#1f8fe0]">THIẾT BỊ Y TẾ</span>
        </span>
      </a>
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {NAV.map(({ label, icon: Icon, sub }) => {
          const active = activeNav === label;
          return (
            <button
              key={label}
              onClick={() => {
                setActiveNav(label);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 rounded-lg px-3 h-[42px] text-[13.5px] whitespace-nowrap text-left transition-colors cursor-pointer ${
                active
                  ? 'bg-[#1a64d6] text-white font-medium shadow-[0_6px_14px_-6px_rgba(26,100,214,0.8)]'
                  : 'text-[#1f2d46] hover:bg-[#f1f5fc]'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} className={`shrink-0 ${active ? 'text-white' : 'text-[#2b3a55]'}`} />
              <span className="flex-1">{label}</span>
              {sub && <ChevronRight size={15} className="text-[#8a96ab]" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-[#0f1f3d] font-normal tracking-normal" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar: fixed on desktop, drawer on smaller screens */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">{sidebar}</div>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[205px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 h-[60px] px-4 sm:px-6 bg-white border-b border-[#e6ecf5]">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
            className="p-1.5 rounded-md text-[#2b3a55] hover:bg-[#f1f5fc] cursor-pointer"
          >
            <Menu size={22} />
          </button>
          <label className="hidden md:flex flex-1 max-w-[710px] items-center gap-2 h-[36px] px-3 rounded-lg border border-[#dfe6f1] bg-[#f8fafd] text-[#6b7891]">
            <Search size={16} />
            <input
              placeholder="Tìm kiếm khách hàng, thiết bị, phiếu sửa chữa..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#0f1f3d] placeholder:text-[#6b7891] outline-none"
            />
          </label>
          <div className="ml-auto flex items-center gap-5">
            <button aria-label="Thông báo" className="relative p-1 text-[#2b3a55] cursor-pointer">
              <Bell size={21} />
              <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] rounded-full bg-[#e5373e] text-white text-[10px] font-semibold flex items-center justify-center">
                3
              </span>
            </button>
            <button className="flex items-center gap-2.5 cursor-pointer">
              <span className="w-9 h-9 rounded-full bg-[#1a64d6] text-white text-[13px] font-semibold flex items-center justify-center">
                NV
              </span>
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-[13.5px] font-medium">Nguyễn Văn A</span>
                <span className="block text-[11.5px] text-[#5b6780]">Nhân viên kinh doanh</span>
              </span>
              <ChevronDown size={16} className="text-[#5b6780]" />
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 space-y-4">
          {!isDashboard && activeNav === 'Khách hàng' ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-[26px] font-bold leading-tight">Khách hàng</h1>
                  <p className="mt-1 text-[14.5px] text-[#44526b]">Danh sách khách hàng được lưu trên thiết bị này.</p>
                </div>
                <button
                  onClick={() => setIsAddCustomerOpen(true)}
                  className="inline-flex items-center justify-center gap-2 h-[42px] px-4 rounded-lg bg-[#1a64d6] text-white text-[13.5px] font-medium cursor-pointer"
                >
                  <Plus size={18} />
                  Thêm khách hàng
                </button>
              </div>
              <Card>
                <div className="overflow-x-auto p-3">
                  <table className="w-full">
                    <thead className="bg-[#f4f7fc]">
                      <tr>
                        <th className={TH}>#</th>
                        <th className={TH}>Khách hàng</th>
                        <th className={TH}>Loại khách hàng</th>
                        <th className={TH}>Nhu cầu</th>
                        <th className={TH}>Ngày tạo</th>
                        <th className={TH}>Trạng thái</th>
                        <th className={TH}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleCustomers.map((customer, index) => (
                        <tr key={customer.name} className="border-b border-[#eef2f8] last:border-0">
                          <td className={TD}>{index + 1}</td>
                          <td className={TD}>{customer.name}</td>
                          <td className={TD}><Badge tone={customer.type[1]}>{customer.type[0]}</Badge></td>
                          <td className={TD_WRAP}>{customer.need}</td>
                          <td className={TD}>{customer.date}</td>
                          <td className={TD}><Badge tone={customer.status[1]}>{customer.status[0]}</Badge></td>
                          <td className={TD}><button onClick={() => deleteCustomer(customer.name)} className="text-[#dc2626] hover:underline cursor-pointer">Xóa</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          ) : !isDashboard ? (
            <ModuleWorkspace
              name={activeNav}
              module={moduleRecords[activeNav]}
              query={moduleQuery}
              onQueryChange={setModuleQuery}
              onAdd={openModuleForm}
              onEdit={openModuleForm}
              onDelete={deleteModuleRecord}
            />
          ) : (
          <>
          {/* Title row */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-bold leading-tight">
                <span className="text-[#1a64d6]">CRM</span> - Quản lý khách hàng
              </h1>
              <p className="mt-1 text-[14.5px] text-[#44526b]">
                Quản lý khách hàng, cơ hội, báo giá và dịch vụ sửa chữa thiết bị y tế
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-3 h-[42px] px-4 rounded-lg border border-[#dfe6f1] bg-white text-[13.5px] cursor-pointer">
                <CalendarDays size={18} className="text-[#2b3a55]" />
                01/09/2025 - 30/09/2025
                <ChevronDown size={16} className="text-[#5b6780]" />
              </button>
              <button
                onClick={() => setIsAddCustomerOpen(true)}
                className="flex items-center gap-2 h-[42px] px-4 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13.5px] font-medium shadow-[0_8px_18px_-8px_rgba(26,100,214,0.9)] cursor-pointer"
              >
                <Plus size={18} />
                Thêm khách hàng
                <span className="ml-2 pl-2 border-l border-white/30">
                  <ChevronDown size={16} />
                </span>
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1.25fr] gap-3">
            {KPIS.map(({ label, value, trend, icon: Icon, green }) => (
              <Card key={label} className="flex items-center gap-3.5 px-4 py-4">
                <span
                  className={`w-[54px] h-[54px] shrink-0 rounded-full flex items-center justify-center ${
                    green ? 'bg-[#e6f7ee] text-[#16a34a]' : 'bg-[#e8f1fe] text-[#1a64d6]'
                  }`}
                >
                  <Icon size={25} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <div className="text-[13.5px] text-[#27344d]">{label}</div>
                  <div className="mt-0.5 flex items-baseline gap-2.5">
                    <span className={`${green ? 'text-[21px]' : 'text-[23px]'} font-bold text-[#0f1f3d] whitespace-nowrap`}>{value}</span>
                    {!green && (
                      <span className="inline-flex items-center text-[13px] font-medium text-[#16a34a]">
                        <ArrowUp size={14} />
                        {trend}
                      </span>
                    )}
                  </div>
                  <div className="text-[12.5px] text-[#5b6780] whitespace-nowrap">
                    {green && (
                      <span className="mr-3 inline-flex items-center font-medium text-[#16a34a]">
                        <ArrowUp size={14} />
                        {trend}
                      </span>
                    )}
                    so với tháng trước
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.12fr_0.9fr] gap-3">
            <Card title="Pipeline khách hàng">
              <div className="flex items-center gap-4 px-5 pb-4">
                <div className="w-[180px] shrink-0">
                  <Funnel />
                </div>
                <ul className="flex-1 min-w-0 space-y-[22px]">
                  {PIPELINE.map((p) => (
                    <li key={p.label} className="flex items-center gap-2 text-[12.5px]">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                      <span className="flex-1 text-[#1f2d46] whitespace-nowrap">{p.label}</span>
                      <span className="text-[#5b6780]">{p.pct}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card title="Doanh thu & Đơn hàng">
              <div className="px-4 pb-3">
                <div className="flex justify-center gap-5 text-[12.5px] text-[#27344d] mb-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1f6fe5]" />
                    Doanh thu (triệu đồng)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22b35e]" />
                    Số đơn hàng
                  </span>
                </div>
                <LineChart />
              </div>
            </Card>

            <Card title="Nguồn khách hàng">
              <div className="flex items-center gap-4 px-5 pb-5 pt-2">
                <Donut />
                <ul className="flex-1 space-y-3.5">
                  {SOURCES.map((s) => (
                    <li key={s.label} className="flex items-center gap-2.5 text-[12.5px]">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="flex-1 text-[#1f2d46] whitespace-nowrap">{s.label}</span>
                      <span className="text-[#44526b]">{s.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.12fr_1fr] gap-3">
            <Card title="Khách hàng mới" link="Xem tất cả">
              <div className="overflow-x-auto px-2.5 pb-3">
                <table className="w-full">
                  <thead className="bg-[#f4f7fc]">
                    <tr>
                      <th className={TH}>#</th>
                      <th className={TH}>Khách hàng</th>
                      <th className={TH}>Loại khách hàng</th>
                      <th className={TH}>Nhu cầu</th>
                      <th className={TH}>Ngày tạo</th>
                      <th className={TH}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCustomers.map((c, i) => (
                      <tr key={c.name} className="border-b border-[#eef2f8] last:border-0 hover:bg-[#f8fafd]">
                        <td className={TD}>{i + 1}</td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 shrink-0 rounded-full bg-[#eef2f8] text-[11px] font-semibold text-[#1f2d46] flex items-center justify-center">
                              {c.initials}
                            </span>
                            <span className="leading-tight">
                              <span className="block text-[12.5px] text-[#0f1f3d] whitespace-nowrap">{c.name}</span>
                              <span className="block text-[11.5px] text-[#5b6780]">{c.sub}</span>
                            </span>
                          </div>
                        </td>
                        <td className={TD}>
                          <Badge tone={c.type[1]}>{c.type[0]}</Badge>
                        </td>
                        <td className={TD_WRAP}>{c.need}</td>
                        <td className={TD}>{c.date}</td>
                        <td className={TD}>
                          <Badge tone={c.status[1]}>{c.status[0]}</Badge>
                        </td>
                      </tr>
                    ))}
                    {!visibleCustomers.length && (
                      <tr>
                        <td colSpan={6} className="px-3 py-8 text-center text-[13px] text-[#5b6780]">
                          Không tìm thấy khách hàng phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Lịch hẹn kỹ thuật" link="Xem lịch">
              <div className="overflow-x-auto px-2.5 pb-3">
                <table className="w-full">
                  <thead className="bg-[#f4f7fc]">
                    <tr>
                      <th className={TH}>Thời gian</th>
                      <th className={TH}>Khách hàng</th>
                      <th className={TH}>Thiết bị</th>
                      <th className={TH}>Địa điểm</th>
                      <th className={TH}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {APPOINTMENTS.map((a) => (
                      <tr key={a.time + a.customer} className="border-b border-[#eef2f8] last:border-0 hover:bg-[#f8fafd]">
                        <td className={`${TD} py-3`}>{a.time}</td>
                        <td className={TD}>{a.customer}</td>
                        <td className={TD_WRAP}>{a.device}</td>
                        <td className={TD}>{a.place}</td>
                        <td className={TD}>
                          <Badge tone={a.status[1]}>{a.status[0]}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Activity + tasks */}
          <div className="grid grid-cols-1 xl:grid-cols-[0.8fr_1fr] gap-3">
            <Card title="Hoạt động gần đây" link="Xem tất cả">
              <ul className="px-5 pb-4 space-y-4">
                {ACTIVITIES.map(({ who, action, target, ago, icon: Icon, tone }) => (
                  <li key={target} className="flex items-start gap-3.5">
                    <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${TONE[tone]}`}>
                      <Icon size={19} strokeWidth={1.8} />
                    </span>
                    <div className="text-[13.5px] leading-snug">
                      <p className="text-[#1f2d46]">
                        {who} {action} <a className="text-[#1a64d6] hover:underline cursor-pointer">{target}</a>
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-[#5b6780]">{ago}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Nhiệm vụ của tôi" link="Xem tất cả">
              <div className="overflow-x-auto px-2.5 pb-3">
                <table className="w-full">
                  <thead className="bg-[#f4f7fc]">
                    <tr>
                      <th className={`${TH} w-8`} />
                      <th className={TH}>Nhiệm vụ</th>
                      <th className={TH}>Khách hàng</th>
                      <th className={TH}>Hạn hoàn thành</th>
                      <th className={TH}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t, i) => (
                      <tr key={t.task} className="border-b border-[#eef2f8] last:border-0 hover:bg-[#f8fafd]">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() =>
                              setTasks((prev) => prev.map((x, k) => (k === i ? { ...x, done: !x.done } : x)))
                            }
                            aria-label={`Đánh dấu: ${t.task}`}
                            className="w-4 h-4 accent-[#1a64d6] cursor-pointer"
                          />
                        </td>
                        <td className={TD}>{t.task}</td>
                        <td className={TD}>{t.customer}</td>
                        <td className={TD}>{t.due}</td>
                        <td className={TD}>
                          {t.done ? <Badge tone="blue">Đang thực hiện</Badge> : <Badge tone="red">Chưa hoàn thành</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
          </>
          )}
        </main>
      </div>

      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/35 p-4" onMouseDown={() => setIsAddCustomerOpen(false)}>
          <form
            onSubmit={addCustomer}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-[460px] rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-bold text-[#0f1f3d]">Thêm khách hàng</h2>
                <p className="mt-1 text-[13px] text-[#5b6780]">Tạo nhanh một khách hàng mới trong CRM.</p>
              </div>
              <button type="button" onClick={() => setIsAddCustomerOpen(false)} aria-label="Đóng" className="text-2xl leading-none text-[#5b6780] cursor-pointer">
                ×
              </button>
            </div>
            <label className="mt-5 block text-[13px] font-medium text-[#27344d]">
              Tên khách hàng
              <input
                autoFocus
                required
                value={newCustomerName}
                onChange={(event) => setNewCustomerName(event.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe6f1] px-3 text-[13px] outline-none focus:border-[#1a64d6]"
                placeholder="Ví dụ: Phòng khám Hồng Đức"
              />
            </label>
            <label className="mt-4 block text-[13px] font-medium text-[#27344d]">
              Nhu cầu
              <input
                required
                value={newCustomerNeed}
                onChange={(event) => setNewCustomerNeed(event.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe6f1] px-3 text-[13px] outline-none focus:border-[#1a64d6]"
                placeholder="Ví dụ: Máy xét nghiệm"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="h-10 rounded-lg border border-[#dfe6f1] px-4 text-[13px] text-[#27344d] cursor-pointer">
                Hủy
              </button>
              <button type="submit" className="h-10 rounded-lg bg-[#1a64d6] px-4 text-[13px] font-medium text-white cursor-pointer">
                Lưu khách hàng
              </button>
            </div>
          </form>
        </div>
      )}

      {isAddModuleOpen && moduleRecords[activeNav] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/35 p-4" onMouseDown={() => setIsAddModuleOpen(false)}>
          <form onSubmit={addModuleRecord} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-bold text-[#0f1f3d]">{editingModuleRow === null ? 'Thêm' : 'Sửa'} {activeNav}</h2>
                <p className="mt-1 text-[13px] text-[#5b6780]">Nhập đủ các trường để lưu bản ghi mới.</p>
              </div>
              <button type="button" onClick={() => setIsAddModuleOpen(false)} aria-label="Đóng" className="text-2xl leading-none text-[#5b6780] cursor-pointer">×</button>
            </div>
            <div className="mt-4 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
              {moduleRecords[activeNav].columns.map((column, index) => (
                <label key={column} className="block text-[13px] font-medium text-[#27344d]">
                  {column}
                  <input
                    required
                    value={moduleDraft[index] || ''}
                    onChange={(event) => setModuleDraft((current) => current.map((value, draftIndex) => draftIndex === index ? event.target.value : value))}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#dfe6f1] px-3 text-[13px] outline-none focus:border-[#1a64d6]"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddModuleOpen(false)} className="h-10 rounded-lg border border-[#dfe6f1] px-4 text-[13px] text-[#27344d] cursor-pointer">Hủy</button>
              <button type="submit" className="h-10 rounded-lg bg-[#1a64d6] px-4 text-[13px] font-medium text-white cursor-pointer">Lưu bản ghi</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CrmDashboard;
