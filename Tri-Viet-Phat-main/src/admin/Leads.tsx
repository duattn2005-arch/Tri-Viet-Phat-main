import React, { useEffect, useMemo, useState } from 'react';
import { Download, Mail, MessageCircle, Phone } from 'lucide-react';
import { api, type Lead } from './api';
import { useAdmin } from './App';
import { formatDateTime, timeAgo } from './schema';
import { Modal, PageTitle, Spinner } from './ui';

// "Liên hệ": every request sent from the website's forms (quote, consultation, repair, job
// application, newsletter). They also go to Telegram and email; this is the complete record.

const MAIN_LABELS = ['Họ và tên', 'Số điện thoại', 'Email', 'Email / SĐT'];

const summaryOf = (l: Lead) =>
  l.fields
    .filter(([label]) => !MAIN_LABELS.includes(label))
    .map(([label, value]) => `${label}: ${value}`)
    .join(' · ');

const emailOf = (l: Lead) => (/@/.test(l.contact) ? l.contact : '');
/** The page address comes from the visitor's browser: only real web links become clickable. */
const safeLink = (u: string) => (/^https?:\/\//i.test(u) ? u : '');
const zaloOf = (phone: string) => `https://zalo.me/${phone.replace(/[^0-9]/g, '').replace(/^84/, '0')}`;

function exportCsv(leads: Lead[]) {
  const cell = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [
    ['Thời gian', 'Loại yêu cầu', 'Họ tên', 'Số điện thoại', 'Email / liên hệ', 'Nội dung', 'Gửi từ trang'],
    ...leads.map((l) => [formatDateTime(l.time), l.title, l.name, l.phone, l.contact, summaryOf(l), l.page]),
  ];
  // BOM so that Excel reads the Vietnamese letters correctly
  const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `lien-he-tri-duc-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}

export function Leads() {
  const { notify, refreshLeads } = useAdmin();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [kind, setKind] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Lead | null>(null);

  useEffect(() => {
    api.leads().then(setLeads, (e) => setError(e.message));
  }, []);

  const kinds = useMemo(() => [...new Map((leads ?? []).map((l) => [l.kind, l.title])).entries()], [leads]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (leads ?? [])
      .filter((l) => !onlyUnread || !l.read)
      .filter((l) => !kind || l.kind === kind)
      .filter((l) => !q || [l.name, l.phone, l.contact, summaryOf(l)].join(' ').toLowerCase().includes(q));
  }, [leads, onlyUnread, kind, query]);

  const change = async (ids: string[], op: 'read' | 'unread' | 'delete') => {
    if (!ids.length) return;
    if (op === 'delete' && !window.confirm(`Xóa ${ids.length} yêu cầu? Không thể hoàn tác.`)) return;
    try {
      await api.updateLeads(ids, op);
      setLeads((list) =>
        op === 'delete' ? (list ?? []).filter((l) => !ids.includes(l.id)) : (list ?? []).map((l) => (ids.includes(l.id) ? { ...l, read: op === 'read' } : l))
      );
      setSelected(new Set());
      refreshLeads();
      if (op === 'delete') notify({ kind: 'success', text: `Đã xóa ${ids.length} yêu cầu.` });
    } catch (e: any) {
      notify({ kind: 'error', text: e.message });
    }
  };

  const view = (l: Lead) => {
    setOpen(l);
    if (!l.read) change([l.id], 'read');
  };

  const unread = (leads ?? []).filter((l) => !l.read).length;
  const allChecked = visible.length > 0 && visible.every((l) => selected.has(l.id));

  return (
    <div>
      <PageTitle
        action={
          leads?.length ? (
            <button type="button" className="wp-btn" onClick={() => exportCsv(visible)}>
              <Download className="w-3.5 h-3.5" /> Xuất Excel (CSV)
            </button>
          ) : undefined
        }
      >
        Liên hệ
      </PageTitle>
      <p className="mt-0 text-[var(--wp-muted)]">Yêu cầu gửi từ các form trên website: báo giá, tư vấn, sửa chữa, ứng tuyển, đăng ký nhận tin. Mỗi yêu cầu cũng đã được gửi về Telegram và email.</p>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-1.5 text-[13px]">
          <button type="button" onClick={() => setOnlyUnread(false)} className={`cursor-pointer ${!onlyUnread ? 'font-semibold' : 'text-[var(--wp-blue)]'}`}>
            Tất cả <span className="text-[var(--wp-muted)] font-normal">({leads?.length ?? 0})</span>
          </button>
          <span className="text-[#a7aaad]">|</span>
          <button type="button" onClick={() => setOnlyUnread(true)} className={`cursor-pointer ${onlyUnread ? 'font-semibold' : 'text-[var(--wp-blue)]'}`}>
            Chưa đọc <span className="text-[var(--wp-muted)] font-normal">({unread})</span>
          </button>
        </div>
        <input className="wp-input !w-60" type="search" placeholder="Tìm tên, số điện thoại…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <button type="button" className="wp-btn" disabled={!selected.size} onClick={() => change([...selected], 'read')}>
          Đánh dấu đã đọc
        </button>
        <button type="button" className="wp-btn" disabled={!selected.size} onClick={() => change([...selected], 'unread')}>
          Đánh dấu chưa đọc
        </button>
        <button type="button" className="wp-btn wp-btn-danger" disabled={!selected.size} onClick={() => change([...selected], 'delete')}>
          Xóa
        </button>
        {kinds.length > 1 && (
          <select className="wp-input !w-auto ml-2" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Lọc theo loại">
            <option value="">Tất cả loại yêu cầu</option>
            {kinds.map(([k, t]) => (
              <option key={k} value={k}>
                {t}
              </option>
            ))}
          </select>
        )}
        <span className="ml-auto text-[13px] text-[var(--wp-muted)]">{visible.length} mục</span>
      </div>

      {error ? (
        <div className="wp-notice is-error">{error}</div>
      ) : !leads ? (
        <Spinner label="Đang tải…" />
      ) : (
        <div className="overflow-x-auto">
          <table className="wp-table">
            <thead>
              <tr>
                <th className="check">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    aria-label="Chọn tất cả"
                    onChange={() => setSelected(allChecked ? new Set() : new Set(visible.map((l) => l.id)))}
                  />
                </th>
                <th className="font-semibold">Người gửi</th>
                <th className="hidden md:table-cell">Loại yêu cầu</th>
                <th className="hidden lg:table-cell">Nội dung</th>
                <th className="w-[140px]">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[var(--wp-muted)]">
                    {leads.length ? 'Không có yêu cầu nào khớp bộ lọc.' : 'Chưa có yêu cầu nào.'}
                  </td>
                </tr>
              )}
              {visible.map((l) => (
                <tr key={l.id}>
                  <td className="check">
                    <input
                      type="checkbox"
                      checked={selected.has(l.id)}
                      aria-label="Chọn"
                      onChange={() =>
                        setSelected((s) => {
                          const next = new Set(s);
                          if (next.has(l.id)) next.delete(l.id);
                          else next.add(l.id);
                          return next;
                        })
                      }
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => view(l)} className={`wp-link text-left text-[15px] ${l.read ? '' : 'font-bold'}`}>
                      {l.name || l.phone || l.contact || 'Khách'}
                    </button>
                    {!l.read && <span className="ml-2 px-1.5 py-0.5 text-[11px] rounded bg-[#d63638] text-white align-middle">Mới</span>}
                    <div className="text-[13px] text-[var(--wp-muted)]">
                      {l.phone && <a href={`tel:${l.phone}`}>{l.phone}</a>}
                      {l.phone && l.contact && ' · '}
                      {l.contact && (emailOf(l) ? <a href={`mailto:${emailOf(l)}`}>{l.contact}</a> : l.contact)}
                    </div>
                    <div className="row-actions">
                      <button type="button" className="wp-link" onClick={() => view(l)}>
                        Xem
                      </button>
                      {' | '}
                      <button type="button" className="wp-link" onClick={() => change([l.id], l.read ? 'unread' : 'read')}>
                        {l.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                      </button>
                      {' | '}
                      <button type="button" className="wp-link wp-link-danger" onClick={() => change([l.id], 'delete')}>
                        Xóa
                      </button>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">{l.title}</td>
                  <td className="hidden lg:table-cell text-[13px] max-w-[420px]">
                    <span className="line-clamp-2">{summaryOf(l) || '—'}</span>
                  </td>
                  <td className="text-[13px]" title={formatDateTime(l.time)}>
                    {timeAgo(l.time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <Modal
          title={open.title}
          onClose={() => setOpen(null)}
          footer={
            <>
              <button
                type="button"
                className="wp-btn wp-btn-danger mr-auto"
                onClick={() => {
                  change([open.id], 'delete');
                  setOpen(null);
                }}
              >
                Xóa
              </button>
              <button type="button" className="wp-btn" onClick={() => setOpen(null)}>
                Đóng
              </button>
            </>
          }
        >
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {open.phone && (
                <>
                  <a className="wp-btn wp-btn-primary" href={`tel:${open.phone}`}>
                    <Phone className="w-4 h-4" /> Gọi {open.phone}
                  </a>
                  <a className="wp-btn" href={zaloOf(open.phone)} target="_blank" rel="noreferrer">
                    <MessageCircle className="w-4 h-4" /> Nhắn Zalo
                  </a>
                </>
              )}
              {emailOf(open) && (
                <a className="wp-btn" href={`mailto:${emailOf(open)}`}>
                  <Mail className="w-4 h-4" /> Gửi email
                </a>
              )}
            </div>
            <table className="w-full border-collapse text-[14px]">
              <tbody>
                {open.fields.map(([label, value], i) => (
                  <tr key={i} className="border-b border-[#f0f0f1]">
                    <th className="text-left align-top py-2 pr-4 w-[160px] font-semibold">{label}</th>
                    <td className="py-2 whitespace-pre-wrap break-words">{value}</td>
                  </tr>
                ))}
                <tr className="border-b border-[#f0f0f1]">
                  <th className="text-left align-top py-2 pr-4 font-semibold">Thời gian</th>
                  <td className="py-2">{formatDateTime(open.time)}</td>
                </tr>
                {open.page && (
                  <tr>
                    <th className="text-left align-top py-2 pr-4 font-semibold">Gửi từ trang</th>
                    <td className="py-2 break-all">
                      {safeLink(open.page) ? (
                        <a href={safeLink(open.page)} target="_blank" rel="noreferrer">
                          {open.page}
                        </a>
                      ) : (
                        open.page
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
