import React, { useState } from 'react';
import {
  CalendarDays,
  Users,
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
  Plus,
  Eye,
  MoreHorizontal,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { TechnicalAppointment } from '../types';

const INITIAL_APPOINTMENTS: TechnicalAppointment[] = [
  { id: '1', time: '08:30 - 10:00 24/09/2025', customer: 'Bệnh viện Đa khoa Nam Định', customerCode: 'KH-25001', equipment: 'Máy xét nghiệm sinh hóa', task: 'Lắp đặt và hướng dẫn sử dụng', location: 'Nam Định', technician: { initials: 'NV', name: 'Nguyễn Văn A' }, status: 'Sắp tới' },
  { id: '2', time: '10:30 - 11:30 24/09/2025', customer: 'Phòng khám An Bình', customerCode: 'KH-23087', equipment: 'Máy siêu âm', task: 'Hướng dẫn sử dụng', location: 'Hà Nội', technician: { initials: 'TB', name: 'Trần Thị B' }, status: 'Đã xác nhận' },
  { id: '3', time: '13:00 - 14:30 24/09/2025', customer: 'TTYT Giao Thủy', customerCode: 'KH-24056', equipment: 'Máy X-quang', task: 'Bảo trì định kỳ', location: 'Nam Định', technician: { initials: 'LC', name: 'Lê Văn C' }, status: 'Đang di chuyển' },
  { id: '4', time: '15:00 - 16:00 24/09/2025', customer: 'Bệnh viện Sản Nhi Hà Nội', customerCode: 'KH-24109', equipment: 'Máy điện tim', task: 'Sửa chữa, thay linh kiện', location: 'Hà Nội', technician: { initials: 'NV', name: 'Nguyễn Văn A' }, status: 'Sắp tới' },
  { id: '5', time: '09:00 - 10:00 26/09/2025', customer: 'PK Đa khoa Tâm Đức', customerCode: 'KH-24129', equipment: 'Máy huyết học', task: 'Bảo trì định kỳ', location: 'Hưng Yên', technician: { initials: 'TB', name: 'Trần Thị B' }, status: 'Đã xác nhận' },
  { id: '6', time: '14:00 - 16:00 25/09/2025', customer: 'Bệnh viện ĐK Thái Bình', customerCode: 'KH-24176', equipment: 'Máy xét nghiệm miễn dịch', task: 'Lắp đặt', location: 'Thái Bình', technician: { initials: 'PM', name: 'Phạm Minh D' }, status: 'Hoãn lịch' },
  { id: '7', time: '08:00 - 09:30 24/09/2025', customer: 'TTYT Kim Sơn', customerCode: 'KH-24098', equipment: 'Máy sinh hóa', task: 'Kiểm tra, hiệu chuẩn', location: 'Ninh Bình', technician: { initials: 'NV', name: 'Nguyễn Văn A' }, status: 'Sắp tới' },
  { id: '8', time: '10:00 - 12:00 26/09/2025', customer: 'Phòng khám Minh Tâm', customerCode: 'KH-23092', equipment: 'Máy nội soi', task: 'Hướng dẫn sử dụng', location: 'Hà Nội', technician: { initials: 'TB', name: 'Trần Thị B' }, status: 'Hoàn thành' },
  { id: '9', time: '13:30 - 15:00 26/09/2025', customer: 'Bệnh viện Đa khoa Hà Đông', customerCode: 'KH-24133', equipment: 'Máy gây mê', task: 'Bảo trì định kỳ', location: 'Hà Nội', technician: { initials: 'LC', name: 'Lê Văn C' }, status: 'Đã xác nhận' },
  { id: '10', time: '15:30 - 17:00 26/09/2025', customer: 'PK Nhi Đức Minh', customerCode: 'KH-24188', equipment: 'Máy thở', task: 'Sửa chữa', location: 'Hà Nội', technician: { initials: 'PM', name: 'Phạm Minh D' }, status: 'Sắp tới' },
];

const TECHNICIANS = [
  { name: 'Nguyễn Văn A', status: 'Đang thực hiện lịch hẹn', statusColor: 'bg-[#16a34a]', count: '3 lịch' },
  { name: 'Trần Thị B', status: 'Đang thực hiện lịch hẹn', statusColor: 'bg-[#16a34a]', count: '2 lịch' },
  { name: 'Lê Văn C', status: 'Di chuyển', statusColor: 'bg-[#f59e0b]', count: '2 lịch' },
  { name: 'Phạm Minh D', status: 'Rảnh', statusColor: 'bg-[#94a3b8]', count: '1 lịch' },
];

const WEEK_DAYS = [
  { day: 'Thứ 2', date: '22' },
  { day: 'Thứ 3', date: '23' },
  { day: 'Thứ 4', date: '24', active: true },
  { day: 'Thứ 5', date: '25' },
  { day: 'Thứ 6', date: '26' },
  { day: 'Thứ 7', date: '27' },
  { day: 'CN', date: '28' },
];

export const TechnicalScheduleView: React.FC = () => {
  const [appointments, setAppointments] = useState<TechnicalAppointment[]>(INITIAL_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<TechnicalAppointment | null>(null);

  // Form states
  const [newCust, setNewCust] = useState('');
  const [newEquip, setNewEquip] = useState('');
  const [newTask, setNewTask] = useState('Lắp đặt và hướng dẫn sử dụng');
  const [newLocation, setNewLocation] = useState('Hà Nội');
  const [newTech, setNewTech] = useState('Nguyễn Văn A');
  const [newTime, setNewTime] = useState('08:30 - 10:00 25/09/2025');

  const filteredAppts = appointments.filter((a) => {
    const matchSearch =
      a.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.technician.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTech = techFilter === 'all' || a.technician.name === techFilter;
    const matchProv = provinceFilter === 'all' || a.location === provinceFilter;
    return matchSearch && matchTech && matchProv;
  });

  const getStatusBadge = (status: TechnicalAppointment['status']) => {
    switch (status) {
      case 'Sắp tới':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e8f1fe] text-[#1a64d6]">Sắp tới</span>;
      case 'Đã xác nhận':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e6f7ee] text-[#16a34a]">Đã xác nhận</span>;
      case 'Đang di chuyển':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fff6dd] text-[#d97706]">Đang di chuyển</span>;
      case 'Hoãn lịch':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fdecec] text-[#dc2626]">Hoãn lịch</span>;
      case 'Hoàn thành':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e6f7ee] text-[#16a34a]">Hoàn thành</span>;
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.trim()) return;

    const initials = newTech.split(' ').map((p) => p[0]).slice(-2).join('');
    const newAppointment: TechnicalAppointment = {
      id: String(Date.now()),
      time: newTime,
      customer: newCust.trim(),
      customerCode: `KH-${Math.floor(23000 + Math.random() * 2000)}`,
      equipment: newEquip.trim() || 'Thiết bị y tế',
      task: newTask,
      location: newLocation,
      technician: { initials, name: newTech },
      status: 'Sắp tới',
    };

    setAppointments([newAppointment, ...appointments]);
    setIsAddOpen(false);
    setNewCust('');
    setNewEquip('');
  };

  return (
    <div className="space-y-4">
      {/* Title & Description */}
      <div>
        <h1 className="text-[26px] font-bold text-[#0f1f3d] leading-tight">Lịch hẹn kỹ thuật</h1>
        <p className="mt-1 text-[14px] text-[#55637d]">
          Sắp xếp và quản lý lịch hẹn khảo sát, lắp đặt, hướng dẫn sử dụng, bảo trì và sửa chữa thiết bị y tế.
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
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] outline-none cursor-pointer"
            >
              <option value="all">Tất cả kỹ thuật viên</option>
              <option value="Nguyễn Văn A">Nguyễn Văn A</option>
              <option value="Trần Thị B">Trần Thị B</option>
              <option value="Lê Văn C">Lê Văn C</option>
              <option value="Phạm Minh D">Phạm Minh D</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] outline-none cursor-pointer"
            >
              <option value="all">Tất cả tỉnh/thành</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Nam Định">Nam Định</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Ninh Bình">Ninh Bình</option>
              <option value="Thái Bình">Thái Bình</option>
              <option value="Hưng Yên">Hưng Yên</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13.5px] font-medium transition-colors shadow-[0_4px_12px_-3px_rgba(26,100,214,0.6)] cursor-pointer"
        >
          <Plus size={16} />
          <span>Tạo lịch hẹn</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Today appointments */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <CalendarDays size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Số lịch hẹn hôm nay</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">12</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 20%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với hôm qua</div>
          </div>
        </div>

        {/* Busy Techs */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Kỹ thuật viên đang bận</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">8 / 12</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">67% đang thực hiện lịch hẹn</div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e6f7ee] text-[#16a34a] flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Lịch đã hoàn thành</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">28</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 12%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tuần trước</div>
          </div>
        </div>

        {/* On-time rate */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Tỷ lệ đúng hẹn</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">96%</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 4%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (~32%) + Right Column (~68%) */}
      <div className="grid grid-cols-1 xl:grid-cols-[330px_1fr] gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Lịch tuần */}
          <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14.5px] font-bold text-[#0f1f3d]">Lịch tuần</h3>
              <div className="flex items-center gap-1 text-[11.5px]">
                <button className="w-6 h-6 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd]">‹</button>
                <button className="px-2 h-6 rounded border border-[#dfe6f1] hover:bg-[#f8fafd] text-[#44526b]">Hôm nay</button>
                <button className="w-6 h-6 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd]">›</button>
              </div>
            </div>
            <div className="text-[11.5px] text-[#5b6780] mb-3">Tháng 9/2025 - Tuần 36</div>

            {/* Week days row */}
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {WEEK_DAYS.map((w) => (
                <div
                  key={w.day}
                  className={`py-1.5 rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
                    w.active ? 'bg-[#1a64d6] text-white shadow-xs' : 'text-[#44526b] hover:bg-[#f8fafd]'
                  }`}
                >
                  <span className="text-[10px] leading-tight opacity-80">{w.day}</span>
                  <span className="text-[13px] font-bold mt-0.5">{w.date}</span>
                </div>
              ))}
            </div>

            {/* Timeline slots */}
            <div className="space-y-2 text-[11.5px]">
              <div className="text-[#8b99af] text-[10.5px]">08:00</div>
              <div className="p-2.5 rounded-lg bg-[#eff6ff] border-l-4 border-[#1a64d6]">
                <div className="text-[11px] font-bold text-[#1a64d6]">08:30 - 10:00</div>
                <div className="font-semibold text-[#0f1f3d] mt-0.5">Bệnh viện Đa khoa Nam Định</div>
                <div className="text-[#55637d] text-[10.5px]">Lắp đặt máy xét nghiệm sinh hóa</div>
              </div>

              <div className="text-[#8b99af] text-[10.5px] mt-1">10:00</div>
              <div className="p-2.5 rounded-lg bg-[#f0fdf4] border-l-4 border-[#16a34a]">
                <div className="text-[11px] font-bold text-[#16a34a]">10:30 - 11:30</div>
                <div className="font-semibold text-[#0f1f3d] mt-0.5">PK An Bình</div>
                <div className="text-[#55637d] text-[10.5px]">Hướng dẫn sử dụng máy siêu âm</div>
              </div>

              <div className="text-[#8b99af] text-[10.5px] mt-1">12:00</div>

              <div className="text-[#8b99af] text-[10.5px] mt-1">13:00</div>
              <div className="p-2.5 rounded-lg bg-[#fffbeb] border-l-4 border-[#f59e0b]">
                <div className="text-[11px] font-bold text-[#d97706]">13:00 - 14:30</div>
                <div className="font-semibold text-[#0f1f3d] mt-0.5">TTYT Giao Thủy</div>
                <div className="text-[#55637d] text-[10.5px]">Bảo trì máy X-quang</div>
              </div>

              <div className="text-[#8b99af] text-[10.5px] mt-1">15:00</div>
              <div className="p-2.5 rounded-lg bg-[#eff6ff] border-l-4 border-[#1a64d6]">
                <div className="text-[11px] font-bold text-[#1a64d6]">15:00 - 16:00</div>
                <div className="font-semibold text-[#0f1f3d] mt-0.5">Bệnh viện Sản Nhi Hà Nội</div>
                <div className="text-[#55637d] text-[10.5px]">Sửa chữa máy điện tim</div>
              </div>

              <div className="text-[#8b99af] text-[10.5px] mt-1">17:00</div>
            </div>
          </div>

          {/* Kỹ thuật viên */}
          <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14.5px] font-bold text-[#0f1f3d]">Kỹ thuật viên</h3>
              <a href="#all-techs" className="text-[12px] font-medium text-[#1a64d6] hover:underline flex items-center gap-0.5">
                Xem tất cả (12) →
              </a>
            </div>

            <div className="space-y-3">
              {TECHNICIANS.map((tech) => (
                <div key={tech.name} className="flex items-center justify-between text-[12.5px]">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#f1f5fa] text-[#1a64d6] font-bold text-[10.5px] flex items-center justify-center">
                      {tech.name.split(' ').slice(-1)[0][0]}
                    </span>
                    <span className="font-medium text-[#0f1f3d]">{tech.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#55637d]">
                      <span className={`w-2 h-2 rounded-full ${tech.statusColor}`} />
                      <span>{tech.status}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-[#e8f1fe] text-[#1a64d6]">
                      {tech.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Main Appointments Table */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] shadow-[0_1px_3px_rgba(16,42,90,0.04)] overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#eef2f8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-[16px] font-semibold text-[#0f1f3d]">Danh sách lịch hẹn kỹ thuật</h2>
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b99af]" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm khách hàng, thiết bị, địa điểm..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#dfe6f1] bg-[#f8fafd] text-[12.5px] outline-none focus:border-[#1a64d6] focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafd] border-b border-[#eef2f8] text-[11px] font-semibold text-[#5b6780] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Thời gian</th>
                  <th className="py-3 px-3">Khách hàng</th>
                  <th className="py-3 px-3">Thiết bị / Nội dung</th>
                  <th className="py-3 px-3">Địa điểm</th>
                  <th className="py-3 px-3">Kỹ thuật viên</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f8] text-[12px] text-[#27344d]">
                {filteredAppts.map((appt) => (
                  <tr key={appt.id} className="hover:bg-[#f9fbfe] transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap text-[#5b6780] font-medium">
                      {appt.time}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#0f1f3d]">{appt.customer}</div>
                      <div className="text-[10.5px] text-[#8b99af]">MS KH: {appt.customerCode}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#27344d]">{appt.equipment}</div>
                      <div className="text-[11px] text-[#55637d]">{appt.task}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[#44526b]">
                        <MapPin size={13} className="text-[#8b99af]" />
                        <span>{appt.location}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#1a64d6] text-white text-[10px] font-semibold flex items-center justify-center">
                          {appt.technician.initials}
                        </span>
                        <span className="text-[#27344d]">{appt.technician.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">{getStatusBadge(appt.status)}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-[#8b99af]">
                        <button
                          onClick={() => setSelectedAppt(appt)}
                          className="p-1 hover:text-[#1a64d6] rounded hover:bg-[#edf3fc] cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button className="p-1 hover:text-[#0f1f3d] rounded hover:bg-[#f1f5fc] cursor-pointer">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredAppts.length && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[13px] text-[#8b99af]">
                      Không tìm thấy lịch hẹn phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-auto px-5 py-3 border-t border-[#eef2f8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-[#5b6780]">
            <div>Hiển thị 1 - 10 của 28 lịch hẹn</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">‹</button>
                <button className="w-8 h-8 rounded bg-[#1a64d6] text-white font-medium flex items-center justify-center cursor-pointer">1</button>
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">2</button>
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">3</button>
                <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">›</button>
              </div>
              <select className="h-8 rounded border border-[#dfe6f1] bg-white text-[12px] px-2 text-[#44526b] outline-none">
                <option>10 / trang</option>
                <option>20 / trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Tạo lịch hẹn */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/40 backdrop-blur-xs p-4" onClick={() => setIsAddOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f8] pb-3 mb-4">
              <h2 className="text-[18px] font-bold text-[#0f1f3d]">Đặt lịch hẹn kỹ thuật</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8b99af] hover:text-[#0f1f3d] p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Khách hàng</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bệnh viện Đa khoa Tỉnh"
                  value={newCust}
                  onChange={(e) => setNewCust(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Thiết bị</label>
                  <input
                    type="text"
                    required
                    placeholder="Máy xét nghiệm, siêu âm..."
                    value={newEquip}
                    onChange={(e) => setNewEquip(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Nội dung</label>
                  <select
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  >
                    <option value="Lắp đặt và hướng dẫn sử dụng">Lắp đặt và hướng dẫn sử dụng</option>
                    <option value="Bảo trì định kỳ">Bảo trì định kỳ</option>
                    <option value="Sửa chữa, thay linh kiện">Sửa chữa, thay linh kiện</option>
                    <option value="Kiểm tra, hiệu chuẩn">Kiểm tra, hiệu chuẩn</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Kỹ thuật viên</label>
                  <select
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  >
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Trần Thị B">Trần Thị B</option>
                    <option value="Lê Văn C">Lê Văn C</option>
                    <option value="Phạm Minh D">Phạm Minh D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Địa điểm</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Nam Định">Nam Định</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Ninh Bình">Ninh Bình</option>
                    <option value="Thái Bình">Thái Bình</option>
                    <option value="Hưng Yên">Hưng Yên</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Thời gian hẹn</label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eef2f8]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="h-10 px-4 rounded-lg border border-[#dfe6f1] text-[13px] text-[#44526b] hover:bg-[#f8fafd] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13px] font-medium cursor-pointer"
                >
                  Lưu lịch hẹn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chi tiết lịch hẹn */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/40 backdrop-blur-xs p-4" onClick={() => setSelectedAppt(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f8] pb-3 mb-4">
              <div>
                <span className="text-[12px] font-semibold text-[#1a64d6] uppercase tracking-wider">Lịch hẹn</span>
                <h2 className="text-[18px] font-bold text-[#0f1f3d]">{selectedAppt.customer}</h2>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="text-[#8b99af] hover:text-[#0f1f3d] p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between py-1 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Mã khách hàng:</span>
                <span className="font-semibold text-[#0f1f3d]">{selectedAppt.customerCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Thời gian:</span>
                <span className="font-semibold text-[#1a64d6]">{selectedAppt.time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Thiết bị:</span>
                <span className="font-medium text-[#0f1f3d]">{selectedAppt.equipment}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Nội dung công việc:</span>
                <span className="text-[#27344d]">{selectedAppt.task}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Địa điểm:</span>
                <span className="text-[#27344d]">{selectedAppt.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Kỹ thuật viên:</span>
                <span className="font-medium text-[#27344d]">{selectedAppt.technician.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#5b6780]">Trạng thái:</span>
                <span>{getStatusBadge(selectedAppt.status)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-2">
              <button
                onClick={() => setSelectedAppt(null)}
                className="h-10 px-5 rounded-lg bg-[#1a64d6] text-white text-[13px] font-medium cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
