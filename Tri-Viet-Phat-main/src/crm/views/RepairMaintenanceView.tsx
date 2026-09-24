import React, { useState } from 'react';
import {
  Wrench,
  FileText,
  Settings,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Search,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Building,
  User,
  Cpu,
  Clock,
  Check,
  X
} from 'lucide-react';
import { RepairTicket } from '../types';

const INITIAL_TICKETS: RepairTicket[] = [
  {
    code: 'SCBT-2025-184',
    customer: 'Bệnh viện Đa khoa Nam Định',
    equipment: 'Máy xét nghiệm sinh hóa AU680',
    serial: 'A68V12456',
    serviceType: 'Sửa chữa',
    technician: 'Nguyễn Minh Tuấn',
    receivedDate: '24/09/2025',
    priority: 'Khẩn cấp',
    status: 'Đang xử lý',
    contactPerson: 'BS. Trần Văn Nam',
    contactPhone: '0912.345.678',
    location: 'Khoa Xét nghiệm - Nhà A',
    issueDescription: 'Hệ thống đo quang bị lệch dải bước sóng, cần cân chỉnh lại quang học.',
    timeline: [
      { step: 'Tiếp nhận yêu cầu', time: '24/09/2025 08:15', desc: 'Tiếp nhận thông tin báo lỗi hệ thống quang học', person: 'Nguyễn Minh Tuấn', status: 'done' },
      { step: 'Kiểm tra & Chẩn đoán', time: '24/09/2025 09:30', desc: 'Tiến hành đo kiểm bóng đèn nguồn và kính lọc bước sóng', person: 'Nguyễn Minh Tuấn', status: 'current' },
      { step: 'Báo giá & Phê duyệt', time: 'Dự kiến 24/09/2025', desc: 'Gửi báo giá thay bóng Halogen', status: 'pending' },
      { step: 'Sửa chữa & Bàn giao', time: 'Chờ xử lý', desc: 'Thay bóng và chuẩn định', status: 'pending' },
    ]
  },
  {
    code: 'SCBT-2025-183',
    customer: 'PK Đa khoa An Bình',
    equipment: 'Máy siêu âm DC-70',
    serial: 'DC7024589',
    serviceType: 'Bảo trì định kỳ',
    technician: 'Trần Quốc Huy',
    receivedDate: '24/09/2025',
    priority: 'Trung bình',
    status: 'Đang xử lý',
    contactPerson: 'BS. Lê Thị Mai',
    contactPhone: '0983.123.456',
    location: 'Phòng Chẩn đoán hình ảnh',
    issueDescription: 'Bảo dưỡng định kỳ quý 3, kiểm tra các đầu dò Convex và Linear.',
  },
  {
    code: 'SCBT-2025-182',
    customer: 'TTYT Huyện Giao Thủy',
    equipment: 'Máy huyết học BC-6800',
    serial: 'BC6800241',
    serviceType: 'Sửa chữa',
    technician: 'Lê Văn Cường',
    receivedDate: '23/09/2025',
    priority: 'Cao',
    status: 'Đang chờ linh kiện',
    contactPerson: 'KTV. Hoàng Văn Đức',
    contactPhone: '0977.889.900',
    location: 'Khoa Huyết học',
    issueDescription: 'Bơm van áp suất hút mẫu bị hỏng phớt, chờ linh kiện nhập khẩu.',
  },
  {
    code: 'SCBT-2025-181',
    customer: 'Bệnh viện Sản Nhi Hà Nội',
    equipment: 'Máy xét nghiệm miễn dịch CL-900i',
    serial: 'CL9001789',
    serviceType: 'Bảo hành',
    technician: 'Nguyễn Minh Tuấn',
    receivedDate: '22/09/2025',
    priority: 'Khẩn cấp',
    status: 'Đang xử lý',
    contactPerson: 'BS. Nguyễn Thị Lan',
    contactPhone: '0987.456.789',
    location: 'Khoa Hóa sinh - Tầng 3',
    issueDescription: 'Báo lỗi code E101: Motor trục X bị kẹt, không đưa được khay mẫu vào buồng phản ứng.',
    timeline: [
      { step: 'Tiếp nhận yêu cầu', time: '22/09/2025 09:15', desc: 'Tiếp nhận phiếu từ khách hàng, ghi nhận thông tin sự cố', person: 'Nguyễn Minh Tuấn', status: 'done' },
      { step: 'Kiểm tra & Chẩn đoán', time: '22/09/2025 10:30', desc: 'Kỹ thuật viên kiểm tra, chẩn đoán nguyên nhân lỗi E101', person: 'Nguyễn Minh Tuấn', status: 'current' },
      { step: 'Báo giá & Phê duyệt', time: 'Đang thực hiện', desc: 'Lập báo giá linh kiện/chi phí sửa chữa, chờ khách hàng và đồng phiếu', status: 'pending' },
      { step: 'Sửa chữa & Thay thế', time: 'Chờ xử lý', desc: 'Tiến hành sửa chữa, hiệu chuẩn và kiểm tra thiết bị hoạt động', status: 'pending' },
    ]
  },
  {
    code: 'SCBT-2025-180',
    customer: 'PK Nam Định Medica',
    equipment: 'Máy X-quang DRGEM GXR-SD',
    serial: 'GXRSD5567',
    serviceType: 'Sửa chữa',
    technician: 'Phạm Hoàng Nam',
    receivedDate: '22/09/2025',
    priority: 'Trung bình',
    status: 'Đã hoàn tất',
    contactPerson: 'KTV. Đỗ Văn Bình',
    contactPhone: '0904.556.778',
    location: 'Phòng X-quang',
    issueDescription: 'Đã thay dây cáp kết nối Detector và chụp thử nghiệm thành công.',
  },
  {
    code: 'SCBT-2025-179',
    customer: 'Bệnh viện ĐK Hà Nam',
    equipment: 'Máy sinh hóa Mindray BS-200',
    serial: 'BS2003345',
    serviceType: 'Bảo trì định kỳ',
    technician: 'Trần Quốc Huy',
    receivedDate: '21/09/2025',
    priority: 'Thấp',
    status: 'Đã hoàn tất',
    contactPerson: 'BS. Vũ Thị Hồng',
    contactPhone: '0915.667.889',
    location: 'Phòng Xét nghiệm',
    issueDescription: 'Bảo trì rửa kim hút, kiểm tra nhiệt độ ủ 37 độ C đạt chuẩn.',
  },
  {
    code: 'SCBT-2025-178',
    customer: 'PK Đa khoa Minh Tâm',
    equipment: 'Máy điện tim EDAN SE-1200',
    serial: 'SE1200789',
    serviceType: 'Sửa chữa',
    technician: 'Lê Văn Cường',
    receivedDate: '20/09/2025',
    priority: 'Trung bình',
    status: 'Đã hoàn tất',
    contactPerson: 'BS. Phạm Tuấn',
    contactPhone: '0936.112.233',
    location: 'Phòng Khám tim mạch',
    issueDescription: 'Thay thế cụm con lăn cuốn giấy in nhiệt và vệ sinh thanh nhiệt.',
  },
  {
    code: 'SCBT-2025-177',
    customer: 'Bệnh viện Đa khoa Ninh Bình',
    equipment: 'Máy siêu âm Voluson P8',
    serial: 'VP8A4455',
    serviceType: 'Bảo hành',
    technician: 'Nguyễn Minh Tuấn',
    receivedDate: '19/09/2025',
    priority: 'Cao',
    status: 'Đang xử lý',
    contactPerson: 'BS. Hoàng Yến',
    contactPhone: '0988.990.011',
    location: 'Khoa Sản',
    issueDescription: 'Nhiễu tín hiệu sóng 4D, đang kiểm tra bo mạch xử lý hình ảnh.',
  },
  {
    code: 'SCBT-2025-176',
    customer: 'TTYT Quỳnh Phụ',
    equipment: 'Máy ly tâm Hermle Z206A',
    serial: 'Z206A9987',
    serviceType: 'Bảo trì định kỳ',
    technician: 'Phạm Hoàng Nam',
    receivedDate: '18/09/2025',
    priority: 'Thấp',
    status: 'Đã hoàn tất',
    contactPerson: 'KTV. Ngô Quang',
    contactPhone: '0973.445.566',
    location: 'Phòng Huyết thanh',
    issueDescription: 'Đã tra mỡ bôi trơn trục quay, kiểm tra cân bằng động rotor.',
  },
  {
    code: 'SCBT-2025-175',
    customer: 'PK Đa khoa Việt Đức',
    equipment: 'Máy nội soi Olympus CV-170',
    serial: 'CV1705566',
    serviceType: 'Sửa chữa',
    technician: 'Lê Văn Cường',
    receivedDate: '17/09/2025',
    priority: 'Cao',
    status: 'Đang chờ linh kiện',
    contactPerson: 'BS. Trịnh Thắng',
    contactPhone: '0942.334.455',
    location: 'Phòng Nội soi tiêu hóa',
    issueDescription: 'Bóng đèn Xenon hết tuổi thọ và rò rỉ khí dây soi, đang đặt phụ tùng.',
  },
];

