import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Building blocks shared by the admin screens.

/** A value remembered in this browser (box open/closed, hidden boxes…); falls back silently in private mode. */
export function useStored<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(`td-admin:${key}`);
      return raw == null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });
  const set = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(`td-admin:${key}`, JSON.stringify(v));
    } catch {
      /* not remembered */
    }
  };
  return [value, set];
}

export function PageTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <h1 className="m-0 text-[23px] font-normal leading-tight">{children}</h1>
      {action}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[var(--wp-muted)]">
      <span className="wp-spinner" aria-hidden="true" />
      {label}
    </span>
  );
}

/** A WordPress "metabox": title bar that folds the box away (remembered per box). */
export function Box({
  id,
  title,
  children,
  flush = false,
  defaultOpen = true,
  className = '',
  headerExtra,
}: {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  flush?: boolean;
  defaultOpen?: boolean;
  className?: string;
  headerExtra?: React.ReactNode;
}) {
  const [closed, setClosed] = useStored<boolean>(`box:${id}`, !defaultOpen);
  return (
    <section className={`wp-box ${className}`}>
      <div className="wp-box-head" style={closed ? { borderBottom: 0 } : undefined}>
        <button
          type="button"
          className="flex-1 text-left px-3 py-2.5 font-semibold text-[14px] cursor-pointer"
          aria-expanded={!closed}
          onClick={() => setClosed(!closed)}
        >
          {title}
        </button>
        {headerExtra}
        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center text-[#787c82] hover:text-[#1d2327] cursor-pointer"
          aria-label={closed ? 'Mở rộng' : 'Thu gọn'}
          onClick={() => setClosed(!closed)}
        >
          <span
            className={`block w-0 h-0 border-x-[5px] border-x-transparent ${closed ? 'border-t-[6px] border-t-current' : 'border-b-[6px] border-b-current'}`}
          />
        </button>
      </div>
      {!closed && <div className={flush ? '' : 'p-3'}>{children}</div>}
    </section>
  );
}

export type NoticeKind = 'success' | 'error' | 'info' | 'warning';

export function Notice({ kind = 'success', children, onDismiss }: { kind?: NoticeKind; children: React.ReactNode; onDismiss?: () => void }) {
  return (
    <div className={`wp-notice ${kind === 'success' ? '' : `is-${kind}`}`} role={kind === 'error' ? 'alert' : 'status'}>
      <div className="flex-1 py-0.5">{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Ẩn thông báo" className="text-[#787c82] hover:text-[var(--wp-red)] cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
  wide = false,
  footer,
}: {
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-0 sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white w-full h-full sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl ${wide ? 'sm:max-w-[1200px]' : 'sm:max-w-[720px]'}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--wp-line)] px-4 h-[52px] shrink-0">
          <h2 className="m-0 text-[20px] font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="w-10 h-10 -mr-2 flex items-center justify-center text-[#646970] hover:text-[var(--wp-blue)] cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">{children}</div>
        {footer && <div className="shrink-0 border-t border-[var(--wp-line)] px-4 py-3 bg-[#f6f7f7] flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
