import React from 'react';
import { Product } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { Brand, brandFaq, brandOf, brandSubject, productKeySpec } from '../seo/brands';
import { PRODUCT_CATEGORY_LABELS } from '../seo/routes';

const keySpec = (product: Product) => productKeySpec(product.specs, product.shortDesc);

/** Product names grouped by category label, as used in the comparison table and the FAQ. */
export function groupByCategory(products: Product[]): Record<string, Product[]> {
  const groups: Record<string, Product[]> = {};
  for (const p of products) {
    const label = PRODUCT_CATEGORY_LABELS[p.category] ?? p.categoryLabel;
    (groups[label] ??= []).push(p);
  }
  return groups;
}

/**
 * Below the product grid on a brand page (/thuong-hieu/<slug>): a comparison of the brand's models by
 * category and answers to common buyer questions, so the page covers searches like "máy xét nghiệm Dirui".
 */
export const BrandGuide: React.FC<{
  brand: Brand;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}> = ({ brand, products, onSelectProduct }) => {
  const own = products.filter((p) => brandOf(p.brand)?.slug === brand.slug);
  if (!own.length) return null;
  const groups = groupByCategory(own);
  const faq = brandFaq(
    brand,
    Object.fromEntries(Object.entries(groups).map(([label, list]) => [label, list.map((p) => p.model || p.name)])),
    COMPANY_INFO.hotline
  );

  return (
    <div className="mt-16 space-y-12">
      <section aria-labelledby="brand-compare">
        <h2 id="brand-compare" className="text-[22px] sm:text-[26px] font-bold text-[#111]">
          So sánh các dòng {brandSubject(brand)}
        </h2>
        <div className="mt-6 space-y-8">
          {Object.entries(groups).map(([label, list]) => (
            <div key={label}>
              <h3 className="text-[17px] font-semibold text-[#0a2540] mb-3">
                {label} ({list.length})
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#e3e9f0]">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[#f3f7fb] text-[#111]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Model</th>
                      <th className="px-4 py-3 font-semibold">Thông số nổi bật</th>
                      <th className="px-4 py-3 font-semibold">Xuất xứ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p) => (
                      <tr key={p.id} className="border-t border-[#eef2f6] align-top">
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => onSelectProduct(p)}
                            className="text-left font-semibold text-[#0a2540] hover:text-[#0a94dc] fx-link cursor-pointer"
                          >
                            {p.name}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-[#374151]">{keySpec(p)}</td>
                        <td className="px-4 py-3 text-[#374151] whitespace-nowrap">{p.origin || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="brand-faq">
        <h2 id="brand-faq" className="text-[22px] sm:text-[26px] font-bold text-[#111]">
          Câu hỏi thường gặp về {brand.name}
        </h2>
        <div className="mt-6 divide-y divide-[#eef2f6] rounded-xl border border-[#e3e9f0] bg-white">
          {faq.map((item, i) => (
            <details key={item.q} open={i === 0} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-semibold text-[#111]">
                <h3>{item.q}</h3>
                <span className="material-symbols-outlined text-[#0a94dc] transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[#374151]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
