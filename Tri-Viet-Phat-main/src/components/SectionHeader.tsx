import React from 'react';
import { MaskText, Reveal } from './motion/Reveal';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Left-aligned section heading (bold, uppercase — Torano-style), with an
 * optional short description and an optional quiet text link on the right.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <Reveal className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
    <div className="max-w-2xl">
      <span
        className="block mb-4 h-[3px] w-12 bg-linear-to-r from-[#0a94dc] to-[#e11d2a]"
        aria-hidden="true"
      />
      <h2 className="text-[20px] sm:text-[26px] font-bold text-[#111111] uppercase leading-tight">
        <MaskText text={title} />
      </h2>
      {description && <p className="mt-2 text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">{description}</p>}
    </div>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="group hidden sm:inline-flex shrink-0 items-center gap-1 text-[14px] font-medium text-[#111111] fx-link cursor-pointer"
      >
        <span>{actionLabel}</span>
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
    )}
  </Reveal>
);

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
