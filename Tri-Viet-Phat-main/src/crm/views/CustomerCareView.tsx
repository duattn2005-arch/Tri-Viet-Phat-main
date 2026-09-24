import React, { useState } from 'react';
import {
  PhoneCall,
  CalendarCheck,
  FileCheck,
  Users,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Star,
  MoreHorizontal,
  Wrench,
  Settings,
  Truck,
  FileText,
  Headphones,
  RefreshCw,
  X
} from 'lucide-react';
import { CustomerCareItem } from '../types';

const INITIAL_CARE_ITEMS: CustomerCareItem[] = [
  { id: 1, customer: 'Bệnh viện Đa khoa Nam Định', location: 'Nam Định', careType: 'Bảo trì nhắc lịch', equipment: 'Máy xét nghiệm sinh hóa', assignee: { initials: 'NV', name: 'Nguyễn Văn A' }, appointmentDate: '24/09/2025 09:00', contactChannel: 'Điện thoại', status: 'Đã hoàn thành', rating: 5 },
  { id: 2, customer: 'Phòng khám An Bình', location: 'Hà Nội', careType: 'Gọi lại', equipment: 'Máy siêu âm', assignee: { initials: 'TH', name: 'Trần Thị Hà' }, appointmentDate: '23/09/2025 14:30', contactChannel: 'Điện thoại', status: 'Đang thực hiện', rating: 4 },
  { id: 3, customer: 'TTYT Huyện Giao Thủy', location: 'Nam Định', careType: 'Hậu mãi', equipment: 'Máy X-quang', assignee: { initials: 'LH', name: 'Lê Minh Hoàng' }, appointmentDate: '22/09/2025 10:00', contactChannel: 'Điện thoại', status: 'Chờ liên hệ', rating: 4 },
  { id: 4, customer: 'Bệnh viện Sản Nhi Hà Nội', location: 'Hà Nội', careType: 'Khảo sát NPS', equipment: 'Máy định tính', assignee: { initials: 'PT', name: 'Phạm Thu Phương' }, appointmentDate: '21/09/2025 15:00', contactChannel: 'Email', status: 'Đã hoàn thành', rating: 5 },
  { id: 5, customer: 'Phòng khám Minh Tâm', location: 'Hà Nội', careType: 'Khiếu nại cần xử lý', equipment: 'Máy điện tim', assignee: { initials: 'ĐD', name: 'Đỗ Đức Duy' }, appointmentDate: '20/09/2025 08:30', contactChannel: 'Điện thoại', status: 'Đang xử lý', rating: 2 },
  { id: 6, customer: 'TTYT Quỳnh Phụ', location: 'Thái Bình', careType: 'Gọi lại', equipment: 'Máy huyết học', assignee: { initials: 'NV', name: 'Nguyễn Văn A' }, appointmentDate: '20/09/2025 16:00', contactChannel: 'Zalo', status: 'Chờ liên hệ', rating: 3 },
  { id: 7, customer: 'Bệnh viện ĐK Ninh Bình', location: 'Ninh Bình', careType: 'Bảo trì nhắc lịch', equipment: 'Tủ bảo quản vắc xin', assignee: { initials: 'TH', name: 'Trần Thị Hà' }, appointmentDate: '19/09/2025 09:00', contactChannel: 'Điện thoại', status: 'Đã hoàn thành', rating: 4 },
  { id: 8, customer: 'Phòng khám Gia Lâm', location: 'Hà Nội', careType: 'Hậu mãi', equipment: 'Máy xét nghiệm nước tiểu', assignee: { initials: 'LH', name: 'Lê Minh Hoàng' }, appointmentDate: '18/09/2025 14:00', contactChannel: 'Điện thoại', status: 'Đang thực hiện', rating: 4 },
  { id: 9, customer: 'TTYT Ý Yên', location: 'Nam Định', careType: 'Khảo sát NPS', equipment: 'Máy sinh hóa', assignee: { initials: 'PT', name: 'Phạm Thu Phương' }, appointmentDate: '18/09/2025 10:30', contactChannel: 'Email', status: 'Đã hoàn thành', rating: 5 },
  { id: 10, customer: 'Bệnh viện Mắt Hà Nội', location: 'Hà Nội', careType: 'Gọi lại', equipment: 'Máy mổ mắt', assignee: { initials: 'ĐD', name: 'Đỗ Đức Duy' }, appointmentDate: '17/09/2025 11:00', contactChannel: 'Điện thoại', status: 'Chờ liên hệ', rating: 3 },
];

