import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  RefreshCw,
  Coins,
  Search,
  ChevronDown,
  Plus,
  Download,
  Eye,
  MoreHorizontal,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import { ContractItem, ContractAlert } from '../types';

const INITIAL_CONTRACTS: ContractItem[] = [
  { id: '1', code: 'HD-2025-089', customer: 'Bệnh viện Đa khoa Nam Định', type: 'Bán hàng', value: 1250000000, signedDate: '20/09/2025', durationMonths: 24, expiryDate: '19/09/2027', assignedTo: 'Nguyễn Văn A', status: 'Có hiệu lực' },
  { id: '2', code: 'HD-2025-088', customer: 'PK Đa khoa An Bình', type: 'Bảo trì', value: 120000000, signedDate: '18/09/2025', durationMonths: 12, expiryDate: '17/09/2026', assignedTo: 'Trần Thị B', status: 'Sắp hết hạn' },
  { id: '3', code: 'HD-2025-087', customer: 'TTYT Huyện Giao Thủy', type: 'Bán hàng', value: 850000000, signedDate: '15/09/2025', durationMonths: 36, expiryDate: '14/09/2028', assignedTo: 'Lê Minh C', status: 'Có hiệu lực' },
  { id: '4', code: 'HD-2025-086', customer: 'Bệnh viện Sản Nhi Hà Nội', type: 'Dịch vụ', value: 320000000, signedDate: '10/09/2025', durationMonths: 12, expiryDate: '09/09/2026', assignedTo: 'Nguyễn Văn A', status: 'Đã gia hạn' },
  { id: '5', code: 'HD-2025-085', customer: 'PK Nam Định Medic', type: 'Bảo trì', value: 95000000, signedDate: '05/09/2025', durationMonths: 12, expiryDate: '04/09/2026', assignedTo: 'Phạm Thị D', status: 'Có hiệu lực' },
  { id: '6', code: 'HD-2025-084', customer: 'Bệnh viện Đa khoa Ninh Bình', type: 'Bán hàng', value: 2480000000, signedDate: '28/08/2025', durationMonths: 24, expiryDate: '27/08/2027', assignedTo: 'Nguyễn Văn A', status: 'Chờ ký' },
  { id: '7', code: 'HD-2025-083', customer: 'TTYT TP. Nam Định', type: 'Bảo trì', value: 180000000, signedDate: '25/08/2025', durationMonths: 12, expiryDate: '24/08/2026', assignedTo: 'Trần Thị B', status: 'Hết hạn' },
  { id: '8', code: 'HD-2025-082', customer: 'PK An Minh', type: 'Dịch vụ', value: 75000000, signedDate: '18/08/2025', durationMonths: 12, expiryDate: '17/08/2026', assignedTo: 'Lê Minh C', status: 'Sắp hết hạn' },
  { id: '9', code: 'HD-2025-081', customer: 'Bệnh viện Y học cổ truyền', type: 'Bán hàng', value: 1650000000, signedDate: '10/08/2025', durationMonths: 36, expiryDate: '09/08/2028', assignedTo: 'Phạm Thị D', status: 'Có hiệu lực' },
  { id: '10', code: 'HD-2025-080', customer: 'PK Thiện Nhân', type: 'Bảo trì', value: 150000000, signedDate: '01/08/2025', durationMonths: 12, expiryDate: '31/07/2026', assignedTo: 'Nguyễn Văn A', status: 'Đã gia hạn' },
];

const ALERTS: ContractAlert[] = [
  { code: 'HD-2025-088', customer: 'PK Đa khoa An Bình', timeLeft: 'Còn 15 ngày', expiryDate: '17/09/2026' },
  { code: 'HD-2025-082', customer: 'PK An Minh', timeLeft: 'Còn 28 ngày', expiryDate: '17/08/2026' },
  { code: 'HD-2025-085', customer: 'PK Nam Định Medic', timeLeft: 'Còn 32 ngày', expiryDate: '04/09/2026' },
  { code: 'HD-2025-083', customer: 'TTYT TP. Nam Định', timeLeft: 'Đã hết hạn', expiryDate: '24/08/2026', isExpired: true },
  { code: 'HD-2025-084', customer: 'Bệnh viện Đa khoa Ninh Bình', timeLeft: 'Còn 45 ngày', expiryDate: '27/08/2027' },
];

