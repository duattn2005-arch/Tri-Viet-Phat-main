import React, { useEffect, useState } from 'react';
import {
  Home,
  Users,
  Filter,
  FileText,
  Package,
  Wrench,
  CalendarDays,
  FileSignature,
  Headphones,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  UserCheck,
  Menu,
  X,
  Search,
  Plus,
  ArrowUp,
  ArrowRight,
  Coins,
} from 'lucide-react';
import { ContractsView } from './views/ContractsView';
import { CustomerCareView } from './views/CustomerCareView';
import { ReportsView } from './views/ReportsView';
import { TechnicalScheduleView } from './views/TechnicalScheduleView';
import { RepairMaintenanceView } from './views/RepairMaintenanceView';

export interface CrmDashboardProps {
  onNavigateTab?: (tab: any) => void;
  initialNav?: string;
}

const NAV_ITEMS = [
  { label: 'Tổng quan', icon: Home },
  { label: 'Khách hàng', icon: Users },
  { label: 'Cơ hội kinh doanh', icon: Filter },
  { label: 'Báo giá', icon: FileText },
  { label: 'Đơn hàng', icon: Package },
  { label: 'Sửa chữa - Bảo trì', icon: Wrench },
  { label: 'Lịch hẹn kỹ thuật', icon: CalendarDays },
  { label: 'Hợp đồng', icon: FileSignature },
  { label: 'Chăm sóc khách hàng', icon: Headphones },
  { label: 'Báo cáo', icon: BarChart3 },
  { label: 'Cài đặt', icon: Settings },
];

/* Demo data for Overview / Generic workspaces */
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
const REVENUE = [170, 240, 280, 350, 380, 490];
const ORDERS = [12, 17, 18, 24, 27, 37];

const SOURCES = [
  { label: 'Website', pct: 32, color: '#1f6fe5' },
  { label: 'Tư vấn trực tiếp', pct: 24, color: '#22c55e' },
  { label: 'Giới thiệu', pct: 18, color: '#fb923c' },
  { label: 'Zalo', pct: 12, color: '#a855f7' },
  { label: 'Facebook', pct: 8, color: '#f472b6' },
  { label: 'Khác', pct: 6, color: '#a3b8d4' },
];

const NEW_CUSTOMERS = [
  { name: 'Bệnh viện Đa khoa Nam Định', sub: 'namdinh-hospital.vn', type: 'Bệnh viện', need: 'Máy xét nghiệm sinh hóa AU680', date: '24/09/2025', status: 'Mới' },
  { name: 'Phòng khám An Bình', sub: '0965.123.456', type: 'Phòng khám', need: 'Máy siêu âm DC-70', date: '23/09/2025', status: 'Đang tư vấn' },
  { name: 'TTYT huyện Giao Thủy', sub: 'giaothuy.gov.vn', type: 'Trung tâm y tế', need: 'Sửa chữa máy X-quang', date: '22/09/2025', status: 'Đã gửi báo giá' },
  { name: 'Bệnh viện Sản Nhi Hà Nội', sub: 'sanhi-hanoi.vn', type: 'Bệnh viện', need: 'Bảo trì định kỳ máy CL-900i', date: '21/09/2025', status: 'Đã chốt' },
  { name: 'Phòng khám Minh Tâm', sub: '0387.654.321', type: 'Phòng khám', need: 'Máy điện tim EDAN SE-1200', date: '20/09/2025', status: 'Đang tư vấn' },
];

const APPOINTMENTS = [
  { time: '24/09 08:30', customer: 'Bệnh viện ĐK Nam Định', device: 'Máy xét nghiệm sinh hóa', place: 'Nam Định', status: 'Sắp tới' },
  { time: '24/09 10:30', customer: 'PK An Bình', device: 'Máy siêu âm', place: 'Hà Nội', status: 'Đã xác nhận' },
  { time: '24/09 13:00', customer: 'TTYT Giao Thủy', device: 'Máy X-quang', place: 'Nam Định', status: 'Đang di chuyển' },
  { time: '24/09 15:00', customer: 'BV Sản Nhi Hà Nội', device: 'Máy điện tim', place: 'Hà Nội', status: 'Sắp tới' },
];

