import React from 'react';

interface PageBannerProps {
  title: string;
  backgroundImage: string;
  breadcrumbs: {
    label: string;
    onClick?: () => void;
  }[];
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  backgroundImage,
  breadcrumbs,
}) => {
  return (
    <div
      className="relative w-full py-5 sm:py-8 md:py-10 bg-cover bg-center flex items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.62)), url('${backgroundImage}')`,
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-[19px] sm:text-[25px] md:text-[30px] font-extrabold uppercase tracking-wide text-white drop-shadow-md mb-2 leading-tight">
          {title}
        </h1>

        {/* Breadcrumb pill exactly as thietbiytegroup.com */}
        <nav aria-label="Breadcrumb">
          <ol className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/95 text-[#334155] text-[11.5px] sm:text-[13px] font-medium shadow-md max-w-[92vw] overflow-x-auto no-scrollbar">
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#94a3b8] text-[10px] sm:text-[11px]">/</span>}
                <li className="whitespace-nowrap shrink-0">
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="hover:text-[#bb0112] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {idx === 0 && (
                        <span className="material-symbols-outlined text-[15px] text-[#006194]">
                          home
                        </span>
                      )}
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <span className="text-[#bb0112] font-semibold">{item.label}</span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};
