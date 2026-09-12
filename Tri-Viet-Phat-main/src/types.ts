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
