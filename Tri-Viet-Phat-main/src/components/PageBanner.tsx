import React from 'react';
import { AmbientGlow, MaskText, ParallaxImage } from './motion/Reveal';

interface PageBannerProps {
  title: string;
  /** Kept for API compatibility; the old scraped banner images carry baked-in text, so a lab photo is used instead. */
  backgroundImage?: string;
  /** Optional short line under the title. */
  subtitle?: string;
  /** Photo behind the navy overlay. */
  image?: string;
  breadcrumbs: {
    label: string;
    onClick?: () => void;
  }[];
}

/** Brand-navy page header shared by every inner page: lab photo (parallax), drifting glows, animated title. */
export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  image = '/images/hero-lab-analyzers.jpg',
  breadcrumbs,
}) => {
  return (
    <div className="fx-spotlight relative w-full overflow-hidden bg-[#0a2540] text-white">
      <ParallaxImage src={image} className="opacity-30" strength={10} />
      <div
        className="absolute inset-0 bg-linear-to-r from-[#0a2540] via-[#0a2540]/85 to-[#0b3a66]/60"
        aria-hidden="true"
      />
      <AmbientGlow />

      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[12px] text-white/60 overflow-x-auto no-scrollbar">
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <li aria-hidden="true" className="text-white/30">
                    /
                  </li>
                )}
                <li className="whitespace-nowrap shrink-0">
                  {item.onClick ? (
                    <button onClick={item.onClick} className="hover:text-white transition-colors cursor-pointer">
                      {item.label}
                    </button>
                  ) : (
                    <span className="text-white" aria-current="page">
                      {item.label}
                    </span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <h1 className="mt-2 text-[22px] sm:text-[26px] font-bold tracking-tight leading-tight [text-wrap:balance] max-w-4xl">
          <MaskText key={title} text={title} />
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[13px] sm:text-[14px] text-white/70 leading-relaxed">{subtitle}</p>
        )}

        {/* Brand accent bar: logo blue into red */}
        <span
          className="mt-3 block h-[2px] w-12 bg-linear-to-r from-[#0a94dc] to-[#e11d2a]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