export const RepairMaintenanceView: React.FC = () => {
  const [tickets, setTickets] = useState<RepairTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket>(INITIAL_TICKETS[3]); // SCBT-2025-181
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);

  // Form states
  const [newCode, setNewCode] = useState(`SCBT-2025-${String(tickets.length + 185).padStart(3, '0')}`);
  const [newCustomer, setNewCustomer] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newServiceType, setNewServiceType] = useState<'Sửa chữa' | 'Bảo trì định kỳ' | 'Bảo hành'>('Sửa chữa');
  const [newPriority, setNewPriority] = useState<'Khẩn cấp' | 'Cao' | 'Trung bình' | 'Thấp'>('Trung bình');
  const [newTech, setNewTech] = useState('Nguyễn Minh Tuấn');

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const getServiceTypeBadge = (type: RepairTicket['serviceType']) => {
    switch (type) {
      case 'Sửa chữa':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e8f1fe] text-[#1a64d6]">Sửa chữa</span>;
      case 'Bảo trì định kỳ':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e6f7ee] text-[#16a34a]">Bảo trì định kỳ</span>;
      case 'Bảo hành':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f3e8ff] text-[#9333ea]">Bảo hành</span>;
    }
  };

  const getPriorityBadge = (p: RepairTicket['priority']) => {
    switch (p) {
      case 'Khẩn cấp':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#fdecec] text-[#dc2626]">Khẩn cấp</span>;
      case 'Cao':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#fff6dd] text-[#d97706]">Cao</span>;
      case 'Trung bình':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e8f1fe] text-[#1a64d6]">Trung bình</span>;
      case 'Thấp':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f5fa] text-[#5b6780]">Thấp</span>;
    }
  };

  const getStatusBadge = (s: RepairTicket['status']) => {
    switch (s) {
      case 'Đang xử lý':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fff6dd] text-[#d97706]">Đang xử lý</span>;
      case 'Đang chờ linh kiện':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f3e8ff] text-[#9333ea]">Đang chờ linh kiện</span>;
      case 'Đã hoàn tất':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e6f7ee] text-[#16a34a]">Đã hoàn tất</span>;
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim()) return;

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newTicket: RepairTicket = {
      code: newCode,
      customer: newCustomer.trim(),
      equipment: newEquipment.trim() || 'Thiết bị y tế',
      serial: newSerial.trim() || 'SN-' + Math.floor(100000 + Math.random() * 900000),
      serviceType: newServiceType,
      technician: newTech,
      receivedDate: todayStr,
      priority: newPriority,
      status: 'Đang xử lý',
      contactPerson: 'Cán bộ phụ trách',
      contactPhone: '0904.xxx.xxx',
      location: 'Khoa Phòng kỹ thuật',
      issueDescription: 'Phiếu mới tiếp nhận, chờ kỹ thuật viên kiểm tra chi tiết tại cơ sở.',
      timeline: [
        { step: 'Tiếp nhận yêu cầu', time: `${todayStr} 09:00`, desc: 'Tiếp nhận thông tin phiếu sửa chữa', person: newTech, status: 'done' },
        { step: 'Kiểm tra & Chẩn đoán', time: 'Đang tiến hành', desc: 'Khảo sát thực tế tình trạng thiết bị', person: newTech, status: 'current' },
        { step: 'Báo giá & Phê duyệt', time: 'Chờ xử lý', desc: 'Lập báo giá linh kiện/vật tư', status: 'pending' },
        { step: 'Sửa chữa & Bàn giao', time: 'Chờ xử lý', desc: 'Thay thế, kiểm tra đạt chuẩn', status: 'pending' },
      ]
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicket(newTicket);
    setIsAddTicketOpen(false);
    setNewCustomer('');
    setNewEquipment('');
    setNewSerial('');
    setNewCode(`SCBT-2025-${String(tickets.length + 186).padStart(3, '0')}`);
  };

  return (
    <div className="space-y-4">
      {/* Title & Description */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center">
          <Wrench size={18} />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-[#0f1f3d] leading-tight">Sửa chữa - Bảo trì</h1>
          <p className="mt-0.5 text-[14px] text-[#55637d]">
            Quản lý phiếu yêu cầu sửa chữa, bảo trì định kỳ, bảo hành và các yêu cầu hỗ trợ kỹ thuật cho thiết bị y tế.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-[340px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b99af]" size={15} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo mã phiếu, khách hàng, thiết bị, serial..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#dfe6f1] bg-white text-[13px] outline-none focus:border-[#1a64d6]"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] outline-none cursor-pointer"
            >
              <option value="all">Tất cả danh mục thiết bị</option>
              <option value="xet-nghiem">Máy xét nghiệm</option>
              <option value="sieu-am">Máy siêu âm</option>
              <option value="x-quang">Máy X-quang</option>
              <option value="dien-tim">Máy điện tim</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đang chờ linh kiện">Đang chờ linh kiện</option>
              <option value="Đã hoàn tất">Đã hoàn tất</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] outline-none cursor-pointer"
            >
              <option value="all">Tất cả mức ưu tiên</option>
              <option value="Khẩn cấp">Khẩn cấp</option>
              <option value="Cao">Cao</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Thấp">Thấp</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>
        </div>

        <button
          onClick={() => setIsAddTicketOpen(true)}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13.5px] font-medium transition-colors shadow-[0_4px_12px_-3px_rgba(26,100,214,0.6)] cursor-pointer"
        >
          <Plus size={16} />
          <span>Tạo phiếu sửa chữa</span>
        </button>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* New */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <FileText size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Phiếu mới</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">18</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 20%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* In progress */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Settings size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Đang xử lý</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">32</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 12%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e6f7ee] text-[#16a34a] flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Đã hoàn tất</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">126</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 28%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* Periodic Maintenance */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Calendar size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Bảo trì định kỳ</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">45</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 15%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* SLA */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e6f7ee] text-[#16a34a] flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Đúng hạn SLA</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">96%</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 4%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>
      </div>

      {/* Main Table: Danh sách phiếu sửa chữa / bảo trì */}
      <div className="rounded-xl bg-white border border-[#e6ecf5] shadow-[0_1px_3px_rgba(16,42,90,0.04)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#eef2f8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-[#0f1f3d]">Danh sách phiếu sửa chữa / bảo trì</h2>
          <div className="flex items-center gap-2 text-[12px] text-[#5b6780]">
            <span>Hiển thị 1 - 10 trong 181 phiếu</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd]">‹</button>
              <button className="w-7 h-7 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd]">›</button>
            </div>
            <select className="h-7 rounded border border-[#dfe6f1] bg-white px-2 text-[11.5px] outline-none">
              <option>10 hàng/trang</option>
              <option>20 hàng/trang</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafd] border-b border-[#eef2f8] text-[11px] font-semibold text-[#5b6780] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#dfe6f1] text-[#1a64d6]" />
                </th>
                <th className="py-3 px-3">Mã phiếu</th>
                <th className="py-3 px-3">Khách hàng</th>
                <th className="py-3 px-3">Thiết bị</th>
                <th className="py-3 px-3">Serial</th>
                <th className="py-3 px-3">Loại dịch vụ</th>
                <th className="py-3 px-3">Kỹ thuật viên</th>
                <th className="py-3 px-3">Ngày tiếp nhận</th>
                <th className="py-3 px-3">Mức ưu tiên</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-3 text-center">...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2f8] text-[12px] text-[#27344d]">
              {filteredTickets.map((t) => {
                const isSelected = selectedTicket?.code === t.code;
                return (
                  <tr
                    key={t.code}
                    onClick={() => setSelectedTicket(t)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#edf4fe] hover:bg-[#e6effe]' : 'hover:bg-[#f9fbfe]'
                    }`}
                  >
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => setSelectedTicket(t)}
                        className="w-3.5 h-3.5 rounded border-[#dfe6f1] text-[#1a64d6]"
                      />
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1a64d6] hover:underline whitespace-nowrap">
                      {t.code}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#0f1f3d] whitespace-nowrap">{t.customer}</td>
                    <td className="py-3 px-3 whitespace-nowrap max-w-[180px] truncate" title={t.equipment}>
                      {t.equipment}
                    </td>
                    <td className="py-3 px-3 text-[#5b6780] font-mono text-[11px] whitespace-nowrap">{t.serial}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{getServiceTypeBadge(t.serviceType)}</td>
                    <td className="py-3 px-3 whitespace-nowrap text-[#44526b]">{t.technician}</td>
                    <td className="py-3 px-3 whitespace-nowrap text-[#5b6780]">{t.receivedDate}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{getPriorityBadge(t.priority)}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{getStatusBadge(t.status)}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 hover:text-[#0f1f3d] text-[#8b99af] rounded hover:bg-[#f1f5fc]">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!filteredTickets.length && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-[13px] text-[#8b99af]">
                    Không có phiếu sửa chữa nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Detail Section: Split into 2 Cards */}
      {selectedTicket && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
          {/* Thông tin phiếu sửa chữa */}
          <div className="rounded-xl bg-white border border-[#e6ecf5] p-5 shadow-[0_1px_3px_rgba(16,42,90,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eef2f8]">
              <div className="flex items-center gap-2 text-[#0f1f3d]">
                <FileText size={18} className="text-[#1a64d6]" />
                <h3 className="text-[15px] font-bold">Thông tin phiếu sửa chữa</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12.5px]">
              <div>
                <span className="block text-[11px] text-[#8b99af]">Mã phiếu</span>
                <span className="font-bold text-[#1a64d6] text-[14px]">{selectedTicket.code}</span>
                <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
              </div>
              <div>
                <span className="block text-[11px] text-[#8b99af]">Ngày tiếp nhận</span>
                <span className="font-medium text-[#27344d]">{selectedTicket.receivedDate} 09:15</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#8b99af]">Mức ưu tiên</span>
                <div className="mt-0.5">{getPriorityBadge(selectedTicket.priority)}</div>
              </div>
              <div>
                <span className="block text-[11px] text-[#8b99af]">Loại dịch vụ</span>
                <div className="mt-0.5">{getServiceTypeBadge(selectedTicket.serviceType)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#f1f5fa] text-[12.5px]">
              <div>
                <span className="flex items-center gap-1.5 text-[11px] text-[#8b99af] mb-0.5">
                  <Building size={13} />
                  Khách hàng
                </span>
                <span className="font-semibold text-[#0f1f3d]">{selectedTicket.customer}</span>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-[11px] text-[#8b99af] mb-0.5">
                  <User size={13} />
                  Người liên hệ
                </span>
                <div className="font-medium text-[#27344d]">{selectedTicket.contactPerson || 'BS. Nguyễn Thị Lan'}</div>
                <div className="text-[11px] text-[#55637d]">{selectedTicket.contactPhone || '0987.456.789'}</div>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-[11px] text-[#8b99af] mb-0.5">
                  <Cpu size={13} />
                  Thiết bị
                </span>
                <div className="font-semibold text-[#0f1f3d]">{selectedTicket.equipment}</div>
                <div className="text-[11px] text-[#55637d]">Serial: {selectedTicket.serial}</div>
              </div>
            </div>

            {selectedTicket.issueDescription && (
              <div className="pt-2 text-[12.5px] bg-[#f8fafd] p-3 rounded-lg border border-[#eef2f8]">
                <span className="text-[11.5px] font-semibold text-[#5b6780] block mb-1">Mô tả sự cố & yêu cầu kỹ thuật:</span>
                <span className="text-[#27344d]">{selectedTicket.issueDescription}</span>
              </div>
            )}
          </div>

          {/* Tiến trình xử lý */}
          <div className="rounded-xl bg-white border border-[#e6ecf5] p-5 shadow-[0_1px_3px_rgba(16,42,90,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#eef2f8] mb-4">
                <div className="flex items-center gap-2 text-[#0f1f3d]">
                  <Clock size={18} className="text-[#1a64d6]" />
                  <h3 className="text-[15px] font-bold">Tiến trình xử lý</h3>
                </div>
                <a href="#timeline" className="text-[12px] font-medium text-[#1a64d6] hover:underline flex items-center gap-0.5">
                  Xem chi tiết →
                </a>
              </div>

              {/* Stepper timeline */}
              <div className="space-y-4">
                {/* Step 1: Done */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 z-10">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-[#e2e8f0] -mb-4" />
                  <div className="flex-1 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0f1f3d]">Tiếp nhận yêu cầu</span>
                      <span className="text-[11px] text-[#8b99af]">22/09/2025 09:15</span>
                    </div>
                    <div className="text-[#55637d] text-[11.5px]">Tiếp nhận phiếu từ khách hàng, ghi nhận thông tin sự cố</div>
                    <div className="text-[10.5px] text-[#8b99af] mt-0.5">KTV: Nguyễn Minh Tuấn</div>
                  </div>
                </div>

                {/* Step 2: Current */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full border-2 border-[#1a64d6] bg-white flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-[#1a64d6]" />
                  </div>
                  <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-[#e2e8f0] -mb-4" />
                  <div className="flex-1 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1a64d6]">Kiểm tra & Chẩn đoán</span>
                      <span className="text-[11px] text-[#8b99af]">22/09/2025 10:30</span>
                    </div>
                    <div className="text-[#55637d] text-[11.5px]">Kỹ thuật viên kiểm tra, chẩn đoán nguyên nhân lỗi E101</div>
                    <div className="text-[10.5px] text-[#8b99af] mt-0.5">KTV: Nguyễn Minh Tuấn</div>
                  </div>
                </div>

                {/* Step 3: In progress / Pending */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-5 h-5 rounded-full border-2 border-[#cbd5e1] bg-white flex items-center justify-center shrink-0 z-10" />
                  <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-[#e2e8f0] -mb-4" />
                  <div className="flex-1 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#475569]">Báo giá & Phê duyệt</span>
                      <span className="text-[10.5px] text-[#d97706] font-medium bg-[#fff6dd] px-1.5 py-0.5 rounded">Đang thực hiện</span>
                    </div>
                    <div className="text-[#8b99af] text-[11.5px]">Lập báo giá linh kiện/chi phí sửa chữa, chờ khách hàng và đồng phiếu</div>
                  </div>
                </div>

                {/* Step 4: Pending */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#cbd5e1] bg-white flex items-center justify-center shrink-0 z-10" />
                  <div className="flex-1 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#8b99af]">Sửa chữa & Thay thế</span>
                      <span className="text-[10.5px] text-[#8b99af]">Chờ xử lý</span>
                    </div>
                    <div className="text-[#8b99af] text-[11.5px]">Tiến hành sửa chữa, hiệu chuẩn và kiểm tra thiết bị hoạt động</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tạo phiếu sửa chữa */}
      {isAddTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/40 backdrop-blur-xs p-4" onClick={() => setIsAddTicketOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f8] pb-3 mb-4">
              <h2 className="text-[18px] font-bold text-[#0f1f3d]">Tạo phiếu sửa chữa / bảo trì mới</h2>
              <button onClick={() => setIsAddTicketOpen(false)} className="text-[#8b99af] hover:text-[#0f1f3d] p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Mã phiếu</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Loại dịch vụ</label>
                  <select
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  >
                    <option value="Sửa chữa">Sửa chữa</option>
                    <option value="Bảo trì định kỳ">Bảo trì định kỳ</option>
                    <option value="Bảo hành">Bảo hành</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Tên khách hàng / Cơ sở y tế</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bệnh viện Đa khoa Quốc tế"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Tên thiết bị</label>
                  <input
                    type="text"
                    required
                    placeholder="Máy xét nghiệm, siêu âm..."
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Số Serial máy</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: AU680-1289"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Mức ưu tiên</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  >
                    <option value="Khẩn cấp">Khẩn cấp</option>
                    <option value="Cao">Cao</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thấp">Thấp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Kỹ thuật viên phụ trách</label>
                  <select
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  >
                    <option value="Nguyễn Minh Tuấn">Nguyễn Minh Tuấn</option>
                    <option value="Trần Quốc Huy">Trần Quốc Huy</option>
                    <option value="Lê Văn Cường">Lê Văn Cường</option>
                    <option value="Phạm Hoàng Nam">Phạm Hoàng Nam</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eef2f8]">
                <button
                  type="button"
                  onClick={() => setIsAddTicketOpen(false)}
                  className="h-10 px-4 rounded-lg border border-[#dfe6f1] text-[13px] text-[#44526b] hover:bg-[#f8fafd] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13px] font-medium cursor-pointer"
                >
                  Tạo phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
