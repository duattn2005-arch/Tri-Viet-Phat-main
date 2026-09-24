import { Product, Partner, DocumentItem, JobOpening, Testimonial } from '../types';
import { fromFolder, renderRich } from '../content/load';
import company from '../content/settings/company.json';
import about from '../content/settings/about.json';
import partners from '../content/settings/partners.json';
import testimonials from '../content/settings/testimonials.json';

// Editable in the CMS (/admin): company info, business areas, partners, testimonials, products.
export const COMPANY_INFO = company;

export const CORE_VALUES = [
  {
    title: 'Chất lượng',
    desc: 'Tạo uy tín về dịch vụ thiết bị y tế và vật tư tiêu hao cam kết tốt nhất.',
    icon: 'verified',
    color: 'bg-secondary',
  },
  {
    title: 'Uy tín',
    desc: 'Với 16 năm xây dựng và phát triển về thiết bị y tế và vật tư tiêu hao trên toàn quốc.',
    icon: 'workspace_premium',
    color: 'bg-[#001d31]',
  },
  {
    title: 'Hợp tác',
    desc: 'Trí Việt Phát số 1 về máy móc thiết bị y tế và vật tư tiêu hao ngành y.',
    icon: 'handshake',
    color: 'bg-secondary',
  },
];

export const BUSINESS_AREAS: { title: string; desc: string }[] = about.businessAreas;

// Keep in sync with the "category" options in public/admin/config.yml
export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  'may-xet-nghiem-sinh-hoa': 'Máy xét nghiệm sinh hóa',
  'may-xet-nghiem-nuoc-tieu': 'Máy xét nghiệm nước tiểu',
  'may-xet-nghiem-huyet-hoc': 'Máy xét nghiệm huyết học',
  'may-xet-nghiem-dien-giai': 'Máy xét nghiệm điện giải',
  'may-xet-nghiem-mien-dich': 'Máy xét nghiệm miễn dịch',
  'may-phan-tich-dong-mau': 'Máy xét nghiệm đông máu',
  'may-xet-nghiem-hba1c': 'Máy xét nghiệm HbA1c Quo-Test',
  'hoa-chat-xet-nghiem': 'Hóa chất, thuốc thử xét nghiệm',
  'thiet-bi-khac': 'Thiết bị y tế khác',
};

type ProductEntry = Omit<Product, 'id' | 'categoryLabel' | 'alt'> & { order?: number; categoryLabel?: string; alt?: string };

export const PRODUCTS: Product[] = fromFolder(
  import.meta.glob<ProductEntry>('../content/products/*.json', { eager: true, import: 'default' })
).map((p) => ({
  ...p,
  categoryLabel: PRODUCT_CATEGORY_LABELS[p.category] ?? p.categoryLabel ?? '',
  alt: p.alt || p.name,
  specs: p.specs ?? [],
  features: p.features ?? [],
  certifications: p.certifications ?? [],
  detailHtml: p.detailHtml ? renderRich(p.detailHtml) : undefined,
}));

export const PARTNERS: Partner[] = partners.partners;

// TestimonialsCarousel ẩn mọi item còn isPlaceholder: true (dữ liệu mẫu).
export const TESTIMONIALS: Testimonial[] = (testimonials.testimonials as Partial<Testimonial>[]).map((t, idx) => ({
  ...t,
  id: t.id || `kh-${idx + 1}`,
  kpi: t.kpi?.label ? t.kpi : undefined,
  avatarInitials:
    t.avatarInitials ||
    (t.name || '')
      .split(/\s+/)
      .slice(-2)
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
})) as Testimonial[];

