import React from 'react';

interface LogoProps {
  className?: string;
}

/** Facebook mark: blue disc with the white "f" (white layer shows through the cut-out). */
export const FacebookLogo: React.FC<LogoProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12.073" r="12" fill="#fff" />
    <path
      fill="#1877f2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

/** Zalo mark: blue tile, white speech bubble, "Zalo" wordmark (set in the site's Quicksand). */
export const ZaloLogo: React.FC<LogoProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
    <rect width="48" height="48" rx="12" fill="#0068ff" />
    <path
      fill="#fff"
      d="M24 7C14.06 7 6 13.72 6 22c0 4.3 2.4 8.3 6.4 11.5-.2 2.5-1.4 4.8-3.4 6.5 3.6.3 6.8-.9 8.8-3.9 1.9.6 4 .9 6.2.9 9.94 0 18-6.72 18-15S33.94 7 24 7Z"
    />
    <text
      x="24"
      y="26.5"
      textAnchor="middle"
      fill="#0068ff"
      fontSize="12.5"
      fontWeight="700"
      letterSpacing="-0.3"
    >
      Zalo
    </text>
  </svg>
);
