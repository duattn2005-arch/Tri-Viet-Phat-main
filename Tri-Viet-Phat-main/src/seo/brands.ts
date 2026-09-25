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

/**
 * Product name as people search for it: the brand goes right before the model code
 * ("Máy xét nghiệm sinh hóa tự động CS-T240" → "… tự động Dirui CS-T240"), or at the end when the name has
 * no model code. Names that already mention the brand are left alone.
 */
export function productDisplayName(name: string, rawBrand: string | undefined): string {
  // Tidy scraped model codes: "CS –T240" / "CS - 1200" → "CS-T240" / "CS-1200"
  const clean = name
    .replace(/\s+/g, ' ')
    .replace(/([A-Z])\s*[–-]\s*([A-Z0-9])/g, '$1-$2')
    .trim();
  const brand = brandOf(rawBrand);
  if (!brand || clean.toLowerCase().includes(brand.name.toLowerCase())) return clean;
  // A model code, optionally led by an all-caps series name ("DUS R-300", "BCC-3900", "AC9803")
  const code = clean.match(/(^|\s)((?:[A-Z]{2,5} )?[A-Z]{1,4}-?[A-Z]?\d{2,5}[A-Z]?)(?=\s|$)/);
  if (!code || code.index === undefined) return `${clean} ${brand.name}`;
  const at = code.index + code[1].length;
  return `${clean.slice(0, at)}${brand.name} ${clean.slice(at)}`;
}

/** The spec buyers compare models on: throughput first, otherwise the first listed spec. */
export function productKeySpec(specs: { label: string; value: string }[] | undefined, fallback = ''): string {
  const list = specs ?? [];
  const spec = list.find((s) => /tốc độ|công suất|test\/h|mẫu\/giờ/i.test(`${s.label} ${s.value}`)) ?? list[0];
  return spec ? `${spec.label}: ${spec.value}`.replace(/[\s.;,]+$/, '') : fallback;
}

/** "Máy xét nghiệm Dirui chính hãng" → "máy xét nghiệm Dirui", for use inside a sentence (brand name kept). */
export function brandSubject(brand: Brand): string {
  const subject = brand.heading.replace(/ chính hãng$/, '');
  return subject.charAt(0).toLowerCase() + subject.slice(1);
}

export interface BrandFaq {
  q: string;
  a: string;
}

/**
 * Questions buyers type into Google ("mua máy xét nghiệm Dirui ở đâu", "giá máy Dirui"…), answered from
 * the catalogue. Shown on the brand page and marked up as FAQPage. Answers only restate what the site
 * already says (genuine goods with CO/CQ, installation and training, 12-month warranty, quotes by phone).
 */
export function brandFaq(brand: Brand, productsByCategory: Record<string, string[]>, hotline: string): BrandFaq[] {
  const lines = Object.entries(productsByCategory)
    .map(([category, models]) => `${category}: ${models.join(', ')}`)
    .join('; ');
  const machine = brandSubject(brand);
  return [
    {
      q: `Mua ${machine} chính hãng ở đâu?`,
      a: `Trí Việt Phát (Hoàng Mai, Hà Nội) phân phối ${machine} chính hãng, đủ CO/CQ, giao hàng và lắp đặt trên toàn quốc. Gọi hotline ${hotline} để được tư vấn cấu hình phù hợp.`,
    },
    {
      q: `Trí Việt Phát có những sản phẩm ${brand.name} nào?`,
      a: `${lines}. Mỗi sản phẩm có trang riêng với thông số kỹ thuật chi tiết.`,
    },
    {
      q: `Giá ${machine} bao nhiêu?`,
      a: `Giá phụ thuộc model, cấu hình và hóa chất đi kèm. Vui lòng gọi hotline ${hotline} hoặc gửi yêu cầu báo giá trên website để nhận báo giá và chính sách chiết khấu.`,
    },
    {
      q: `Mua ${brand.name} tại Trí Việt Phát có được lắp đặt và bảo hành không?`,
      a: `Có. Kỹ sư Trí Việt Phát lắp đặt tận nơi, chạy mẫu, hướng dẫn sử dụng và bảo hành 12 tháng; sau đó hỗ trợ bảo trì định kỳ và cung cấp hóa chất, vật tư.`,
    },
  ];
}