const MODULE_RECORDS: Record<string, { columns: string[]; rows: string[][] }> = {
  'Cơ hội kinh doanh': {
    columns: ['Cơ hội', 'Khách hàng', 'Giá trị dự kiến', 'Giai đoạn', 'Người phụ trách'],
    rows: [
      ['Cung cấp máy xét nghiệm sinh hóa', 'Bệnh viện ĐK Nam Định', '1.250.000.000 đ', 'Đang tư vấn', 'Nguyễn Văn A'],
      ['Gói hóa chất huyết học 2025', 'PK An Bình', '120.000.000 đ', 'Đã gửi báo giá', 'Trần Thị B'],
      ['Hợp đồng bảo trì X-quang', 'TTYT Giao Thủy', '180.000.000 đ', 'Khách hàng tiềm năng', 'Lê Minh C'],
    ],
  },
  'Báo giá': {
    columns: ['Mã báo giá', 'Khách hàng', 'Nội dung', 'Tổng tiền', 'Trạng thái'],
    rows: [
      ['#BG-2025-128', 'PK An Bình', 'Máy siêu âm Mindray DC-70', '420.000.000 đ', 'Đã gửi'],
      ['#BG-2025-127', 'BV Sản Nhi Hà Nội', 'Gói bảo trì định kỳ CL-900i', '85.000.000 đ', 'Đang soạn'],
      ['#BG-2025-126', 'TTYT Giao Thủy', 'Sửa chữa máy X-quang DRGEM', '32.500.000 đ', 'Chờ phản hồi'],
    ],
  },
  'Đơn hàng': {
    columns: ['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Ngày đặt', 'Trạng thái'],
    rows: [
      ['#DH-2025-084', 'BV Sản Nhi Hà Nội', 'Máy xét nghiệm HbA1c', '20/09/2025', 'Đang giao'],
      ['#DH-2025-083', 'Phòng khám Minh Tâm', 'Máy điện tim EDAN', '18/09/2025', 'Đã hoàn thành'],
      ['#DH-2025-082', 'PK An Bình', 'Hóa chất huyết học Dewei', '16/09/2025', 'Đang xử lý'],
    ],
  },
  'Cài đặt': {
    columns: ['Thiết lập', 'Giá trị hiện tại', 'Mô tả', 'Trạng thái'],
    rows: [
      ['Thông báo lịch hẹn kỹ thuật', 'Bật', 'Nhắc lịch trước 24 giờ qua Zalo/Email', 'Đang hoạt động'],
      ['Cảnh báo gia hạn hợp đồng', 'Bật (trước 30 ngày)', 'Tự động gửi cảnh báo hợp đồng sắp hết hạn', 'Đang hoạt động'],
      ['Tự động sao lưu dữ liệu CRM', 'Hàng ngày lúc 02:00', 'Lưu trữ an toàn trên đám mây', 'Đang hoạt động'],
      ['Định dạng tiền tệ', 'VND', 'Hiển thị giá trị theo chuẩn tiền tệ Việt Nam', 'Đang hoạt động'],
    ],
  },
};