export const DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Catalog Tổng Hợp Thiết Bị Xét Nghiệm & Hóa Chất Trí Việt Phát 2025',
    code: 'CAT-TVP-2025-VN',
    type: 'catalog',
    category: 'Catalog sản phẩm',
    fileSize: '14.8 MB',
    updateDate: '15/01/2025',
    description: 'Bản in màu điện tử chi tiết toàn bộ máy xét nghiệm sinh hóa, huyết học, nước tiểu, miễn dịch và hóa chất chẩn đoán.'
  },
  {
    id: 'doc-2',
    title: 'Chứng nhận Hệ thống Quản lý Chất lượng ISO 13485:2016',
    code: 'ISO-13485-TVP',
    type: 'certificate',
    category: 'Chứng nhận chất lượng',
    fileSize: '2.4 MB',
    updateDate: '10/12/2024',
    description: 'Giấy chứng nhận đạt chuẩn quốc tế ISO 13485 cho lĩnh vực kinh doanh, phân phối và bảo trì trang thiết bị y tế.'
  },
  {
    id: 'doc-3',
    title: 'Hướng dẫn sử dụng & Bảo dưỡng định kỳ Máy xét nghiệm AC9803',
    code: 'UM-AC9803-VIE',
    type: 'manual',
    category: 'Hướng dẫn sử dụng',
    fileSize: '5.2 MB',
    updateDate: '05/11/2024',
    description: 'Tài liệu hướng dẫn vận hành, quy trình rửa điện cực tự động và khắc phục sự cố thường gặp cho kỹ thuật viên phòng xét nghiệm.'
  },
  {
    id: 'doc-4',
    title: 'Bảng dữ liệu an toàn vật liệu (MSDS) Hóa chất huyết học Dewei',
    code: 'MSDS-DEWEI-HEM',
    type: 'specification',
    category: 'Dữ liệu kỹ thuật & An toàn',
    fileSize: '3.1 MB',
    updateDate: '20/10/2024',
    description: 'Báo cáo độc tính, hướng dẫn xử lý tràn đổ và bảo quản an toàn sinh học theo chuẩn quốc tế GHS.'
  },
  {
    id: 'doc-5',
    title: 'Hồ sơ năng lực Công ty TNHH Thiết bị Y tế Trí Việt Phát',
    code: 'PROFILE-TVP-2025',
    type: 'catalog',
    category: 'Hồ sơ doanh nghiệp',
    fileSize: '8.6 MB',
    updateDate: '01/01/2025',
    description: 'Giới thiệu 16 năm kinh nghiệm, mạng lưới 34 tỉnh thành, năng lực nhân sự kỹ sư y sinh và danh sách dự án tiêu biểu.'
  }
];

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Kỹ sư Y sinh - Chuyên viên Lắp đặt & Bảo trì Thiết bị xét nghiệm',
    department: 'Phòng Kỹ thuật Dịch vụ',
    location: 'Hà Nội & các tỉnh lân cận',
    type: 'Toàn thời gian cố định',
    salary: '15.000.000 - 25.000.000 VNĐ + Thưởng dự án',
    deadline: '28/02/2025',
    experience: 'Từ 1 - 3 năm kinh nghiệm trong ngành thiết bị y tế',
    description: 'Chịu trách nhiệm bàn giao, lắp đặt, hướng dẫn vận hành và thực hiện bảo dưỡng định kỳ các hệ thống máy xét nghiệm sinh hóa, huyết học, nước tiểu cho bệnh viện và phòng khám đối tác.',
    requirements: [
      'Tốt nghiệp Đại học/Cao đẳng chuyên ngành Điện tử Y sinh, Thiết bị Y tế, Tự động hóa hoặc liên quan',
      'Hiểu biết cơ bản về cơ điện tử, mạch quang học và hệ thống thủy lực trong máy xét nghiệm',
      'Sẵn sàng đi công tác ngắn ngày khi có yêu cầu chuyển giao công nghệ',
      'Trung thực, cẩn trọng, có tinh thần trách nhiệm cao đối với thiết bị y tế'
    ],
    benefits: [
      'Được gửi đi đào tạo chuyên sâu chính hãng bởi các chuyên gia nước ngoài (DIRUI, Wondfo, EKF)',
      'Đóng BHXH, BHYT đầy đủ theo Luật Lao động, bảo hiểm sức khỏe cao cấp',
      'Thưởng tháng lương 13, thưởng hiệu quả kinh doanh dự án định kỳ',
      'Môi trường làm việc nhân văn, đồng nghiệp chuyên nghiệp, hỗ trợ tối đa'
    ]
  },
  {
    id: 'job-2',
    title: 'Chuyên viên Kinh doanh Thiết bị Y tế & Hóa chất phòng Lab',
    department: 'Phòng Kinh doanh Thiết bị',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary: '12.000.000 - 30.000.000 VNĐ (Lương cứng + Hoa hồng không giới hạn)',
    deadline: '15/03/2025',
    experience: 'Tối thiểu 1 năm sales B2B hoặc thiết bị khoa học kỹ thuật',
    description: 'Tìm kiếm, tiếp cận và phát triển quan hệ khách hàng là các bệnh viện công, bệnh viện tư nhân, phòng khám đa khoa và trung tâm xét nghiệm trên địa bàn được phân công.',
    requirements: [
      'Tốt nghiệp chuyên ngành Dược, Y tế công cộng, Quản trị kinh doanh hoặc Sinh học',
      'Kỹ năng giao tiếp, đàm phán hợp đồng thương mại xuất sắc',
      'Nhanh nhẹn, có khả năng làm việc độc lập và chịu áp lực doanh số'
    ],
    benefits: [
      'Hoa hồng doanh số hấp dẫn, thanh toán minh bạch theo từng kỳ bán lẻ/thầu',
      'Cung cấp data khách hàng tiềm năng và hỗ trợ kỹ thuật viên đi demo sản phẩm',
      'Cơ hội thăng tiến lên Trưởng nhóm / Giám đốc kinh doanh vùng'
    ]
  },
  {
    id: 'job-3',
    title: 'Chuyên viên Ứng dụng Lâm sàng (Application Specialist)',
    department: 'Phòng R&D và Hỗ trợ Khách hàng',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary: '14.000.000 - 22.000.000 VNĐ',
    deadline: '10/03/2025',
    experience: 'Từ 1 năm kinh nghiệm tại phòng xét nghiệm y khoa',
    description: 'Hỗ trợ kỹ thuật viên xét nghiệm tối ưu hóa thông số hóa chất, kiểm soát chất lượng nội kiểm QC/ngoại kiểm EQAS và xử lý các vấn đề chuyên môn xét nghiệm.',
    requirements: [
      'Tốt nghiệp Cử nhân Kỹ thuật Xét nghiệm Y học (Đại học Y Hà Nội, ĐH Dược...)',
      'Thành thạo quy trình xét nghiệm sinh hóa, miễn dịch và kiểm tra chất lượng phòng Lab',
      'Có khả năng đọc hiểu tài liệu kỹ thuật tiếng Anh'
    ],
    benefits: [
      'Được tiếp cận các công nghệ xét nghiệm tiên tiến nhất trên thế giới',
      'Thời gian làm việc linh hoạt, phụ cấp công tác và điện thoại đầy đủ',
      'Lộ trình phát triển chuyên gia ứng dụng sản phẩm y khoa hàng đầu'
    ]
  }
];
