// Manufacturer brands: display names for filters/cards and the /thuong-hieu/<slug> landing pages.
// Plain TypeScript so seo-plugin.ts can use it at build time.

export interface Brand {
  slug: string;
  /** Short display name, also the value of the brand filter in ProductsScreen */
  name: string;
  /** Matches the inconsistent scraped `brand` field ("DIRUI INDUSTRIAL CO., LTD", "Dirui Indistrial…") */
  pattern: RegExp;
  /** Page heading and main keyword */
  heading: string;
  intro: string;
}

export const BRANDS: Brand[] = [
  {
    slug: 'dirui',
    name: 'Dirui',
    pattern: /dirui/i,
    heading: 'Máy xét nghiệm Dirui chính hãng',
    intro:
      'DIRUI (Dirui Industrial Co., Ltd., Trung Quốc) chuyên sản xuất thiết bị chẩn đoán in vitro. Trí Việt Phát phân phối chính hãng máy xét nghiệm sinh hóa Dirui, máy xét nghiệm nước tiểu Dirui và máy xét nghiệm huyết học Dirui, đủ CO/CQ, kèm hóa chất, lắp đặt, đào tạo và bảo hành tận nơi trên toàn quốc.',
  },
  {
    slug: 'dewei',
    name: 'Dewei',
    pattern: /dewei/i,
    heading: 'Hóa chất xét nghiệm Dewei chính hãng',
    intro:
      'Hóa chất huyết học Dewei (Dewei Medical, Trung Quốc) dùng cho máy phân tích huyết học, sẵn kho tại Hà Nội. Trí Việt Phát cung cấp đầy đủ danh mục dung dịch pha loãng, ly giải và rửa, giao nhanh toàn quốc.',
  },
  {
    slug: 'dfi',
    name: 'DFI',
    pattern: /\bdfi\b/i,
    heading: 'Máy xét nghiệm nước tiểu DFI chính hãng',
    intro:
      'Máy xét nghiệm nước tiểu DUS của DFI Co., Ltd. (Hàn Quốc) cho phòng khám và bệnh viện. Trí Việt Phát phân phối chính hãng, cung cấp que thử, lắp đặt và bảo hành tận nơi.',
  },
  {
    slug: 'audicom',
    name: 'Audicom',
    pattern: /audicom/i,
    heading: 'Máy xét nghiệm điện giải Audicom',
    intro:
      'Máy xét nghiệm điện giải Audicom (Jiangsu Audicom Medical Technology, Trung Quốc) đo Na, K, Cl, Ca, Li nhanh và chính xác. Trí Việt Phát phân phối chính hãng, kèm hóa chất và bảo trì định kỳ.',
  },
  {
    slug: 'ekf',
    name: 'EKF',
    pattern: /ekf/i,
    heading: 'Máy xét nghiệm HbA1c EKF chính hãng',
    intro:
      'Máy xét nghiệm HbA1c của EKF Diagnostics (Đức) cho kết quả nhanh, phù hợp phòng khám và khoa nội tiết. Trí Việt Phát phân phối chính hãng, lắp đặt và hướng dẫn sử dụng tận nơi.',
  },
  {
    slug: 'yhlo',
    name: 'YHLO',
    pattern: /yhlo/i,
    heading: 'Máy xét nghiệm miễn dịch YHLO',
    intro:
      'Máy xét nghiệm miễn dịch hóa phát quang YHLO (Shenzhen YHLO Biotech, Trung Quốc) cho bệnh viện và trung tâm xét nghiệm. Trí Việt Phát cung cấp máy, hóa chất và dịch vụ kỹ thuật chính hãng.',
  },
  {
    slug: 'wondfo',
    name: 'Wondfo',
    pattern: /wondfo/i,
    heading: 'Máy phân tích đông máu Wondfo',
    intro:
      'Máy phân tích đông máu Wondfo (Wondfo Biotech, Trung Quốc) cho các xét nghiệm PT, APTT, TT, FIB. Trí Việt Phát phân phối chính hãng, kèm hóa chất, lắp đặt và bảo hành.',
  },
];

/** Brand of a product from its scraped `brand` text, or undefined when unknown. */
export function brandOf(rawBrand: string | undefined): Brand | undefined {
  return BRANDS.find((b) => b.pattern.test(rawBrand || ''));
}

export const brandBySlug = (slug: string | undefined) => BRANDS.find((b) => b.slug === slug);