const SATISFACTION_DATA = [
  { label: 'Rất hài lòng', pct: 45, color: '#22c55e' },
  { label: 'Hài lòng', pct: 32, color: '#0ea5e9' },
  { label: 'Bình thường', pct: 15, color: '#eab308' },
  { label: 'Chưa hài lòng', pct: 6, color: '#f97316' },
  { label: 'Rất không hài lòng', pct: 2, color: '#ef4444' },
];

const TOP_ISSUES = [
  { id: 1, title: 'Bảo trì, bảo dưỡng thiết bị', count: 28, pct: '31%', icon: Wrench },
  { id: 2, title: 'Hướng dẫn sử dụng thiết bị', count: 18, pct: '20%', icon: Settings },
  { id: 3, title: 'Cung ứng vật tư, hóa chất', count: 14, pct: '16%', icon: Truck },
  { id: 4, title: 'Báo giá, hợp đồng', count: 10, pct: '11%', icon: FileText },
  { id: 5, title: 'Hỗ trợ kỹ thuật, sửa chữa', count: 9, pct: '10%', icon: Headphones },
  { id: 6, title: 'Thay thế linh kiện', count: 7, pct: '8%', icon: RefreshCw },
  { id: 7, title: 'Khác', count: 4, pct: '4%', icon: MoreHorizontal },
];

