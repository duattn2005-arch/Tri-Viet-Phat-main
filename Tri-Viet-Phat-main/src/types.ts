export type PageTab = 
  | 'trang-chu' 
  | 'gioi-thieu' 
  | 'san-pham' 
  | 'tai-lieu' 
  | 'tin-tuc' 
  | 'tuyen-dung' 
  | 'lien-he';

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  image: string;
  alt: string;
  shortDesc: string;
  fullDesc: string;
  brand: string;
  origin: string;
  model?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  benefits?: string[];
  detailHtml?: string;
  detailedFeatures?: {
    title: string;
    desc: string;
  }[];
  specs: {
    label: string;
    value: string;
  }[];
  features: string[];
  certifications: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  image: string;
  alt: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string[];
  keyPoints?: string[];
}

export interface Partner {
  name: string;
  /** Logo file in /public/partners, taken from thietbiytegroup.com */
  logo?: string;
  subName?: string;
  highlight?: boolean;
  textColor?: string;
  bgColor?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  code: string;
  type: 'catalog' | 'manual' | 'certificate' | 'specification';
  category: string;
  fileSize: string;
  updateDate: string;
  description: string;
}

export interface Testimonial {
  id: string;
  /** Academic/professional prefix, e.g. "TS. BS.", "ThS.", "CN." */
  title?: string;
  name: string;
  /** Position/department, e.g. "Trưởng khoa Xét nghiệm" */
  role: string;
  facility: string;
  /** City/province, e.g. "Hà Nội", "TP.HCM" */
  location: string;
  avatarUrl?: string;
  avatarInitials: string;
  quote: string;
  /** 1-5 */
  rating: number;
  kpi?: {
    label: string;
    trend: 'up' | 'down';
  };
  /** Display date, e.g. "15/08/2025" */
  datePosted: string;
  /** true = seed/demo content, not a real customer review */
  isPlaceholder?: boolean;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
}
