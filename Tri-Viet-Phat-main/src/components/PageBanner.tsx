import React from 'react';

interface PageBannerProps {
  title: string;
  /** Kept for API compatibility; the flat page header no longer shows a photo. */
  backgroundImage?: string;
  breadcrumbs: {
    label: string;
    onClick?: () => void;
  }[];
}

export const PageBanner: React.FC<PageBannerProps> = ({ title, breadcrumbs }) => {
  return (
    <div className="w-full bg-[#f8fafc] border-b border-[#e2e8f0]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[13px] text-[#64748b] overflow-x-auto no-scrollbar">
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <li aria-hidden="true" className="text-[#cbd5e1]">/</li>}
                <li className="whitespace-nowrap shrink-0">
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="hover:text-[#006194] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="text-[#0f172a]" aria-current="page">
                      {item.label}
                    </span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <h1 className="mt-3 text-[26px] sm:text-[34px] font-bold text-[#0f172a] tracking-tight leading-tight [text-wrap:balance]">
          {title}
        </h1>
      </div>
    </div>
  );
};