export const CustomerCareView: React.FC = () => {
  const [careItems, setCareItems] = useState<CustomerCareItem[]>(INITIAL_CARE_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // New campaign form
  const [campaignName, setCampaignName] = useState('');
  const [campaignTarget, setCampaignTarget] = useState('Khách hàng sắp đến hạn bảo trì');

  const filteredItems = careItems.filter((item) => {
    const matchSearch =
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmp = employeeFilter === 'all' || item.assignee.name === employeeFilter;
    return matchSearch && matchEmp;
  });

  const getCareTypeBadge = (type: CustomerCareItem['careType']) => {
    switch (type) {
      case 'Bảo trì nhắc lịch':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e8f1fe] text-[#1a64d6]">Bảo trì nhắc lịch</span>;
      case 'Gọi lại':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e6f7ee] text-[#16a34a]">Gọi lại</span>;
      case 'Hậu mãi':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f3e8ff] text-[#9333ea]">Hậu mãi</span>;
      case 'Khảo sát NPS':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#fce7f3] text-[#db2777]">Khảo sát NPS</span>;
      case 'Khiếu nại cần xử lý':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#fdecec] text-[#dc2626]">Khiếu nại cần xử lý</span>;
    }
  };

  const getStatusBadge = (status: CustomerCareItem['status']) => {
    switch (status) {
      case 'Đã hoàn thành':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e6f7ee] text-[#16a34a]">Đã hoàn thành</span>;
      case 'Đang thực hiện':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fff6dd] text-[#d97706]">Đang thực hiện</span>;
      case 'Chờ liên hệ':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fef3c7] text-[#b45309]">Chờ liên hệ</span>;
      case 'Đang xử lý':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ffedd5] text-[#ea580c]">Đang xử lý</span>;
    }
  };

  const getChannelIcon = (ch: CustomerCareItem['contactChannel']) => {
    switch (ch) {
      case 'Điện thoại':
        return (
          <span className="flex items-center gap-1.5 text-[12px] text-[#27344d]">
            <Phone size={14} className="text-[#1a64d6]" />
            <span>Điện thoại</span>
          </span>
        );
      case 'Email':
        return (
          <span className="flex items-center gap-1.5 text-[12px] text-[#27344d]">
            <Mail size={14} className="text-[#0ea5e9]" />
            <span>Email</span>
          </span>
        );
      case 'Zalo':
        return (
          <span className="flex items-center gap-1.5 text-[12px] text-[#27344d]">
            <span className="w-3.5 h-3.5 rounded-full bg-[#0068ff] text-white text-[9px] font-bold flex items-center justify-center leading-none">Z</span>
            <span>Zalo</span>
          </span>
        );
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;
    alert(`Đã khởi tạo chiến dịch CSKH: "${campaignName}"!`);
    setIsCampaignModalOpen(false);
    setCampaignName('');
  };

  return (
    <div className="space-y-4">
      {/* Title & Description */}
      <div>
        <h1 className="text-[26px] font-bold text-[#0f1f3d] leading-tight">Chăm sóc khách hàng</h1>
        <p className="mt-1 text-[14px] text-[#55637d]">
          Quản lý hoạt động hậu mãi, nhắc lịch bảo trì, gọi điện chăm sóc, khảo sát hài lòng và hỗ trợ khách hàng.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] hover:bg-[#f8fafd] cursor-pointer">
          <Calendar size={15} className="text-[#8b99af]" />
          <span>01/09/2025 - 30/09/2025</span>
          <ChevronDown size={14} className="text-[#8b99af]" />
        </button>

        <button
          onClick={() => setIsCampaignModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13.5px] font-medium transition-colors shadow-[0_4px_12px_-3px_rgba(26,100,214,0.6)] cursor-pointer"
        >
          <Plus size={16} />
          <span>Tạo chiến dịch CSKH</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Calls */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <PhoneCall size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Cuộc gọi chăm sóc</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">286</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 18%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* Maintenance reminders */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <CalendarCheck size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Lịch bảo trì nhắc lại</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">124</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 25%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* Surveys */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <FileCheck size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Khảo sát hài lòng</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">96</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 12%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Khách hàng cần theo dõi</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">42</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 8%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">tăng so với tháng trước</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Customer Care List (Left) + Widgets (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        {/* Table Card */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] shadow-[0_1px_3px_rgba(16,42,90,0.04)] overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#eef2f8]">
            <h2 className="text-[16px] font-semibold text-[#0f1f3d] mb-3">Danh sách khách hàng cần chăm sóc</h2>

            {/* Filter toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-[280px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b99af]" size={15} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên khách hàng, mã KH, thiết bị..."
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#dfe6f1] bg-[#f8fafd] text-[12.5px] placeholder:text-[#8b99af] outline-none focus:border-[#1a64d6] focus:bg-white"
                  />
                </div>

                {/* Filter button */}
                <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#dfe6f1] text-[12.5px] text-[#44526b] hover:bg-[#f8fafd] cursor-pointer">
                  <Filter size={14} className="text-[#8b99af]" />
                  <span>Bộ lọc</span>
                </button>

                {/* Employee select */}
                <div className="relative">
                  <select
                    value={employeeFilter}
                    onChange={(e) => setEmployeeFilter(e.target.value)}
                    className="appearance-none h-9 pl-3 pr-7 rounded-lg border border-[#dfe6f1] bg-white text-[12.5px] text-[#27344d] outline-none cursor-pointer"
                  >
                    <option value="all">Tất cả nhân viên</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Trần Thị Hà">Trần Thị Hà</option>
                    <option value="Lê Minh Hoàng">Lê Minh Hoàng</option>
                    <option value="Phạm Thu Phương">Phạm Thu Phương</option>
                    <option value="Đỗ Đức Duy">Đỗ Đức Duy</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={13} />
                </div>
              </div>

              {/* Export button */}
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#dfe6f1] text-[12.5px] text-[#44526b] hover:bg-[#f8fafd] cursor-pointer">
                <Download size={14} />
                <span>Xuất dữ liệu</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafd] border-b border-[#eef2f8] text-[11px] font-semibold text-[#5b6780] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-8">STT</th>
                  <th className="py-3 px-3">Khách hàng</th>
                  <th className="py-3 px-3">Loại chăm sóc</th>
                  <th className="py-3 px-3">Thiết bị</th>
                  <th className="py-3 px-3">Người phụ trách</th>
                  <th className="py-3 px-3">Ngày hẹn</th>
                  <th className="py-3 px-3">Kênh liên hệ</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3">Mức độ hài lòng</th>
                  <th className="py-3 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f8] text-[12.5px] text-[#27344d]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f9fbfe] transition-colors">
                    <td className="py-3 px-3 text-[#8b99af]">{item.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#0f1f3d]">{item.customer}</div>
                      <div className="text-[11px] text-[#8b99af]">{item.location}</div>
                    </td>
                    <td className="py-3 px-3">{getCareTypeBadge(item.careType)}</td>
                    <td className="py-3 px-3 text-[#44526b] max-w-[150px] truncate" title={item.equipment}>
                      {item.equipment}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#1a64d6] text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                          {item.assignee.initials}
                        </span>
                        <span className="text-[12px] font-medium text-[#27344d] whitespace-nowrap">{item.assignee.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[#5b6780] whitespace-nowrap">
                      {item.appointmentDate.split(' ')[0]}
                      <div className="text-[11px] text-[#8b99af]">{item.appointmentDate.split(' ')[1]}</div>
                    </td>
                    <td className="py-3 px-3">{getChannelIcon(item.contactChannel)}</td>
                    <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-0.5 text-[#f59e0b]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            fill={star <= item.rating ? '#f59e0b' : 'none'}
                            stroke={star <= item.rating ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button className="p-1 hover:text-[#0f1f3d] rounded hover:bg-[#f1f5fc] text-[#8b99af] cursor-pointer">
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredItems.length && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-[13px] text-[#8b99af]">
                      Không có khách hàng nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-auto px-5 py-3 border-t border-[#eef2f8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-[#5b6780]">
            <div>Hiển thị 1 - 10 của 38 khách hàng</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">‹</button>
                <button className="w-8 h-8 rounded bg-[#1a64d6] text-white font-medium flex items-center justify-center cursor-pointer">1</button>
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">2</button>
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">3</button>
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">4</button>
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">›</button>
              </div>
              <select className="h-8 rounded border border-[#dfe6f1] bg-white text-[12px] px-2 text-[#44526b] outline-none">
                <option>10 / trang</option>
                <option>20 / trang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Mức độ hài lòng khách hàng */}
          <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14.5px] font-bold text-[#0f1f3d]">Mức độ hài lòng khách hàng</h3>
              <a href="#satisfaction" className="text-[12px] font-medium text-[#1a64d6] hover:underline flex items-center gap-0.5">
                Xem chi tiết →
              </a>
            </div>

            <div className="flex items-center gap-4">
              {/* Donut SVG */}
              <div className="relative w-36 h-36 shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {(() => {
                    const r = 45;
                    const c = 2 * Math.PI * r;
                    let accum = 0;
                    return SATISFACTION_DATA.map((d) => {
                      const strokeDash = `${(d.pct / 100) * c} ${c}`;
                      const strokeOffset = -accum;
                      accum += (d.pct / 100) * c;
                      return (
                        <circle
                          key={d.label}
                          cx="60"
                          cy="60"
                          r={r}
                          fill="transparent"
                          stroke={d.color}
                          strokeWidth="16"
                          strokeDasharray={strokeDash}
                          strokeDashoffset={strokeOffset}
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[20px] font-bold text-[#0f1f3d] leading-none">96</span>
                  <span className="text-[10.5px] text-[#5b6780] mt-0.5">khách hàng</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-1.5 text-[11.5px]">
                {SATISFACTION_DATA.map((d) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#44526b]">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span>{d.label}</span>
                    </span>
                    <span className="font-semibold text-[#0f1f3d]">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top vấn đề khách hàng quan tâm */}
          <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[14.5px] font-bold text-[#0f1f3d]">Top vấn đề khách hàng quan tâm</h3>
              <a href="#issues" className="text-[12px] font-medium text-[#1a64d6] hover:underline flex items-center gap-0.5">
                Xem chi tiết →
              </a>
            </div>

            <div className="space-y-2.5">
              {TOP_ISSUES.map((issue) => {
                const IconComponent = issue.icon;
                return (
                  <div key={issue.id} className="flex items-center justify-between gap-2 text-[12px]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[11.5px] font-bold text-[#8b99af] w-3">{issue.id}</span>
                      <IconComponent size={14} className="text-[#55637d] shrink-0" />
                      <span className="text-[#27344d] truncate">{issue.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-[#0f1f3d]">{issue.count}</span>
                      <span className="text-[#8b99af] text-[11px] w-8 text-right">{issue.pct}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Tạo chiến dịch CSKH */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/40 backdrop-blur-xs p-4" onClick={() => setIsCampaignModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f8] pb-3 mb-4">
              <h2 className="text-[18px] font-bold text-[#0f1f3d]">Tạo chiến dịch chăm sóc mới</h2>
              <button onClick={() => setIsCampaignModalOpen(false)} className="text-[#8b99af] hover:text-[#0f1f3d] p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5">
              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Tên chiến dịch</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Khảo sát chất lượng dịch vụ Q3/2025"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Đối tượng hướng tới</label>
                <select
                  value={campaignTarget}
                  onChange={(e) => setCampaignTarget(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                >
                  <option value="Khách hàng sắp đến hạn bảo trì">Khách hàng sắp đến hạn bảo trì</option>
                  <option value="Khách hàng mua máy mới trong 3 tháng">Khách hàng mua máy mới trong 3 tháng</option>
                  <option value="Khách hàng sau sửa chữa">Khách hàng sau sửa chữa</option>
                  <option value="Tất cả khách hàng phòng khám">Tất cả khách hàng phòng khám</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eef2f8]">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="h-10 px-4 rounded-lg border border-[#dfe6f1] text-[13px] text-[#44526b] hover:bg-[#f8fafd] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13px] font-medium cursor-pointer"
                >
                  Tạo chiến dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
