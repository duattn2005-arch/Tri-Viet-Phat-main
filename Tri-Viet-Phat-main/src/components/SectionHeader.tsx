import React from 'react';
import { motion } from 'motion/react';
import { MaskText, Reveal } from './motion/Reveal';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** 'center' adds the ECG ornament under the title (home page sections). */
  align?: 'left' | 'center';
}

/** Blue→red rules with a red heartbeat line that draws itself in when scrolled into view. */
const PulseOrnament: React.FC = () => (
  <div className="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
    <span className="h-px w-16 sm:w-24 bg-linear-to-r from-transparent to-[#0a94dc]" />
    <svg viewBox="0 0 64 24" className="w-14 h-6 text-[#e11d2a]" fill="none">
      <motion.path
        d="M0 12h18l4-8 6 16 5-12 3 4h28"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
      <path
        d="M0 12h18l4-8 6 16 5-12 3 4h28"
        pathLength={100}
        className="ecg-blip"
        stroke="#5cc4ff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="h-px w-16 sm:w-24 bg-linear-to-l from-transparent to-[#e11d2a]" />
  </div>
);

/**
 * Section heading. Left-aligned by default (accent bar + uppercase title + optional link on the
 * right); `align="center"` gives a centred title with the heartbeat ornament.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  align = 'left',
}) => {
  if (align === 'center') {
    return (
      <Reveal className="mb-8 sm:mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-[24px] sm:text-[32px] font-bold text-[#0a2540] leading-tight">
          <MaskText text={title} />
        </h2>
        <PulseOrnament />
        {description && (
          <p className="mt-4 text-[14px] sm:text-[16px] text-[#555555] leading-relaxed">{description}</p>
        )}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="group mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-[#0a94dc] fx-link cursor-pointer"
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        )}
      </Reveal>
    );
  }

  return (
    <Reveal className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
      <div className="max-w-2xl">
        <span
          className="block mb-4 h-[3px] w-12 bg-linear-to-r from-[#0a94dc] to-[#e11d2a]"
          aria-hidden="true"
        />
        <h2 className="text-[20px] sm:text-[26px] font-bold text-[#111111] uppercase leading-tight">
          <MaskText text={title} />
        </h2>
        {description && (
          <p className="mt-2 text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="group hidden sm:inline-flex shrink-0 items-center gap-1 text-[14px] font-medium text-[#111111] fx-link cursor-pointer"
        >
          <span>{actionLabel}</span>
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      )}
    </Reveal>
  );
};

interface ViewAllButtonProps {
  label: string;
  onClick: () => void;
}

/** Centered thin-outline button placed under a grid, as on torano.vn. */
export const ViewAllButton: React.FC<ViewAllButtonProps> = ({ label, onClick }) => (
  <div className="mt-8 sm:mt-10 flex justify-center">
    <button
      type="button"
      onClick={onClick}
      className="group relative h-11 px-8 overflow-hidden border border-[#0a2540] text-[13px] font-semibold uppercase tracking-wide text-[#111111] cursor-pointer"
    >
      {/* Fill sweeps in from the left on hover */}
      <span className="absolute inset-0 bg-[#0a2540] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      <span className="relative group-hover:text-white transition-colors duration-500">{label}</span>
    </button>
  </div>
);
