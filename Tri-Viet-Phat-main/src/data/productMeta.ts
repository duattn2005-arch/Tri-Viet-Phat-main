import { Product } from '../types';

/**
 * The scraped `brand` field is inconsistent ("DIRUI INDUSTRIAL CO., LTD",
 * "Dirui Indistrial Co., Ltd", "Jiangsu Audicom Medical…"). Map it to a short,
 * stable display name for filters and product cards.
 */
const BRAND_ALIASES: [RegExp, string][] = [
  [/dirui/i, 'Dirui'],
  [/dewei/i, 'Dewei'],
  [/\bdfi\b/i, 'DFI'],
  [/ekf/i, 'EKF'],
  [/audicom/i, 'Audicom'],
  [/yhlo/i, 'YHLO'],
  [/wondfo/i, 'Wondfo'],
];

export function brandName(product: Product): string {
  for (const [pattern, name] of BRAND_ALIASES) {
    if (pattern.test(product.brand)) return name;
  }
  return 'Khác';
}

export function originName(product: Product): string {
  const origin = (product.origin || '').trim();
  if (/^china$/i.test(origin)) return 'Trung Quốc';
  return origin || 'Đang cập nhật';
}
