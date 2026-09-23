import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Left-aligned section heading used across the home page: sentence-case
 * title, optional one-line description, optional quiet text link on the right.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
    <div className="max-w-2xl">
      <h2 className="text-[24px] sm:text-[30px] font-bold text-[#0f172a] tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] text-[#475569] leading-relaxed">{description}</p>
      )}
    </div>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="shrink-0 inline-flex items-center gap-1 text-[14px] font-semibold text-[#006194] hover:text-[#004a73] cursor-pointer"
      >
        <span>{actionLabel}</span>
        <span aria-hidden="true">→</span>
      </button>
    )}
  </div>
);
