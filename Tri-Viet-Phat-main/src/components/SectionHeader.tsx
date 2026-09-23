import React from 'react';

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
  <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
    <div className="max-w-2xl">
      <h2 className="text-[20px] sm:text-[26px] font-bold text-[#111111] uppercase leading-tight">{title}</h2>
      {description && <p className="mt-2 text-[14px] sm:text-[15px] text-[#555555] leading-relaxed">{description}</p>}
    </div>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="hidden sm:inline-flex shrink-0 items-center gap-1 text-[14px] font-medium text-[#111111] hover:text-[#111111] hover:underline underline-offset-4 cursor-pointer"
      >
        <span>{actionLabel}</span>
        <span aria-hidden="true">→</span>
      </button>
    )}
  </div>
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
      className="h-11 px-8 border border-[#111111] text-[13px] font-semibold uppercase tracking-wide text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
    >
      {label}
    </button>
  </div>
);
