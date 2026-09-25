import React from 'react';
import { Product } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { BrandFaq, productDisplayName } from '../seo/brands';
import { CATEGORY_BLURBS, CATEGORY_GUIDES, categoryFaq } from '../seo/guides';
import { PRODUCT_CATEGORY_LABELS } from '../seo/routes';
import { navLink } from '../seo/navLink';

/** FAQ entries for /san-pham (category 'all') or one category page. */
export function guideFaq(category: string, products: Product[]): BrandFaq[] {
  const guide = CATEGORY_GUIDES[category];
  const own = guide?.faq ?? [];
  const label = PRODUCT_CATEGORY_LABELS[category];
  if (!label) return own;
  const models = products.filter((p) => p.category === category).map((p) => productDisplayName(p.name, p.brand));
  return models.length ? [...own, ...categoryFaq(label, models, COMPANY_INFO.hotline)] : own;
}

/**
 * Buying guide under the product grid on /san-pham and category pages: what the machines do, how to
 * choose, and common questions — the content broad searches like "máy xét nghiệm" reward.
 */
export const CategoryGuide: React.FC<{
  category: string;
  products: Product[];
  onSelectCategory: (key: string) => void;
}> = ({ category, products, onSelectCategory }) => {
  const guide = CATEGORY_GUIDES[category];
  if (!guide) return null;
  const faq = guideFaq(category, products);

  return (
    <div className="mt-16 space-y-10">
      <section aria-labelledby="category-guide">
        <h2 id="category-guide" className="text-[22px] sm:text-[26px] font-bold text-[#111]">
          {guide.heading}
        </h2>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#374151] max-w-3xl">
          {guide.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {category === 'all' && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {Object.entries(CATEGORY_BLURBS).map(([key, blurb]) => (
              <li key={key} className="rounded-xl border border-[#e3e9f0] bg-white p-4">
                <a
                  {...navLink({ tab: 'san-pham', cat: key }, () => onSelectCategory(key))}
                  className="font-semibold text-[#0a2540] hover:text-[#0a94dc] fx-link"
                >
                  {PRODUCT_CATEGORY_LABELS[key]}
                </a>
                <p className="mt-1 text-[14px] text-[#4b5563]">{blurb.charAt(0).toUpperCase() + blurb.slice(1)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {faq.length > 0 && (
        <section aria-labelledby="category-faq">
          <h2 id="category-faq" className="text-[22px] sm:text-[26px] font-bold text-[#111]">
            Câu hỏi thường gặp
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
      )}
    </div>
  );
};