export const CrmDashboard: React.FC<CrmDashboardProps> = ({ onNavigateTab, initialNav }) => {
  const [activeNav, setActiveNav] = useState(initialNav || 'Hợp đồng');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerNeed, setNewCustomerNeed] = useState('');
  const [customers, setCustomers] = useState(NEW_CUSTOMERS);

  // Sync initialNav if prop updates
  useEffect(() => {
    if (initialNav) {
      setActiveNav(initialNav);
    }
  }, [initialNav]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;
    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    setCustomers([
      {
        name: newCustomerName.trim(),
        sub: '09xx.xxx.xxx',
        type: 'Phòng khám',
        need: newCustomerNeed.trim() || 'Máy xét nghiệm',
        date: todayStr,
        status: 'Mới',
      },
      ...customers,
    ]);
    setNewCustomerName('');
    setNewCustomerNeed('');
    setIsAddCustomerOpen(false);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'Hợp đồng':
        return <ContractsView />;
      case 'Chăm sóc khách hàng':
        return <CustomerCareView />;
      case 'Báo cáo':
        return <ReportsView />;
      case 'Lịch hẹn kỹ thuật':
        return <TechnicalScheduleView />;
      case 'Sửa chữa - Bảo trì':
        return <RepairMaintenanceView />;

      case 'Khách hàng': {
        const filtered = customers.filter(
          (c) =>
            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            c.need.toLowerCase().includes(customerSearch.toLowerCase())
        );
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-[26px] font-bold text-[#0f1f3d] leading-tight">Khách hàng</h1>
                <p className="mt-1 text-[14px] text-[#55637d]">Quản lý danh sách bệnh viện, phòng khám và cơ sở y tế đối tác.</p>
              </div>
              <button
                onClick={() => setIsAddCustomerOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#1a64d6] text-white text-[13px] font-medium shadow-xs cursor-pointer"
              >
                <Plus size={16} />
                <span>Thêm khách hàng</span>
              </button>
            </div>

            <div className="rounded-xl bg-white border border-[#e6ecf5] shadow-[0_1px_3px_rgba(16,42,90,0.04)] overflow-hidden">
              <div className="p-3.5 border-b border-[#eef2f8] flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b99af]" size={15} />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Tìm theo tên cơ sở, nhu cầu..."
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#dfe6f1] text-[12.5px] outline-none focus:border-[#1a64d6]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="bg-[#f8fafd] border-b border-[#eef2f8] text-[11px] font-semibold text-[#5b6780] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Khách hàng / Cơ sở</th>
                      <th className="py-3 px-3">Loại hình</th>
                      <th className="py-3 px-3">Nhu cầu / Thiết bị quan tâm</th>
                      <th className="py-3 px-3">Ngày tạo</th>
                      <th className="py-3 px-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eef2f8]">
                    {filtered.map((c, i) => (
                      <tr key={c.name} className="hover:bg-[#f9fbfe]">
                        <td className="py-3 px-3 text-[#8b99af]">{i + 1}</td>
                        <td className="py-3 px-3 font-semibold text-[#0f1f3d]">{c.name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#e8f1fe] text-[#1a64d6]">{c.type}</span>
                        </td>
                        <td className="py-3 px-3 text-[#44526b]">{c.need}</td>
                        <td className="py-3 px-3 text-[#5b6780]">{c.date}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e6f7ee] text-[#16a34a]">{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'Tổng quan':
      default:
        if (MODULE_RECORDS[activeNav]) {
          const mod = MODULE_RECORDS[activeNav];
          return (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-[26px] font-bold text-[#0f1f3d] leading-tight">{activeNav}</h1>
                  <p className="mt-1 text-[14px] text-[#55637d]">Quản lý thông tin và theo dõi dữ liệu của phân hệ {activeNav.toLowerCase()}.</p>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-[#e6ecf5] shadow-[0_1px_3px_rgba(16,42,90,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12.5px]">
                    <thead className="bg-[#f8fafd] border-b border-[#eef2f8] text-[11px] font-semibold text-[#5b6780] uppercase tracking-wider">
                      <tr>
                        {mod.columns.map((c) => (
                          <th key={c} className="py-3 px-3">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eef2f8]">
                      {mod.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#f9fbfe]">
                          {row.map((val, cellIdx) => (
                            <td key={cellIdx} className={`py-3 px-3 ${cellIdx === 0 ? 'font-semibold text-[#1a64d6]' : 'text-[#27344d]'}`}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }

        // Default Overview View
        return (
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-[26px] font-bold text-[#0f1f3d] leading-tight">
                <span className="text-[#1a64d6]">CRM</span> - Tổng quan hệ thống
              </h1>
              <p className="mt-1 text-[14px] text-[#55637d]">
                Bảng điều khiển tổng hợp khách hàng, cơ hội kinh doanh, báo giá, dịch vụ sửa chữa và bảo trì thiết bị y tế.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {KPIS.map((kpi) => {
                const IconComp = kpi.icon;
                return (
                  <div key={kpi.label} className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.green ? 'bg-[#e6f7ee] text-[#16a34a]' : 'bg-[#e8f1fe] text-[#1a64d6]'}`}>
                      <IconComp size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-[#5b6780]">{kpi.label}</div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className={`font-bold text-[#0f1f3d] truncate ${kpi.green ? 'text-[17px]' : 'text-[22px]'}`}>{kpi.value}</span>
                        {!kpi.green && <span className="text-[11.5px] font-medium text-[#16a34a]">↑ {kpi.trend}</span>}
                      </div>
                      <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Funnel */}
              <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
                <h3 className="text-[15px] font-bold text-[#0f1f3d] mb-3">Pipeline khách hàng</h3>
                <div className="space-y-2.5">
                  {PIPELINE.map((p) => (
                    <div key={p.label}>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="text-[#44526b] font-medium">{p.label}</span>
                        <span className="font-semibold text-[#0f1f3d]">{p.value} ({p.pct})</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#f1f5fa] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: p.pct, backgroundColor: p.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue & Orders */}
              <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
                <h3 className="text-[15px] font-bold text-[#0f1f3d] mb-3">Doanh thu & Đơn hàng</h3>
                <div className="w-full h-48">
                  <svg viewBox="0 0 300 140" className="w-full h-full">
                    {MONTHS.map((m, i) => {
                      const x = 30 + i * 48;
                      const barH = (ORDERS[i] / 50) * 80;
                      return (
                        <g key={m}>
                          <rect x={x - 8} y={110 - barH} width="16" height={barH} rx="2" fill="#93c5fd" opacity="0.85" />
                          <text x={x} y="126" fontSize="9" fill="#5b6780" textAnchor="middle">
                            {m.replace('Tháng ', 'T')}
                          </text>
                        </g>
                      );
                    })}
                    <path
                      d={REVENUE.map((v, i) => `${i === 0 ? 'M' : 'L'} ${30 + i * 48} ${110 - (v / 500) * 90}`).join(' ')}
                      fill="none"
                      stroke="#1a64d6"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Sources */}
              <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
                <h3 className="text-[15px] font-bold text-[#0f1f3d] mb-3">Nguồn khách hàng</h3>
                <div className="space-y-2">
                  {SOURCES.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-[12px]">
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

            {/* Quick Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Customers */}
              <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-bold text-[#0f1f3d]">Khách hàng mới</h3>
                  <button onClick={() => setActiveNav('Khách hàng')} className="text-[12px] font-medium text-[#1a64d6] hover:underline flex items-center gap-1 cursor-pointer">
                    Xem tất cả <ArrowRight size={13} />
                  </button>
                </div>
                <div className="space-y-2.5">
                  {NEW_CUSTOMERS.slice(0, 4).map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-[12.5px] p-2 rounded-lg hover:bg-[#f8fafd]">
                      <div>
                        <div className="font-semibold text-[#0f1f3d]">{c.name}</div>
                        <div className="text-[11px] text-[#8b99af]">{c.need}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#e6f7ee] text-[#16a34a]">{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-bold text-[#0f1f3d]">Lịch hẹn kỹ thuật sắp tới</h3>
                  <button onClick={() => setActiveNav('Lịch hẹn kỹ thuật')} className="text-[12px] font-medium text-[#1a64d6] hover:underline flex items-center gap-1 cursor-pointer">
                    Xem lịch <ArrowRight size={13} />
                  </button>
                </div>
                <div className="space-y-2.5">
                  {APPOINTMENTS.map((a) => (
                    <div key={a.time + a.customer} className="flex items-center justify-between text-[12.5px] p-2 rounded-lg hover:bg-[#f8fafd]">
                      <div>
                        <div className="font-semibold text-[#0f1f3d]">{a.customer}</div>
                        <div className="text-[11px] text-[#55637d]">{a.time} - {a.device}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e8f1fe] text-[#1a64d6]">{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f3f6fb] text-[#0f1f3d]">
      <div className="max-w-[1600px] mx-auto flex">
        {/* Mobile menu toggle button */}
        <div className="lg:hidden fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-12 h-12 rounded-full bg-[#1a64d6] text-white shadow-xl flex items-center justify-center cursor-pointer"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* CRM Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-56 bg-white border-r border-[#e6ecf5] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shrink-0 ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Top: Logo CRM */}
          <div className="p-4 border-b border-[#eef2f8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
              <UserCheck size={22} />
            </div>
            <div className="leading-tight">
              <div className="text-[17px] font-bold text-[#0f1f3d] tracking-tight">CRM</div>
              <div className="text-[11px] font-medium text-[#5b6780]">Quản lý khách hàng</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2.5 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
            {NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1a64d6] text-white shadow-[0_4px_12px_-2px_rgba(26,100,214,0.7)]'
                      : 'text-[#44526b] hover:bg-[#f1f5fc] hover:text-[#0f1f3d]'
                  }`}
                >
                  <IconComponent size={17} className={isActive ? 'text-white' : 'text-[#5b6780]'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Main Content Area */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 space-y-4">
          {/* Top Breadcrumb & User info row */}
          <div className="flex items-center justify-between pb-2 border-b border-[#e6ecf5]/60">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12.5px] text-[#8b99af]">
              <button
                onClick={() => onNavigateTab ? onNavigateTab('trang-chu') : (window.location.href = '/')}
                className="hover:text-[#1a64d6] cursor-pointer"
              >
                Trang chủ
              </button>
              <span>›</span>
              <span className="text-[#55637d]">CRM</span>
              <span>›</span>
              <span className="font-semibold text-[#0f1f3d]">{activeNav}</span>
            </div>

            {/* User notification & Avatar */}
            <div className="flex items-center gap-4">
              <button className="relative p-1.5 text-[#55637d] hover:text-[#0f1f3d] rounded-lg hover:bg-white cursor-pointer" title="Thông báo">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ef4444] text-white text-[9.5px] font-bold flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="flex items-center gap-2.5 cursor-pointer pl-2">
                <div className="w-8 h-8 rounded-full bg-[#1a64d6] text-white font-bold text-[11.5px] flex items-center justify-center shrink-0">
                  NV
                </div>
                <div className="hidden sm:block leading-tight text-left">
                  <div className="text-[13px] font-bold text-[#0f1f3d]">Nguyễn Văn A</div>
                  <div className="text-[11px] text-[#8b99af]">Nhân viên kinh doanh</div>
                </div>
                <ChevronDown size={14} className="text-[#8b99af]" />
              </div>
            </div>
          </div>

          {/* Active Screen View */}
          {renderContent()}
        </div>
      </div>

      {/* Modal: Thêm khách hàng (nếu đang ở tab Khách hàng) */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/40 backdrop-blur-xs p-4" onClick={() => setIsAddCustomerOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f8] pb-3 mb-4">
              <h2 className="text-[18px] font-bold text-[#0f1f3d]">Thêm khách hàng mới</h2>
              <button onClick={() => setIsAddCustomerOpen(false)} className="text-[#8b99af] hover:text-[#0f1f3d] p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3.5">
              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Tên khách hàng / Cơ sở y tế</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bệnh viện Đa khoa Quốc tế"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Nhu cầu / Thiết bị quan tâm</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Máy xét nghiệm sinh hóa"
                  value={newCustomerNeed}
                  onChange={(e) => setNewCustomerNeed(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eef2f8]">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="h-10 px-4 rounded-lg border border-[#dfe6f1] text-[13px] text-[#44526b] hover:bg-[#f8fafd] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13px] font-medium cursor-pointer"
                >
                  Lưu khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmDashboard;
