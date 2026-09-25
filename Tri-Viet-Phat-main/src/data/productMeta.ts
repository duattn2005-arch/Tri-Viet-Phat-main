import { Product } from '../types';
import { brandOf } from '../seo/brands';

/** Short, stable brand name for filters and product cards ("Khác" when unknown). */
export function brandName(product: Product): string {
  return brandOf(product.brand)?.name ?? 'Khác';
}

export function originName(product: Product): string {
  const origin = (product.origin || '').trim();
  if (/^china$/i.test(origin)) return 'Trung Quốc';
  return origin || 'Đang cập nhật';
}