const MONTHLY_CHART = [
  { month: 'Tháng 4', count: 18, value: 1100 },
  { month: 'Tháng 5', count: 24, value: 1250 },
  { month: 'Tháng 6', count: 32, value: 1550 },
  { month: 'Tháng 7', count: 38, value: 1800 },
  { month: 'Tháng 8', count: 42, value: 2050 },
  { month: 'Tháng 9', count: 48, value: 2450 },
];

export const ContractsView: React.FC = () => {
  const [contracts, setContracts] = useState<ContractItem[]>(INITIAL_CONTRACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);

  // Form state
  const [newCode, setNewCode] = useState(`HD-2025-${String(contracts.length + 90).padStart(3, '0')}`);
  const [newCustomer, setNewCustomer] = useState('');
  const [newType, setNewType] = useState<'Bán hàng' | 'Bảo trì' | 'Dịch vụ'>('Bán hàng');
  const [newValue, setNewValue] = useState('500000000');
  const [newDuration, setNewDuration] = useState('12');

  const filteredContracts = contracts.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim()) return;

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const expYear = today.getFullYear() + Math.floor(parseInt(newDuration) / 12);
    const expStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${expYear}`;

    const newContract: ContractItem = {
      id: String(Date.now()),
      code: newCode,
      customer: newCustomer.trim(),
      type: newType,
      value: parseInt(newValue) || 0,
      signedDate: todayStr,
      durationMonths: parseInt(newDuration) || 12,
      expiryDate: expStr,
      assignedTo: 'Nguyễn Văn A',
      status: 'Có hiệu lực',
    };

    setContracts([newContract, ...contracts]);
    setIsCreateOpen(false);
    setNewCustomer('');
    setNewCode(`HD-2025-${String(contracts.length + 91).padStart(3, '0')}`);
  };

  const getStatusBadge = (status: ContractItem['status']) => {
    switch (status) {
      case 'Có hiệu lực':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f7ee] text-[#16a34a]">Có hiệu lực</span>;
      case 'Sắp hết hạn':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fff6dd] text-[#d97706]">Sắp hết hạn</span>;
      case 'Đã gia hạn':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f3e8ff] text-[#9333ea]">Đã gia hạn</span>;
      case 'Chờ ký':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e8f1fe] text-[#1a64d6]">Chờ ký</span>;
      case 'Hết hạn':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fdecec] text-[#dc2626]">Hết hạn</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Description */}
      <div>
        <h1 className="text-[26px] font-bold text-[#0f1f3d] leading-tight">Hợp đồng</h1>
        <p className="mt-1 text-[14px] text-[#55637d]">
          Quản lý hợp đồng bán hàng, hợp đồng bảo trì, thỏa thuận dịch vụ và gia hạn hợp đồng thiết bị y tế
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-[340px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b99af]" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm hợp đồng, khách hàng..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#dfe6f1] bg-white text-[13px] placeholder:text-[#8b99af] outline-none focus:border-[#1a64d6]"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] cursor-pointer outline-none focus:border-[#1a64d6]"
            >
              <option value="all">Tất cả loại hợp đồng</option>
              <option value="Bán hàng">Bán hàng</option>
              <option value="Bảo trì">Bảo trì</option>
              <option value="Dịch vụ">Dịch vụ</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none h-10 pl-3 pr-8 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] cursor-pointer outline-none focus:border-[#1a64d6]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Có hiệu lực">Có hiệu lực</option>
              <option value="Sắp hết hạn">Sắp hết hạn</option>
              <option value="Đã gia hạn">Đã gia hạn</option>
              <option value="Chờ ký">Chờ ký</option>
              <option value="Hết hạn">Hết hạn</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b99af] pointer-events-none" size={14} />
          </div>

          {/* Date Picker Button */}
          <button className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border border-[#dfe6f1] bg-white text-[13px] text-[#27344d] cursor-pointer hover:bg-[#f8fafd]">
            <Calendar size={15} className="text-[#8b99af]" />
            <span>01/09/2024 - 30/09/2025</span>
            <ChevronDown size={14} className="text-[#8b99af]" />
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13.5px] font-medium transition-colors shadow-[0_4px_12px_-3px_rgba(26,100,214,0.6)] cursor-pointer"
        >
          <Plus size={16} />
          <span>Tạo hợp đồng</span>
        </button>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <FileText size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Tổng hợp đồng</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">156</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 12%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">so với tháng trước</div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e6f7ee] text-[#16a34a] flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Còn hiệu lực</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">98</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 8%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">62.8% tổng hợp đồng</div>
          </div>
        </div>

        {/* Expiring soon */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#fff6dd] text-[#d97706] flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Sắp hết hạn</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">24</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 20%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">15.4% tổng hợp đồng</div>
          </div>
        </div>

        {/* Renewed */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center shrink-0">
            <RefreshCw size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Đã gia hạn</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[22px] font-bold text-[#0f1f3d]">18</span>
              <span className="text-[11.5px] font-medium text-[#16a34a]">↑ 28%</span>
            </div>
            <div className="text-[11px] text-[#8b99af] truncate">11.5% tổng hợp đồng</div>
          </div>
        </div>

        {/* Total Value */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
          <div className="w-12 h-12 rounded-xl bg-[#e8f1fe] text-[#1a64d6] flex items-center justify-center shrink-0">
            <Coins size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[#5b6780]">Tổng giá trị hợp đồng</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[17px] font-bold text-[#0f1f3d] truncate">12.650.000.000 đ</span>
            </div>
            <div className="text-[11px] text-[#16a34a] font-medium truncate">↑ 18% so với tháng trước</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Contracts Table (Left ~72%) + Widgets (Right ~28%) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        {/* Table Card */}
        <div className="rounded-xl bg-white border border-[#e6ecf5] shadow-[0_1px_3px_rgba(16,42,90,0.04)] overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#eef2f8] flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#0f1f3d]">Danh sách hợp đồng</h2>
            <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[#dfe6f1] text-[12.5px] text-[#44526b] hover:bg-[#f8fafd] cursor-pointer">
              <Download size={14} />
              <span>Xuất file</span>
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafd] border-b border-[#eef2f8] text-[11.5px] font-semibold text-[#5b6780] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-8">#</th>
                  <th className="py-3 px-3">Số hợp đồng</th>
                  <th className="py-3 px-3">Khách hàng</th>
                  <th className="py-3 px-3">Loại hợp đồng</th>
                  <th className="py-3 px-3">Giá trị (VNĐ)</th>
                  <th className="py-3 px-3">Ngày ký</th>
                  <th className="py-3 px-3">Hiệu lực</th>
                  <th className="py-3 px-3">Ngày hết hạn</th>
                  <th className="py-3 px-3">Phụ trách</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f8] text-[12.5px] text-[#27344d]">
                {filteredContracts.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#f9fbfe] transition-colors">
                    <td className="py-3 px-3 text-[#8b99af]">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-[#1a64d6] hover:underline cursor-pointer" onClick={() => setSelectedContract(item)}>
                      {item.code}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#0f1f3d]">{item.customer}</td>
                    <td className="py-3 px-3 text-[#44526b]">{item.type}</td>
                    <td className="py-3 px-3 font-medium">{item.value.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-3 text-[#5b6780]">{item.signedDate}</td>
                    <td className="py-3 px-3 text-[#5b6780]">{item.durationMonths} tháng</td>
                    <td className="py-3 px-3 text-[#5b6780]">{item.expiryDate}</td>
                    <td className="py-3 px-3 text-[#44526b]">{item.assignedTo}</td>
                    <td className="py-3 px-3">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1.5 text-[#8b99af]">
                        <button
                          onClick={() => setSelectedContract(item)}
                          className="p-1 hover:text-[#1a64d6] rounded hover:bg-[#edf3fc] cursor-pointer"
                          title="Xem chi tiết"
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
                {!filteredContracts.length && (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-[13px] text-[#8b99af]">
                      Không tìm thấy hợp đồng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-auto px-5 py-3 border-t border-[#eef2f8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-[#5b6780]">
            <div>Hiển thị 1 - 10 của 156 hợp đồng</div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer disabled:opacity-50">‹</button>
              <button className="w-8 h-8 rounded bg-[#1a64d6] text-white font-medium flex items-center justify-center cursor-pointer">1</button>
              <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">2</button>
              <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">3</button>
              <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">4</button>
              <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">5</button>
              <span className="px-1 text-[#8b99af]">...</span>
              <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">16</button>
              <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">›</button>
              <button className="w-8 h-8 rounded border border-[#dfe6f1] flex items-center justify-center hover:bg-[#f8fafd] cursor-pointer">»</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-4">
          {/* Cảnh báo gia hạn hợp đồng */}
          <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[14.5px] font-bold text-[#0f1f3d]">Cảnh báo gia hạn hợp đồng</h3>
              <a href="#all-expiring" className="text-[12px] font-medium text-[#1a64d6] hover:underline flex items-center gap-0.5">
                Xem tất cả →
              </a>
            </div>

            <div className="space-y-3">
              {ALERTS.map((alert) => (
                <div key={alert.code} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#f9fbfe] transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${alert.isExpired ? 'bg-[#fdecec] text-[#dc2626]' : 'bg-[#fff6dd] text-[#d97706]'}`}>
                    {alert.isExpired ? <AlertCircle size={17} /> : <Clock size={17} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[13px] font-bold text-[#0f1f3d]">{alert.code}</span>
                      <span className={`text-[11.5px] font-semibold ${alert.isExpired ? 'text-[#dc2626]' : 'text-[#d97706]'}`}>
                        {alert.timeLeft}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#55637d] truncate">{alert.customer}</div>
                    <div className="text-[11px] text-[#8b99af] mt-0.5">{alert.expiryDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Giá trị hợp đồng theo tháng */}
          <div className="rounded-xl bg-white border border-[#e6ecf5] p-4 shadow-[0_1px_3px_rgba(16,42,90,0.04)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14.5px] font-bold text-[#0f1f3d]">Giá trị hợp đồng theo tháng</h3>
              <select className="text-[11.5px] bg-[#f8fafd] border border-[#dfe6f1] rounded px-2 py-0.5 text-[#27344d] outline-none">
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#5b6780] mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a64d6]" />
                Giá trị hợp đồng (triệu đồng)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#93c5fd]" />
                Số hợp đồng
              </span>
            </div>

            {/* SVG Combo Chart */}
            <div className="w-full h-44">
              <svg viewBox="0 0 320 160" className="w-full h-full overflow-visible">
                {/* Horizontal gridlines */}
                {[0, 40, 80, 120].map((y, i) => (
                  <g key={i}>
                    <line x1="30" y1={y + 10} x2="300" y2={y + 10} stroke="#edf2f9" strokeDasharray="3 3" />
                    <text x="24" y={y + 14} fontSize="9" fill="#8b99af" textAnchor="end">
                      {(3 - i) * 800 + 100}
                    </text>
                  </g>
                ))}

                {/* Bars & Points */}
                {MONTHLY_CHART.map((d, i) => {
                  const x = 50 + i * 44;
                  const barH = (d.count / 50) * 85;
                  const lineY = 130 - (d.value / 2500) * 115;
                  return (
                    <g key={d.month}>
                      {/* Bar */}
                      <rect x={x - 8} y={130 - barH} width="16" height={barH} rx="2" fill="#93c5fd" opacity="0.85" />
                      {/* Month Label */}
                      <text x={x} y="146" fontSize="9.5" fill="#5b6780" textAnchor="middle">
                        {d.month.replace('Tháng ', 'T')}
                      </text>
                    </g>
                  );
                })}

                {/* Connecting Line */}
                <path
                  d={MONTHLY_CHART.map((d, i) => {
                    const x = 50 + i * 44;
                    const y = 130 - (d.value / 2500) * 115;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#1a64d6"
                  strokeWidth="2.5"
                />

                {/* Dots on Line */}
                {MONTHLY_CHART.map((d, i) => {
                  const x = 50 + i * 44;
                  const y = 130 - (d.value / 2500) * 115;
                  return (
                    <circle key={`dot-${i}`} cx={x} cy={y} r="3.5" fill="#1a64d6" stroke="#ffffff" strokeWidth="1.5">
                      <title>{`${d.month}: ${d.value} triệu`}</title>
                    </circle>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Tạo hợp đồng */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/40 backdrop-blur-xs p-4" onClick={() => setIsCreateOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f8] pb-3 mb-4">
              <h2 className="text-[18px] font-bold text-[#0f1f3d]">Tạo hợp đồng mới</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-[#8b99af] hover:text-[#0f1f3d] p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Số hợp đồng</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Tên khách hàng / Đơn vị</label>
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
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Loại hợp đồng</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  >
                    <option value="Bán hàng">Bán hàng</option>
                    <option value="Bảo trì">Bảo trì</option>
                    <option value="Dịch vụ">Dịch vụ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Thời hạn (tháng)</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                  >
                    <option value="12">12 tháng</option>
                    <option value="24">24 tháng</option>
                    <option value="36">36 tháng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#27344d] mb-1">Giá trị hợp đồng (VNĐ)</label>
                <input
                  type="number"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#dfe6f1] text-[13px] outline-none focus:border-[#1a64d6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eef2f8]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-10 px-4 rounded-lg border border-[#dfe6f1] text-[13px] text-[#44526b] hover:bg-[#f8fafd] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#1a64d6] hover:bg-[#1557bd] text-white text-[13px] font-medium cursor-pointer"
                >
                  Lưu hợp đồng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xem chi tiết */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/40 backdrop-blur-xs p-4" onClick={() => setSelectedContract(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#eef2f8] pb-3 mb-4">
              <div>
                <span className="text-[12px] font-semibold text-[#1a64d6] uppercase tracking-wider">Hợp đồng</span>
                <h2 className="text-[20px] font-bold text-[#0f1f3d]">{selectedContract.code}</h2>
              </div>
              <button onClick={() => setSelectedContract(null)} className="text-[#8b99af] hover:text-[#0f1f3d] p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between py-1.5 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Khách hàng:</span>
                <span className="font-semibold text-[#0f1f3d]">{selectedContract.customer}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Loại hợp đồng:</span>
                <span className="font-medium text-[#27344d]">{selectedContract.type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Giá trị:</span>
                <span className="font-bold text-[#1a64d6]">{selectedContract.value.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Ngày ký:</span>
                <span className="text-[#27344d]">{selectedContract.signedDate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Thời hạn hiệu lực:</span>
                <span className="text-[#27344d]">{selectedContract.durationMonths} tháng (hết hạn: {selectedContract.expiryDate})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f1f5fa]">
                <span className="text-[#5b6780]">Phụ trách:</span>
                <span className="text-[#27344d]">{selectedContract.assignedTo}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#5b6780]">Trạng thái:</span>
                <span>{getStatusBadge(selectedContract.status)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-2">
              <button
                onClick={() => setSelectedContract(null)}
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
