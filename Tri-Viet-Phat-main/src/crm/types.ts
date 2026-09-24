export interface ContractItem {
  id: string;
  code: string;
  customer: string;
  type: 'Bán hàng' | 'Bảo trì' | 'Dịch vụ';
  value: number;
  signedDate: string;
  durationMonths: number;
  expiryDate: string;
  assignedTo: string;
  status: 'Có hiệu lực' | 'Sắp hết hạn' | 'Đã gia hạn' | 'Chờ ký' | 'Hết hạn';
}

export interface ContractAlert {
  code: string;
  customer: string;
  expiryDate: string;
  timeLeft: string;
  isExpired?: boolean;
}

export interface CustomerCareItem {
  id: number;
  customer: string;
  location: string;
  careType: 'Bảo trì nhắc lịch' | 'Gọi lại' | 'Hậu mãi' | 'Khảo sát NPS' | 'Khiếu nại cần xử lý';
  equipment: string;
  assignee: {
    initials: string;
    name: string;
  };
  appointmentDate: string;
  contactChannel: 'Điện thoại' | 'Email' | 'Zalo';
  status: 'Đã hoàn thành' | 'Đang thực hiện' | 'Chờ liên hệ' | 'Đang xử lý';
  rating: number; // 1-5
}

export interface TechnicalAppointment {
  id: string;
  time: string;
  customer: string;
  customerCode: string;
  equipment: string;
  task: string;
  location: string;
  technician: {
    initials: string;
    name: string;
  };
  status: 'Sắp tới' | 'Đã xác nhận' | 'Đang di chuyển' | 'Hoãn lịch' | 'Hoàn thành';
}

export interface RepairTicket {
  code: string;
  customer: string;
  equipment: string;
  serial: string;
  serviceType: 'Sửa chữa' | 'Bảo trì định kỳ' | 'Bảo hành';
  technician: string;
  receivedDate: string;
  priority: 'Khẩn cấp' | 'Cao' | 'Trung bình' | 'Thấp';
  status: 'Đang xử lý' | 'Đang chờ linh kiện' | 'Đã hoàn tất';
  contactPerson?: string;
  contactPhone?: string;
  location?: string;
  issueDescription?: string;
  timeline?: {
    step: string;
    time: string;
    desc: string;
    person?: string;
    status: 'done' | 'current' | 'pending';
  }[];
}
